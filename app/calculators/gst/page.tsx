import GSTCalculator from "@/components/Calculators/GstCalculator";

const GstCalculator = () => {
  return (
    <div className="min-h-screen">
      <h1 className="text-center text-2xl sm:text-3xl md:text-4xl my-3">
        {" "}
        GST Calculator{" "}
      </h1>
      <GSTCalculator />
    </div>
  );
};

export default GstCalculator;
