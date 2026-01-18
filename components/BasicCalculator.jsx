"use client";
import basicCal from "@/src/data/basicCal";
import { useState } from "react";

const BasicCalculator = () => {
  const [display, setDisplay] = useState("0");
  const [firstVal, setFirstVal] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitForSec, setWaitForSec] = useState(false);

  const calculate = (a, b, op) => {
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

  const applyUnary = (type) => {
    const val = parseFloat(display);
    let result;
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
    setFirstVal(result);
  };

  const handleOperator = (nextop) => {
    if (waitForSec) {
      setDisplay((prev) => prev.replace(/[\+\-\*\/%]$/, nextop));
      setOperator(nextop);
      return;
    }
    const inputVal = parseFloat(display.split(" ").pop());
    if (operator && !waitForSec) {
      const result = calculate(firstVal, inputVal, operator);
      setDisplay(result + " " + nextop);
      setFirstVal(result);
    } else {
      setFirstVal(inputVal);
      setDisplay(inputVal + " " + nextop);
    }
    setOperator(nextop);
    setWaitForSec(true);
  };

  const handleEqual = () => {
    if (!operator || waitForSec) return;
    const secval = parseFloat(display.split(" ").pop());
    const result = calculate(firstVal, secval, operator);
    setDisplay(String(result));
    setOperator(null);
    setFirstVal(null);
    setWaitForSec(false);
  };

  const handleClick = (btn) => {
    const val = btn.value ?? btn.label;
    if (val === "clear") {
      setDisplay("0");
      setFirstVal(null);
      setOperator(null);
      setWaitForSec(false);
      return;
    }

    if (val === "⌫") {
      setDisplay((prev) => {
        return prev.length > 1 ? prev.slice(0, -1) : "0";
      });
      return;
    }

    if (val == "+/-") {
      setDisplay((prev) => {
        return prev.startsWith("-") ? prev.slice(1) : "-" + prev;
      });
      return;
    }

    if (["-", "+", "*", "/", "%"].includes(val)) {
      handleOperator(val);
      return;
    }

    if (["square", "cube", "sqrt", "inverse"].includes(val)) {
      applyUnary(val);
      return;
    }

    if (val === "=") {
      handleEqual();
      return;
    }

    setDisplay((prev) => {
      const parts = prev.split(" ");
      const last = parts[parts.length - 1];

      // decimal protection
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
    <>
      <div className=" flex justify-center items-center flex-col">
        <div className="my-2 border bg-foreground text-background w-[90vw] sm:w-2xl md:w-md p-2 text-right text-xl sm:text-2xl overflow-x-auto">
          {" "}
          {display}{" "}
        </div>
        <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-6 w-full sm:w-2xl md:w-md p-4 border">
          {basicCal.map((btn, i) => (
            <button
              className="bg-gray-100 text-black font-bold
            border p-1 cursor-pointer"
              key={i}
              onClick={() => handleClick(btn)}
            >
              {" "}
              {btn.label}{" "}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default BasicCalculator;
