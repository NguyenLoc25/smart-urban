import React, { useReducer } from "react";
import { Button } from "./ui/button";
import { Plus, Trash, Save } from "lucide-react";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";

const energyTypes = ["Solar", "Wind", "Water"];
const defaultHeaders = { Solar: "Solar Panel", Wind: "Wind Turbine", Water: "Transformer" };
const energyFields = { Solar: ["voltage", "current", "output_power", "size"], Wind: ["voltage", "current", "rotation_speed"], Water: ["shaft_diameter", "rpm"] };

const initialState = [
  { id: 1, energy_type: "Solar", question_header: defaultHeaders["Solar"], question_required: false, voltage: "", current: "", output_power: "", size: "" }
];

function reducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [...state, { id: Date.now(), energy_type: "Solar", question_header: defaultHeaders["Solar"], question_required: false }];
    case "REMOVE":
      return state.filter(q => q.id !== action.id);
    case "UPDATE":
      return state.map(q => (q.id === action.id ? { ...q, [action.field]: action.value } : q));
    case "CHANGE_TYPE":
      return state.map(q =>
        q.id === action.id
          ? { ...q, energy_type: action.value, question_header: defaultHeaders[action.value], ...Object.fromEntries(energyFields[action.value].map(f => [f, q[f] || ""])) }
          : q
      );
    default:
      return state;
  }
}

export default function CollectionEditor() {
  const [questions, dispatch] = useReducer(reducer, initialState);

  const handleSave = async () => {
    try {
      const formattedQuestions = questions.map((question) => {
        const validFields = Object.fromEntries(
          Object.entries(question).filter(([_, value]) => value !== "" && value !== undefined)
        );
  
        return {
          id: question.id,
          energy_type: question.energy_type,
          question_header: question.question_header,
          question_required: question.question_required,
          ...validFields,
        };
      });
  
      console.log("Sending data:", formattedQuestions);
  
      // Chuyển type về lowercase để khớp với API
      const apiRoute = `/api/settings/${formattedQuestions[0].energy_type.toLowerCase()}`;
  
      const response = await fetch(apiRoute, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedQuestions[0]),
      });
  
      const data = await response.json();
      console.log("Response:", data);
  
      if (!response.ok) throw new Error(data.error || "Request failed");
  
      alert("Data submitted successfully!");
    } catch (error) {
      console.error("Error submitting data:", error);
      alert(`Error: ${error.message}`);
    }
  };
  

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-indigo-600 mb-6">Edit Collection</h1>
      <div className="space-y-5">
        {questions.map((q, index) => (
          <div key={q.id} className="p-4 border rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Question {index + 1}</h3>
              <Button className="bg-red-500 text-white p-2" onClick={() => dispatch({ type: "REMOVE", id: q.id })}>
                <Trash className="w-4 h-4" />
              </Button>
            </div>
            <label className="block mt-3">Energy Type</label>
            <Select value={q.energy_type} onValueChange={value => dispatch({ type: "CHANGE_TYPE", id: q.id, value })}>
              <SelectTrigger><SelectValue placeholder={q.energy_type} /></SelectTrigger>
              <SelectContent>{energyTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent>
            </Select>
            <label className="block mt-3">Question Header</label>
            <Input value={q.question_header} onChange={e => dispatch({ type: "UPDATE", id: q.id, field: "question_header", value: e.target.value })} />
            <div className="mt-3 space-y-2">
              {energyFields[q.energy_type]?.map(field => (
                <div key={field}>
                  <label className="block capitalize">{field.replace("_", " ")}</label>
                  <Input value={q[field] || ""} onChange={e => dispatch({ type: "UPDATE", id: q.id, field, value: e.target.value })} />
                </div>
              ))}
            </div>
            <div className="flex items-center mt-3">
              <Checkbox checked={q.question_required} onCheckedChange={checked => dispatch({ type: "UPDATE", id: q.id, field: "question_required", value: checked })} />
              <span className="ml-2">Required</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-5">
        <Button className="bg-green-500 text-white flex items-center px-4 py-2" onClick={() => dispatch({ type: "ADD" })}>
          <Plus className="w-5 h-5 mr-2" /> Add Question
        </Button>
        <Button className="bg-blue-500 text-white flex items-center px-4 py-2" onClick={handleSave}>
          <Save className="w-5 h-5 mr-2" /> Save
        </Button>
      </div>
    </div>
  );
}