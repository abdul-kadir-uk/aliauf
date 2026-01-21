"use client";

import GradeConverter from "@/components/Converters/GradeConverter";

const Grade_Converter = () => {
  return (
    <div className="min-h-screen">
      <h1 className="text-center text-2xl sm:text-3xl md:text-4xl my-3">
        {" "}
        Grade Converter{" "}
      </h1>
      <GradeConverter />
    </div>
  );
};

export default Grade_Converter;
