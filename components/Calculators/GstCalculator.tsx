"use client";
import { useState } from "react";

type GstResult = {
  gstAmount: String;
  netAmount: String;
  totalAmount: String;
};

const GSTCalculator = () => {
  const [amount, setAmount] = useState<number>(0);
  const [gstRate, setGstRate] = useState<number>(0);
  const [result, setResult] = useState<GstResult | null>(null);

  const calculateGst = (type: "add" | "remove") => {
    if (amount <= 0 || gstRate <= 0) {
      setResult(null);
      return;
    }

    let gstAmount = 0;
    let netAmount = 0;
    let totalAmount = 0;

    if (type === "add") {
      gstAmount = (amount * gstRate) / 100;
      totalAmount = amount + gstAmount;
      netAmount = amount;
    } else {
      // Remove GST from inclusive amount
      netAmount = (amount * 100) / (100 + gstRate);
      gstAmount = amount - netAmount;
      totalAmount = amount;
    }

    setResult({
      gstAmount: gstAmount.toFixed(2),
      netAmount: netAmount.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
    });
  };

  return (
    <div className="p-6 space-y-4 flex flex-col justify-center items-center">
      <div className="w-full sm:w-2/3 md:w-1/2 p-6 border rounded-lg shadow-md">
        <div>
          <label className="block mb-1">Amount (₹)</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="block mb-1">GST Rate (%)</label>
          <input
            type="number"
            step="0.01"
            className="w-full border p-2 rounded"
            onChange={(e) => setGstRate(Number(e.target.value))}
          />
        </div>

        <div className="flex gap-4 justify-center my-2">
          <button
            className="border p-2 cursor-pointer hover:bg-blue-500 hover:text-white"
            onClick={() => calculateGst("add")}
          >
            Add GST
          </button>

          <button
            className="border p-2 cursor-pointer hover:bg-green-500 hover:text-white"
            onClick={() => calculateGst("remove")}
          >
            Remove GST
          </button>
        </div>

        {result && (
          <div className="p-4 bg-foreground text-background rounded space-y-2">
            <p>
              <strong>Net Amount:</strong> ₹{result.netAmount}
            </p>
            <p>
              <strong>GST Amount:</strong> ₹{result.gstAmount}
            </p>
            <p>
              <strong>Total Amount:</strong> ₹{result.totalAmount}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GSTCalculator;
