"use client";

import UnitsConverter from "@/components/Converters/UnitsConverter";

const Units_Converter = () => {
  return (
    <div className="min-h-screen">
      <h1 className="text-center text-2xl sm:text-3xl md:text-4xl my-3">
        {" "}
        Units Converter{" "}
      </h1>
      <UnitsConverter />
    </div>
  );
};

export default Units_Converter;
