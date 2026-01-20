import EmiCalculator from "@/components/Calculators/EmiCalculator";

const Emical = () => {
  return (
    <div className="min-h-screen">
      <h2 className="text-2xl sm:text-3xl md:text-4xl text-center font-semibold my-3">
        EMI Calculator
      </h2>
      <EmiCalculator />
    </div>
  );
};

export default Emical;
