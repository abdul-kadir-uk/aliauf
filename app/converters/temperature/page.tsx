"use client";

import TempConverter from "@/components/Converters/TempConverter";

const Temperature_Converter = () => {
  return (
    <div className="min-h-screen">
      <h1 className="text-center text-2xl sm:text-3xl md:text-4xl my-3">
        {" "}
        Temperature Converter{" "}
      </h1>
      <TempConverter />
    </div>
  );
};

export default Temperature_Converter;
