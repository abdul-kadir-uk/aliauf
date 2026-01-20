"use client";
import { useState } from "react";

type EmiResult = {
  emi: String;
  totalInterest: String;
  totalPayment: String;
};
const EmiCalculator = () => {
  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(0);
  const [monthlyTenure, setMonthlyTenure] = useState<number>(0);
  const [result, setResult] = useState<EmiResult | null>(null);

  const calculateEmi = () => {
    if (loanAmount <= 0 || interestRate <= 0 || monthlyTenure <= 0) {
      return null;
    }

    const monthlyRate = interestRate / 12 / 100;

    const emi =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, monthlyTenure)) /
      (Math.pow(1 + monthlyRate, monthlyTenure) - 1);

    const totalPayment = emi * monthlyTenure;
    const totalInterest = totalPayment - loanAmount;

    setResult({
      emi: emi.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
    });
  };

  return (
    <div className="p-6 space-y-4 flex flex-col justify-center items-center">
      <div className="w-full sm:w-2/3 md:w-1/2">
        <div>
          <label className="block mb-1">Loan Amount (₹)</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            onChange={(e) => setLoanAmount(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="block mb-1">Interest Rate (% per year)</label>
          <input
            type="number"
            step="0.01"
            className="w-full border p-2 rounded"
            onChange={(e) => setInterestRate(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="block mb-1">Loan Tenure (Months)</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            onChange={(e) => setMonthlyTenure(Number(e.target.value))}
          />
        </div>
        <button
          className="text-center border p-1 mx-auto block cursor-pointer 
          hover:bg-blue-300 dark:hover:bg-blue-900 my-2 text-xl mt-2 sm:mt-4"
          onClick={calculateEmi}
        >
          Calculate
        </button>
        {result && (
          <div className="p-4 bg-foreground text-background rounded space-y-2">
            <p>
              <strong>Monthly EMI:</strong> ₹{result.emi}
            </p>
            <p>
              <strong>Total Interest:</strong> ₹{result.totalInterest}
            </p>
            <p>
              <strong>Total Amount Payable:</strong> ₹{result.totalPayment}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmiCalculator;
