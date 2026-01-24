import WeatherComp from "@/components/Weather/WeatherComp";

const Weather = () => {
  return (
    <div className="px-4 my-5 lg:min-h-screen">
      <h1 className="text-center"> Weather </h1>
      <WeatherComp />
    </div>
  );
};

export default Weather;
