"use client";
import React, { useMemo, useState } from "react";

// ---- Types ----
type Unit = {
  label: string;
  factor: number; // factor relative to base unit
};

type UnitCategory = {
  label: string;
  base: string;
  units: Record<string, Unit>;
};

// ---- Unit Definitions ----
// Each category converts via its base unit
const UNIT_CATEGORIES: Record<string, UnitCategory> = {
  length: {
    label: "Length",
    base: "meter",
    units: {
      meter: { label: "Meter (m)", factor: 1 },
      kilometer: { label: "Kilometer (km)", factor: 1000 },
      centimeter: { label: "Centimeter (cm)", factor: 0.01 },
      millimeter: { label: "Millimeter (mm)", factor: 0.001 },
      inch: { label: "Inch", factor: 0.0254 },
      foot: { label: "Foot", factor: 0.3048 },
      yard: { label: "Yard", factor: 0.9144 },
    },
  },

  area: {
    label: "Area",
    base: "sqm",
    units: {
      sqm: { label: "Square Meter", factor: 1 },
      sqkm: { label: "Square Kilometer", factor: 1_000_000 },
      sqcm: { label: "Square Centimeter", factor: 0.0001 },
      acre: { label: "Acre", factor: 4046.8564224 },
      gaz: { label: "Gaz (Sq Yard)", factor: 0.83612736 },
    },
  },

  weight: {
    label: "Weight",
    base: "kg",
    units: {
      kg: { label: "Kilogram", factor: 1 },
      gram: { label: "Gram", factor: 0.001 },
      pound: { label: "Pound", factor: 0.45359237 },
      ton: { label: "Metric Ton", factor: 1000 },
    },
  },

  volume: {
    label: "Volume",
    base: "liter",
    units: {
      liter: { label: "Liter", factor: 1 },
      ml: { label: "Milliliter", factor: 0.001 },
      cubicMeter: { label: "Cubic Meter", factor: 1000 },
      gallon: { label: "Gallon (US)", factor: 3.78541 },
    },
  },
};

// ---- Component ----
const UnitsConverter: React.FC = () => {
  const [categoryKey, setCategoryKey] = useState("length");
  const category = UNIT_CATEGORIES[categoryKey];

  const unitKeys = Object.keys(category.units);

  const [fromUnit, setFromUnit] = useState(unitKeys[0]);
  const [toUnit, setToUnit] = useState(unitKeys[1] ?? unitKeys[0]);
  const [value, setValue] = useState("1");

  const result = useMemo(() => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return "";

    const fromFactor = category.units[fromUnit].factor;
    const toFactor = category.units[toUnit].factor;

    const valueInBase = numericValue * fromFactor;
    const converted = valueInBase / toFactor;

    return converted.toString();
  }, [value, fromUnit, toUnit, category]);

  return (
    <div className="max-w-xl mx-auto p-6 rounded-2xl shadow">
      {/* Category */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Type</label>
        <select
          className="w-full border rounded-lg p-2 bg-background"
          value={categoryKey}
          onChange={(e) => {
            const key = e.target.value;
            const newUnits = Object.keys(UNIT_CATEGORIES[key].units);
            setCategoryKey(key);
            setFromUnit(newUnits[0]);
            setToUnit(newUnits[1] ?? newUnits[0]);
          }}
        >
          {Object.entries(UNIT_CATEGORIES).map(([key, cat]) => (
            <option key={key} value={key}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">From</label>
          <select
            className="w-full border rounded-lg p-2 mb-2 bg-background"
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
          >
            {unitKeys.map((u) => (
              <option key={u} value={u}>
                {category.units[u].label}
              </option>
            ))}
          </select>
          <input
            type="number"
            className="w-full border rounded-lg p-2"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">To</label>
          <select
            className="w-full border rounded-lg p-2 mb-2 bg-background"
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
          >
            {unitKeys.map((u) => (
              <option key={u} value={u}>
                {category.units[u].label}
              </option>
            ))}
          </select>
          <input
            type="text"
            readOnly
            className="w-full border rounded-lg p-2 "
            value={result}
          />
        </div>
      </div>
    </div>
  );
};

export default UnitsConverter;
