"use client";

import React, { useEffect, useMemo, useState } from "react";

type Rates = Record<string, number>;

const currencyNames = new Intl.DisplayNames(["en"], { type: "currency" });

// Best‑effort flag mapping + fallback
const FLAG_MAP: Record<string, string> = {
  USD: "us",
  INR: "in",
  GBP: "gb",
  EUR: "eu",
  JPY: "jp",
  AUD: "au",
  CAD: "ca",
  CNY: "cn",
};

const getFlagUrl = (currency: string) => {
  const code = FLAG_MAP[currency] || currency.slice(0, 2).toLowerCase();
  return `https://flagcdn.com/w20/${code}.png`;
};

const CurrencyConverter: React.FC = () => {
  const [rates, setRates] = useState<Rates>({});
  const [amount, setAmount] = useState("1");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://open.er-api.com/v6/latest/USD");
        const data = await res.json();
        if (data.result !== "success") throw new Error();
        setRates(data.rates);
      } catch {
        setError("Failed to load exchange rates");
      } finally {
        setLoading(false);
      }
    };
    fetchRates();
  }, []);

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const result = useMemo(() => {
    const val = parseFloat(amount);
    if (isNaN(val) || !rates[from] || !rates[to]) return "";
    const usd = val / rates[from];
    return (usd * rates[to]).toFixed(4);
  }, [amount, from, to, rates]);

  const currencyCodes = useMemo(() => {
    return Object.keys(rates)
      .filter((code) => currencyNames.of(code))
      .sort();
  }, [rates]);

  return (
    <div className="max-w-xl mx-auto p-6 rounded-2xl shadow">
      {loading && <p className="text-sm ">Loading rates…</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* FROM */}
        <div>
          <label className="text-sm font-medium">From</label>
          <div className="flex items-center gap-2 mb-1">
            <img src={getFlagUrl(from)} alt="flag" />
            <span className="text-sm">{currencyNames.of(from)}</span>
          </div>
          <select
            className="w-full border rounded-lg p-2 bg-background"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          >
            {currencyCodes.map((code) => (
              <option key={code} value={code}>
                {code} — {currencyNames.of(code)}
              </option>
            ))}
          </select>
          <input
            type="number"
            className="w-full border rounded-lg p-2 mt-2"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {/* TO */}
        <div>
          <label className="text-sm font-medium">To</label>
          <div className="flex items-center gap-2 mb-1">
            <img src={getFlagUrl(to)} alt="flag" />
            <span className="text-sm">{currencyNames.of(to)}</span>
          </div>
          <select
            className="w-full border rounded-lg p-2 bg-background"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          >
            {currencyCodes.map((code) => (
              <option key={code} value={code}>
                {code} — {currencyNames.of(code)}
              </option>
            ))}
          </select>
          <input
            readOnly
            className="w-full border rounded-lg p-2 mt-2 "
            value={result}
          />
        </div>
      </div>

      <button
        onClick={handleSwap}
        className="w-full mt-4 py-2 rounded-xl border font-medium hover:cursor-pointer"
      >
        🔄 Swap
      </button>
    </div>
  );
};

export default CurrencyConverter;
