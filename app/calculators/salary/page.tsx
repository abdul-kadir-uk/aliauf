import Salary_Calculator from "@/components/Calculators/Salary_Calculator";

const SalaryCalculator = () => {
  return (
    <div className="min-h-screen">
      <h1 className="text-center text-2xl sm:text-3xl md:text-4xl my-3">
        {" "}
        Salary Calculator{" "}
      </h1>
      <Salary_Calculator />
    </div>
  );
};

export default SalaryCalculator;
