"use client";

import React, { useCallback, useState } from "react";
import HourlyWeather from "../components/HourlyWeather";
import SearchInput from "../components/SearchInput";
import Image from "next/image";
import Map from "../components/Map";
import Chat from "../components/Chat";
import { AiFillRobot } from "react-icons/ai";

export const runtime = "edge";

export default function City() {
  const [dailyData, setDailyData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);
  const [cityInfo, setCityInfo] = useState({});
  const [userTyped, setUserTyped] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState([]);
  const [success, setSuccess] = useState(false);
  const [choices, setChoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback((city) => {
    // Clear previous content
    setDailyData([]);
    setHourlyData([]);
    setCityInfo({});
    setUserTyped(true);
    setLatitude(null);
    setLongitude(null);
    setError([]);
    setSuccess(false);

    const { latitude, longitude, timezone } = city;

    setLatitude(latitude);
    setLongitude(longitude);
    setUserTyped(true);

    // Reset daily data on city change
    setDailyData([]);

    // Fetch weather data
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,rain,showers,snowfall,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=${timezone}`
    )
      .then((res) => res.json())
      .then((data) => {
        const { hourly, daily } = data;
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
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
      });

    // Fetch city information
    fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city.name}&count=1&language=en&format=json`
    )
      .then((res) => res.json())
      .then((data) => {
        const [cityInfo] = data.results;

        setCityInfo({
          name: cityInfo.name,
          country: cityInfo.country,
          timezone: cityInfo.timezone,
          population: cityInfo.population,
          elevation: cityInfo.elevation,
        });
      })
      .catch((error) => {
        console.error("Error fetching city info:", error);
      });
  }, []);

  const handleAddToFavorites = useCallback(() => {
    if (cityInfo.name) {
      const cityData = {
        name: cityInfo.name,
      };

      console.log("Sending request to add city to favorites:", cityData);

      fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cityData),
      })
        .then((res) => res.json())
        .then((data) => {
          setError(data.msg);
          setSuccess(data.success);
          if (data.success) {
            console.log("City added to favorites!");
          } else {
            console.error("Error adding city to favorites:", data.msg);
          }
        })
        .catch((error) => {
          console.error("Error adding city to favorites:", error);
        });
    }
  }, [cityInfo.name]);

  return (
    <div className="w-full lg:w-4/5 p-5 overflow-x-hidden overflow-y-auto mx-auto">
      <SearchInput handleClick={handleClick} />

      <div className="max-w-lg mx-auto mt-5 generic">
        <Image
          src="/city-generic.svg"
          alt="Generic City Image"
          layout="responsive"
          width={1000}
          height={214}
        />
      </div>

      {/* Display city name & country */}
      {Object.keys(cityInfo).length > 0 && (
        <div className="text-brand-primary text-center">
          <h2 className=" font-bold text-brand-accent mt-5 mb-2 title">
            {cityInfo.name} - {cityInfo.country}
          </h2>

          {/* Add City to Favorites */}
          <div className="mt-4">
            <button
              className="text-brand-primary p-2 rounded border border-brand-primary mb-4"
              onClick={handleAddToFavorites}
            >
              Add to Favorites
            </button>
          </div>

          {/* Error & Success messages */}
          <div className="flex flex-col">
            {error &&
              error.map((e, index) => (
                <div
                  key={index}
                  className={`${
                    success ? "text-green-800" : "text-red-600"
                  } px-5 py-2`}
                >
                  {e}
                </div>
              ))}
          </div>

          {/* Timezone */}
          <div className="info text-center mx-auto mt-5">
            <p className="text-md md:text-xl left">
              <span className="text-brand-accent uppercase mr-3 label">
                Timezone:
              </span>
              {cityInfo.timezone}
            </p>
            {/* Population */}
            <p className="text-md md:text-xl mt-3 left1">
              <span className="text-brand-accent uppercase mr-3 label">
                Population:
              </span>
              {cityInfo.population} inhabitants
            </p>
            {/* Elevation */}
            <p className="text-md md:text-xl mt-3 left2">
              <span className="text-brand-accent uppercase  mr-3 label">
                Elevation:
              </span>
              {cityInfo.elevation} meters above sea level
            </p>
          </div>
        </div>
      )}

      {/* Weather info */}
      {hourlyData && hourlyData.length > 0 && (
        <div className="mt-10 text-center p-7 mx-3 shadow-text-soft">
          <p className="text-brand-accent text-lg font-bold md:text-xl weather">
            7-DAY Weather Forecast for{" "}
            <span className="ml-1 uppercase">{cityInfo.name}</span>
          </p>
          <HourlyWeather data={hourlyData} />
        </div>
      )}

      {/* Chat */}
      {cityInfo.name && (
        <div className="chat">
          <AiFillRobot size={60} color="bg-brand-dark" class="chatIcon" />
          <h2 className="titleChat text-lg font-bold mt-2">
            I am your personal City Guide. Ask me anything you want to know
            about {cityInfo.name}
          </h2>
          {/* CHAT */}
          <Chat />
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
