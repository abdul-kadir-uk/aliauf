"use client";

import { useState } from "react";

type TempUnit = "celsius" | "fahrenheit" | "kelvin";

const TempConverter = () => {
  const [fromUnit, setFromUnit] = useState<TempUnit>("celsius");
  const [toUnit, setToUnit] = useState<TempUnit>("fahrenheit");
  const [inputValue, setInputValue] = useState<string>("");
  const [result, setResult] = useState<string>("");

  const convertTemperature = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult("");
      return;
    }

    let tempInCelsius: number;

    // Step 1: Convert FROM unit → Celsius
    switch (fromUnit) {
      case "celsius":
        tempInCelsius = value;
        break;
      case "fahrenheit":
        tempInCelsius = (value - 32) * (5 / 9);
        break;
      case "kelvin":
        tempInCelsius = value - 273.15;
        break;
      default:
        tempInCelsius = value;
    }

    let finalValue: number;

    // Step 2: Convert Celsius → TO unit
    switch (toUnit) {
      case "celsius":
        finalValue = tempInCelsius;
        break;
      case "fahrenheit":
        finalValue = tempInCelsius * (9 / 5) + 32;
        break;
      case "kelvin":
        finalValue = tempInCelsius + 273.15;
        break;
      default:
        finalValue = tempInCelsius;
    }

    setResult(finalValue.toFixed(2));
  };

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setInputValue(result);
    setResult("");
  };

  return (
    <div className="max-w-md mx-auto p-6 border rounded-xl shadow-sm space-y-4">
      <h2 className="text-xl font-semibold text-center">
        Temperature Converter
      </h2>

      {/* Input */}
      <input
        type="number"
        placeholder="Enter temperature"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full border rounded-md px-3 py-2"
      />

      {/* Unit Selectors */}
      <div className="flex items-center gap-2">
        <select
          value={fromUnit}
          onChange={(e) => setFromUnit(e.target.value as TempUnit)}
          className="w-full border rounded-md px-3 py-2 bg-background"
        >
          <option value="celsius">Celsius (°C)</option>
          <option value="fahrenheit">Fahrenheit (°F)</option>
          <option value="kelvin">Kelvin (K)</option>
        </select>

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          className="px-3 py-2 border rounded-md hover:cursor-pointer"
          title="Swap"
        >
          ⇄
        </button>

        <select
          value={toUnit}
          onChange={(e) => setToUnit(e.target.value as TempUnit)}
          className="w-full border rounded-md px-3 py-2 bg-background"
        >
          <option value="celsius">Celsius (°C)</option>
          <option value="fahrenheit">Fahrenheit (°F)</option>
          <option value="kelvin">Kelvin (K)</option>
        </select>
      </div>

      {/* Convert Button */}
      <button
        onClick={convertTemperature}
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

export default TempConverter;
