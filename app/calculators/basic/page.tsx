import BasicCalculator from "@/components/Calculators/BasicCalculator";

export default function basic_calculator() {
  return (
    <>
      <div className="mb-20">
        <h1 className="text-center text-2xl sm:text-3xl my-4">
          Basic Calculator
        </h1>
        <BasicCalculator />
      </div>
    </>
  );
}
