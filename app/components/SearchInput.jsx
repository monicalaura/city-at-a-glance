'use client'

import React, { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";

export default function SearchInput({ className, handleClick, ...other }) {
  const [value, setValue] = useState("");
  const [show, setShow] = useState(false);
  const debouncedValue = useDebounce(value, 500);
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState("");
  const [toggle, setToggle] = useState(false);
  const [hasUserTyped, setHasUserTyped] = useState(false);

  useEffect(() => {
    if (debouncedValue === "") {
      setShow(false);
      setCities([]);
      return;
    }

    setHasUserTyped(true);

    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${debouncedValue}&count=5`)
      .then((res) => res.json())
      .then((data) => {
        if (!data?.results || data.results.length === 0) {
          setShow(true);
          setCities([]);
          return;
        }

        setCities(data.results);
        setShow(true);
      })
      .catch((error) => {
        console.error("Error fetching city data:", error);
        setShow(false);
        setCities([]);
      });
  }, [debouncedValue]);

  function handleClickEvent(city) {
    handleClick(city);
    setCity(city.name);
    setShow(false);
    setToggle(true);
    setValue("");
    
  }

  return (
    <div className="w-full">
      {!toggle ? (
        <input
          className="p-3 w-full rounded-md bg-transparent border border-text-soft focus:border-gray-200 outline-none shadow shadow-text-soft text-brand-primary placeholder:text-text-soft"
          placeholder="Search for city"
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
      ) : (
        <div
          onClick={() => setToggle(false)}
          className="p-3 w-full rounded-md bg-transparent border border-text-soft focus:border-gray-200 outline-none shadow shadow-text-soft text-brand-primary placeholder:text-text-soft"
        >
          {city}
        </div>
      )}
      <ul className="bg-brand-primary divide-y divide-gray-500 rounded-md">
        {show && cities.length > 0 && hasUserTyped ? (
          cities.map((city) => (
            <li
              onClick={() => handleClickEvent(city)}
              className="p-3 hover:bg-black transition-all ease-in-out duration-100 text-gray-50"
              key={city.id}
            >
              {city.name}, {city.country}
            </li>
          ))
        ) : null}
        {show && (!cities || cities.length === 0) && hasUserTyped && (
          <li className="p-3 text-gray-50">No matching cities found.</li>
        )}
      </ul>
    </div>
  );
}
