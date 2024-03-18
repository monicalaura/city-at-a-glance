"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import HourlyWeather from "../../components/HourlyWeather";
import Map from "../../components/Map";
import AddReviewForm from "../../components/AddReviewForm";

export default function FavoriteCityPage({ params }) {
  const name = params.name;

  const [favCityInfo, setFavCityInfo] = useState({});
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [dailyData, setDailyData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);

  // Fetch favorite city general info
  useEffect(() => {
    const fetchfavCityInfo = async () => {
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${name}&count=1&language=en&format=json`
        );
        if (!res.ok) {
          throw new Error("Oops, Something went wrong fetching city info.");
        }
        const data = await res.json();
        const [favCityInfo] = data.results;

        setFavCityInfo({
          name: favCityInfo.name,
          country: favCityInfo.country,
          timezone: favCityInfo.timezone,
          population: favCityInfo.population,
          elevation: favCityInfo.elevation,
        });
      } catch (error) {
        console.error("Error fetching city info:", error);
      }
    };
    fetchfavCityInfo();
  }, [name]);

  // Fetch weather data
  useEffect(() => {
    if (name) {
      const fetchWeatherData = async () => {
        try {
          const geocodingResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${name}&count=1&language=en&format=json`
          );
          const geocodingData = await geocodingResponse.json();
          const [selectedCity] = geocodingData.results;

          if (selectedCity) {
            const { latitude, longitude, timezone } = selectedCity;

            setLatitude(latitude);
            setLongitude(longitude);

            // Reset daily data on city change
            setDailyData([]);

            const weatherResponse = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,rain,showers,snowfall,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=${timezone}`
            );
            const weatherData = await weatherResponse.json();

            const { hourly, daily } = weatherData;
            let hourlyDataSet = [];

            for (let i = 0; i < hourly?.time.length; i++) {
              if (i < 7) {
                setDailyData((dailyData) => [
                  ...dailyData,
                  {
                    time: daily?.time[i],
                    temperature_2m_max: daily?.temperature_2m_max[i],
                    temperature_2m_min: daily?.temperature_2m_min[i],
                    weathercode: daily?.weathercode[i],
                    sunrise: daily?.sunrise[i],
                    sunset: daily?.sunset[i],
                  },
                ]);
              }
              hourlyDataSet.push({
                time: hourly?.time[i],
                temperature_2m: hourly?.temperature_2m[i],
                rain: hourly?.rain[i],
                showers: hourly?.showers[i],
                snowfall: hourly?.snowfall[i],
                weathercode: hourly?.weathercode[i],
                windspeed_10m: hourly?.windspeed_10m[i],
              });
            }

            setHourlyData(hourlyDataSet);
          }
        } catch (error) {
          console.error("Error fetching weather data:", error);
        }
      };

      fetchWeatherData();
    }
  }, [name]);

  return (
    <div className="chat">
      <h1 className="text-3xl md:text-4xl lg:text-5xl text-brand-primary text-center mt-5 mb-5 favHeading">
        <span className="text-brand-accent favCity">
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </span>{" "}
        ( {favCityInfo.country} )
      </h1>

      <div className="max-w-lg mx-auto mt-5 generic">
        <Image
          src="/city-generic.svg"
          alt="Generic City Image"
          layout="responsive"
          width={1000}
          height={214}
        />
      </div>

      {/* AddReviewForm component */}
      <AddReviewForm cityName={name} />

      {/* City info from external API's */}
      <h2 className="text-brand-primary text-3xl font-bold mb-2 mt-5 text-center info-heading">
        {favCityInfo.name} Information
      </h2>

      {/* Timezone, Population, Elevation */}
      <div className="info text-center mx-auto">
        <p className="text-md md:text-xl left">
          <span className="text-brand-accent uppercase mr-3 label">
            Timezone:
          </span>
          {favCityInfo.timezone}
        </p>
        <p className="text-md md:text-xl mt-3 left1">
          <span className="text-brand-accent uppercase mr-3 label">
            Population:
          </span>
          {favCityInfo.population} inhabitants
        </p>
        <p className="text-md md:text-xl mt-3 left2">
          <span className="text-brand-accent uppercase mr-3 label">
            Elevation:
          </span>
          {favCityInfo.elevation} meters above sea level
        </p>
      </div>

      {/* Weather */}
      {hourlyData && hourlyData.length > 0 && (
        <div className="mt-1 text-center p-7 mx-3 shadow-text-soft">
          <p className="text-brand-accent text-lg font-bold md:text-xl weather">
            7-DAY Weather Forecast for{" "}
            <span className="ml-1 uppercase">{favCityInfo.name}</span>
          </p>
          <HourlyWeather data={hourlyData} />
        </div>
      )}

      {/* Map */}
      {latitude && longitude && (
        <div className="map mt-5 shadow-text-soft">
          <Map latitude={latitude} longitude={longitude} />
        </div>
      )}
    </div>
  );
}
