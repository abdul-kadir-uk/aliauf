"use client";

import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";

type GradeType = "percentage" | "cgpa" | "gpa";

const GradeConverter = () => {
  const [fromType, setFromType] = useState<GradeType>("percentage");
  const [toType, setToType] = useState<GradeType>("cgpa");
  const [inputValue, setInputValue] = useState<string>("");
  const [result, setResult] = useState<string>("");

  const convertGrade = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult("");
      return;
    }

    let output = value;

    if (fromType === "percentage" && toType === "cgpa") {
      output = value / 9.5;
    } else if (fromType === "cgpa" && toType === "percentage") {
      output = value * 9.5;
    } else if (fromType === "percentage" && toType === "gpa") {
      output = (value / 100) * 4;
    } else if (fromType === "gpa" && toType === "percentage") {
      output = (value / 4) * 100;
    } else if (fromType === "cgpa" && toType === "gpa") {
      output = (value / 10) * 4;
    } else if (fromType === "gpa" && toType === "cgpa") {
      output = (value / 4) * 10;
    }

    setResult(output.toFixed(2));
  };

  const handleSwap = () => {
    setFromType(toType);
    setToType(fromType);
    setInputValue(result);
    setResult("");
  };

  return (
    <div className="max-w-md mx-auto p-6 border rounded-xl shadow-sm space-y-4">
      <h2 className="text-xl font-semibold text-center">Grade Converter</h2>

      {/* Input */}
      <input
        type="number"
        placeholder="Enter value"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full border rounded-md px-3 py-2"
      />

      {/* Selects */}
      <div className="flex items-center gap-2">
        <select
          value={fromType}
          onChange={(e) => setFromType(e.target.value as GradeType)}
          className="w-full border rounded-md px-3 py-2 bg-background"
        >
          <option value="percentage">Percentage (%)</option>
          <option value="cgpa">CGPA (10 Scale)</option>
          <option value="gpa">GPA (4 Scale)</option>
        </select>

        <button
          onClick={handleSwap}
          className="p-2 border rounded-md hover:cursor-pointer"
          title="Swap"
        >
          <ArrowLeftRight size={18} />
        </button>

        <select
          value={toType}
          onChange={(e) => setToType(e.target.value as GradeType)}
          className="w-full border rounded-md px-3 py-2 bg-background"
        >
          <option value="percentage">Percentage (%)</option>
          <option value="cgpa">CGPA (10 Scale)</option>
          <option value="gpa">GPA (4 Scale)</option>
        </select>
      </div>

      {/* Convert button */}
      <button
        onClick={convertGrade}
        className="w-full bg-foreground text-background py-2 rounded-md hover:opacity-90 hover:cursor-pointer"
      >
        Convert
      </button>

      {/* Result */}
      {result && (
        <div className="text-center text-lg font-medium">
          Result: <span className="font-bold">{result}</span>
        </div>
      )}
    </div>
  );
};

export default GradeConverter;
