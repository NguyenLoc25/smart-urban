import React, { useState } from "react";
import { Button } from "./ui/button";
import { Plus, Trash } from "lucide-react";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";

const energyTypes = ["Solar", "Wind", "Water"];

export default function CollectionEditor() {
  const [questions, setQuestions] = useState([
    { 
      id: 1, 
      energy_type: "Solar", 
      question_header: "Sample Question", 
      question_required: false,
      voltage: "",
      current: "",
      output_power: "",
      size: ""
    }
  ]);

  const addQuestion = () => {
    setQuestions([...questions, { 
      id: Date.now(), 
      energy_type: "Solar", 
      question_header: "New Question", 
      question_required: false,
      voltage: "",
      current: "",
      output_power: "",
      size: ""
    }]);
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleQuestionChange = (id, field, value) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-indigo-600 mb-6">Edit Collection</h1>

      <div className="space-y-5">
        {questions.map((question, index) => (
          <div key={question.id} className="p-4 border rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Question {index + 1}</h3>
              <Button className="bg-red-500 text-white" onClick={() => removeQuestion(question.id)}>
                <Trash className="w-4 h-4" />
              </Button>
            </div>

            {/* Chọn Energy Type */}
            <label className="block mt-3">Energy Type</label>
            <Select className="w-full mt-1" onValueChange={(value) => handleQuestionChange(question.id, "energy_type", value)}>
              <SelectTrigger>
                <SelectValue placeholder={question.energy_type} />
              </SelectTrigger>
              <SelectContent>
                {energyTypes.map((type, idx) => (
                  <SelectItem key={idx} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Câu hỏi chung */}
            <label className="block mt-3">Question Header</label>
            <Input 
              className="w-full mt-1" 
              value={question.question_header} 
              onChange={(e) => handleQuestionChange(question.id, "question_header", e.target.value)} 
            />

            {/* Nếu energy_type là Solar, hiển thị thêm thông tin */}
            {question.energy_type === "Solar" && (
              <div className="mt-3 space-y-2">
                <label className="block">Voltage (V)</label>
                <Input 
                  className="w-full" 
                  value={question.voltage} 
                  onChange={(e) => handleQuestionChange(question.id, "voltage", e.target.value)}
                />

                <label className="block">Current (A)</label>
                <Input 
                  className="w-full" 
                  value={question.current} 
                  onChange={(e) => handleQuestionChange(question.id, "current", e.target.value)}
                />

                <label className="block">Output Power (W)</label>
                <Input 
                  className="w-full" 
                  value={question.output_power} 
                  onChange={(e) => handleQuestionChange(question.id, "output_power", e.target.value)}
                />

                <label className="block">Size (cm)</label>
                <Input 
                  className="w-full" 
                  value={question.size} 
                  onChange={(e) => handleQuestionChange(question.id, "size", e.target.value)}
                />
              </div>
            )}

            <div className="flex items-center mt-3">
              <Checkbox 
                checked={question.question_required} 
                onCheckedChange={(checked) => handleQuestionChange(question.id, "question_required", checked)}
              />
              <span className="ml-2">Required</span>
            </div>
          </div>
        ))}
      </div>

      <Button className="mt-5 bg-blue-500 text-white w-full" onClick={addQuestion}>
        <Plus className="w-5 h-5 mr-2" /> Add Question
      </Button>
    </div>
  );
}
