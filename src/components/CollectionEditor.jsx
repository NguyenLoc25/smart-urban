import React, { useReducer } from "react";
import { Button } from "./ui/button";
import { Plus, Trash, Save } from "lucide-react";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { v4 as uuidv4 } from "uuid";

const energyTypes = ["Solar", "Wind", "Hydro"];
const defaultHeaders = { Solar: "Solar Panel", Wind: "Wind Turbine", Hydro: "Transformer" };
const energyFields = {
  Solar: ["voltage", "current", "output_power"],
  Wind: ["voltage", "current", "rotation_speed", "output_power"],
  Hydro: ["voltage", "current", "shaft_diameter", "rpm", "output_power"]
};

const initialState = [
  { 
    id: uuidv4(), 
    energy_type: "Solar", 
    question_header: defaultHeaders["Solar"],  
    voltage: "", 
    current: "", 
    output_power: "", 
    size: "" 
  }
];

function reducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [...state, { 
        id: uuidv4(), 
        energy_type: "Solar", 
        question_header: defaultHeaders["Solar"],
        ...Object.fromEntries(energyFields["Solar"].map(f => [f, ""]))
      }];
    case "REMOVE":
      return state.filter(q => q.id !== action.id);
    case "UPDATE":
      return state.map(q => (q.id === action.id ? { ...q, [action.field]: action.value } : q));
    case "CHANGE_TYPE":
      return state.map(q =>
        q.id === action.id
          ? { 
              id: q.id, 
              energy_type: action.value, 
              question_header: defaultHeaders[action.value], 
              ...Object.fromEntries(energyFields[action.value].map(f => [f, ""])) 
            }
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
          ...validFields,
        };
      });

      const apiRoute = `/api/settings/${formattedQuestions[0].energy_type.toLowerCase()}`;
      const response = await fetch(apiRoute, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedQuestions[0]),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Request failed");

      alert("Data submitted successfully!");
    } catch (error) {
      console.error("Error submitting data:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary dark:text-primary-light mb-2">
          Energy Device Configuration
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Add and configure your energy monitoring devices
        </p>
      </div>

      <div className="space-y-6">
        {questions.map((q) => (
          <div key={q.id} className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/30">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                Device #{questions.findIndex(item => item.id === q.id) + 1}
              </h3>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => dispatch({ type: "REMOVE", id: q.id })}
                className="hover:scale-105 transition-transform"
              >
                <Trash className="w-4 h-4 mr-2" />
                Remove
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Energy Type
                </label>
                <Select 
                  value={q.energy_type} 
                  onValueChange={value => dispatch({ type: "CHANGE_TYPE", id: q.id, value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {energyTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Device Name
                </label>
                <Input 
                  value={q.question_header} 
                  onChange={e => dispatch({ 
                    type: "UPDATE", 
                    id: q.id, 
                    field: "question_header", 
                    value: e.target.value 
                  })} 
                  placeholder="Enter device name"
                />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {energyFields[q.energy_type]?.map(field => (
                <div key={field} className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {field.replace("_", " ")}
                  </label>
                  <Input 
                    value={q[field] || ""} 
                    onChange={e => dispatch({ 
                      type: "UPDATE", 
                      id: q.id, 
                      field, 
                      value: e.target.value 
                    })}
                    placeholder={`Enter ${field.replace("_", " ")}`}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
        <Button 
          variant="outline"
          onClick={() => dispatch({ type: "ADD" })}
          className="bg-primary/10 hover:bg-primary/20 dark:bg-primary-dark/10 dark:hover:bg-primary-dark/20"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Device
        </Button>
        
        <Button 
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white"
        >
          <Save className="w-5 h-5 mr-2" />
          Save Configuration
        </Button>
      </div>
    </div>
  );
}