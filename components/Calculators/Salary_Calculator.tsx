"use client";
import { useState } from "react";

type SalaryResult = {
  grossSalary: string;
  totalDeductions: string;
  netSalary: string;
  employeePF: string;
  employeeESI: string;
  professionalTax: string;
  ctc: string;
};

const Salary_Calculator = () => {
  const [basic, setBasic] = useState<number>(0);
  const [hra, setHra] = useState<number>(0);
  const [allowances, setAllowances] = useState<number>(0);
  const [deductions, setDeductions] = useState<number>(0);
  const [result, setResult] = useState<SalaryResult | null>(null);

  const calculateSalary = () => {
    const grossSalary = basic + hra + allowances;

    const employeePF = basic * 0.12;
    const employerPF = basic * 0.12;

    const employeeESI = grossSalary <= 21000 ? grossSalary * 0.0075 : 0;
    const employerESI = grossSalary <= 21000 ? grossSalary * 0.0325 : 0;

    let professionalTax = 0;
    if (grossSalary > 20000) professionalTax = 200;
    else if (grossSalary >= 15000) professionalTax = 150;

    const totalDeductions = employeePF + employeeESI + professionalTax;

    const netSalary = grossSalary - totalDeductions;
    const ctc = grossSalary + employerPF + employerESI;

    setResult({
      grossSalary: grossSalary.toFixed(2),
      employeePF: employeePF.toFixed(2),
      employeeESI: employeeESI.toFixed(2),
      professionalTax: professionalTax.toFixed(2),
      totalDeductions: totalDeductions.toFixed(2),
      netSalary: netSalary.toFixed(2),
      ctc: ctc.toFixed(2),
    });
  };

  return (
    <div className="p-6 space-y-4 flex flex-col justify-center items-center">
      <div className="w-full sm:w-2/3 md:w-1/2 p-6 border rounded-lg shadow-md space-y-3">
        <div>
          <label className="block mb-1">Basic Salary (₹)</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            onChange={(e) => setBasic(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="block mb-1">HRA (₹)</label>
          <input
            type="number"
            placeholder="optional"
            className="w-full border p-2 rounded"
            onChange={(e) => setHra(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="block mb-1">Other Allowances (₹)</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            placeholder="optional"
            onChange={(e) => setAllowances(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="block mb-1">Deductions (₹)</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            onChange={(e) => setDeductions(Number(e.target.value))}
          />
        </div>

        <div className="flex justify-center my-2">
          <button
            className="border p-2 cursor-pointer hover:bg-blue-500 hover:text-white"
            onClick={calculateSalary}
          >
            Calculate Salary
          </button>
        </div>

        {result && (
          <div className="p-4 bg-foreground text-background rounded space-y-1">
            <p>
              <strong>Gross Salary:</strong> ₹{result.grossSalary}
            </p>
            <p>
              <strong>Employee PF:</strong> ₹{result.employeePF}
            </p>
            <p>
              <strong>Employee ESI:</strong> ₹{result.employeeESI}
            </p>
            <p>
              <strong>Professional Tax:</strong> ₹{result.professionalTax}
            </p>
            <hr />
            <p>
              <strong>Total Deductions:</strong> ₹{result.totalDeductions}
            </p>
            <p>
              <strong>Net (In-hand) Salary:</strong> ₹{result.netSalary}
            </p>
            <hr />
            <p>
              <strong>CTC:</strong> ₹{result.ctc}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Salary_Calculator;
