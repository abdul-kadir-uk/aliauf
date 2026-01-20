"use client";
import React, { useState } from "react";
// Ensure basicCal is exported with these types or cast it
import basicCal from "@/src/data/basicCal";

// 1. Define the Button Interface
interface CalButton {
  label: string | React.ReactNode;
  value?: string;
}

// 2. Define types for specific operations
type Operator = "+" | "-" | "*" | "/" | "%";
type UnaryOp = "square" | "cube" | "sqrt" | "inverse";

const BasicCalculator: React.FC = () => {
  // 3. Typed State Hooks
  const [display, setDisplay] = useState<string>("0");
  const [firstVal, setFirstVal] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [waitForSec, setWaitForSec] = useState<boolean>(false);

  const calculate = (a: number, b: number, op: Operator): number | string => {
    switch (op) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "*":
        return a * b;
      case "/":
        return b === 0 ? "error" : a / b;
      case "%":
        return a % b;
      default:
        return b;
    }
  };

  const applyUnary = (type: UnaryOp): void => {
    const val = parseFloat(display);
    let result: number | string;

    switch (type) {
      case "square":
        result = val ** 2;
        break;
      case "cube":
        result = val ** 3;
        break;
      case "sqrt":
        result = val < 0 ? "error" : Math.sqrt(val);
        break;
      case "inverse":
        result = val === 0 ? "error" : 1 / val;
        break;
      default:
        return;
    }

    setDisplay(String(result));
    setFirstVal(typeof result === "number" ? result : null);
  };

  const handleOperator = (nextop: Operator): void => {
    if (waitForSec) {
      setDisplay((prev) => prev.replace(/[\+\-\*\/%]$/, nextop));
      setOperator(nextop);
      return;
    }

    const inputVal = parseFloat(display.split(" ").pop() || "0");

    if (operator && !waitForSec && firstVal !== null) {
      const result = calculate(firstVal, inputVal, operator);
      setDisplay(result + " " + nextop);
      setFirstVal(typeof result === "number" ? result : null);
    } else {
      setFirstVal(inputVal);
      setDisplay(inputVal + " " + nextop);
    }
    setOperator(nextop);
    setWaitForSec(true);
  };

  const handleEqual = (): void => {
    if (!operator || waitForSec || firstVal === null) return;
    const secval = parseFloat(display.split(" ").pop() || "0");
    const result = calculate(firstVal, secval, operator);

    setDisplay(String(result));
    setOperator(null);
    setFirstVal(null);
    setWaitForSec(false);
  };

  const handleClick = (btn: CalButton): void => {
    const val = btn.value ?? (typeof btn.label === "string" ? btn.label : "");

    if (val === "clear") {
      setDisplay("0");
      setFirstVal(null);
      setOperator(null);
      setWaitForSec(false);
      return;
    }

    if (val === "⌫") {
      setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
      return;
    }

    if (val === "+/-") {
      setDisplay((prev) => (prev.startsWith("-") ? prev.slice(1) : "-" + prev));
      return;
    }

    if (["-", "+", "*", "/", "%"].includes(val)) {
      handleOperator(val as Operator);
      return;
    }

    if (["square", "cube", "sqrt", "inverse"].includes(val)) {
      applyUnary(val as UnaryOp);
      return;
    }

    if (val === "=") {
      handleEqual();
      return;
    }

    setDisplay((prev) => {
      const parts = prev.split(" ");
      const last = parts[parts.length - 1];

      if (val === "." && last.includes(".")) return prev;

      if (waitForSec) {
        setWaitForSec(false);
        return prev + " " + (val === "." ? "0." : val);
      }

      if (prev === "0" && val !== ".") return String(val);

      return prev + val;
    });
  };

  return (
    <div className="flex justify-center items-center flex-col">
      <div className="my-2 border bg-foreground text-background w-[90vw] sm:w-2xl md:w-md p-2 text-right text-xl sm:text-2xl overflow-x-auto">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-6 w-full sm:w-2xl md:w-md p-4 border">
        {(basicCal as CalButton[]).map((btn, i) => (
          <button
            className="bg-gray-100 text-black font-bold border p-1 cursor-pointer"
            key={i}
            onClick={() => handleClick(btn)}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BasicCalculator;
