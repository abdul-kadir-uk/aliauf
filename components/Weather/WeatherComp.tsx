"use client";

import { useEffect, useState } from "react";

type WeatherData = {
  location: {
    name: string;
    country: string;
  };
  current: {
    temp_c: number;
    feelslike_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
    };
    humidity: number;
    wind_kph: number;
  };
};

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

const WeatherComp = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch weather by query (city or lat,long)
  const fetchWeather = async (query: string) => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${query}`,
      );

      if (!res.ok) {
        throw new Error("Unable to fetch weather data");
      }

      const data: WeatherData = await res.json();
      setWeather(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  // Get user location
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeather(`${latitude},${longitude}`);
      },
      () => {
        // Permission denied → manual search enabled
        setError("Location permission denied. Please search manually.");
      },
    );
  }, []);

  const handleSearch = () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }
    fetchWeather(city);
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded-xl border shadow-sm bg-background">
      <h2 className="text-xl font-semibold text-center mb-4">
        🌤️ Weather Information
      </h2>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter city (e.g. Mumbai)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-md focus:outline-none"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {/* States */}
      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Weather Result */}
      {weather && (
        <div className="text-center space-y-2 mt-4">
          <h3 className="text-lg font-medium">
            {weather.location.name}, {weather.location.country}
          </h3>

          <img
            src={`https:${weather.current.condition.icon}`}
            alt="weather icon"
            className="mx-auto"
          />

          <p className="text-3xl font-bold">{weather.current.feelslike_c}°C</p>

          <p className="text-gray-600">{weather.current.condition.text}</p>

          <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
            <div>💧 Humidity: {weather.current.humidity}%</div>
            <div>💨 Wind: {weather.current.wind_kph} km/h</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherComp;
