"use client";

import CurrencyConverter from "@/components/Converters/CurrencyConverter";

const Currency_Converter = () => {
  return (
    <div className="min-h-screen">
      <h1 className="text-center text-2xl sm:text-3xl md:text-4xl my-3">
        {" "}
        Currency Converter{" "}
      </h1>
      <CurrencyConverter />
    </div>
  );
};

export default Currency_Converter;
