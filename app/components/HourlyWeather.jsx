"use client"

import React from "react"
import { WiCelsius } from "weather-icons-react"
import moment from "moment"
import { weatherCodeValues, weatherLabelValues } from "../assets/js/values"


function DayWeather({ Icon, label, temperature, date }) {
  
  return (
    <div className="flex flex-col item-center space-y-3 flex-none">
      {Icon && <Icon size={48} color="#3f3d56" />}
      <span className="text-md font-bold uppercase text-brand-accent ">{label}</span>
      <span className="text-md text-brand-primary flex space-x-1 items-center">
        <span className="font-bold text-md ml-5">
        {temperature}
        </span> 
        <WiCelsius size={26} color="#343346" />
      </span>
      <span className="text-sm text-brand-primary font-semibold">{moment(date).format("DD-MM-YYYY")}</span>
      <span className="text-sm text-brand-primary font-semibold">{moment(date).format("HH:mm")}</span>
    </div>
  )
}

export default function HourlyResults({ data }) {
  return(
  <div className="flex space-x-4 mt-12 overflow-auto w-full flex-nowrap flex-row">
    {data.map((day) => (
      <DayWeather key={day.time} date={day.time} Icon={weatherCodeValues[day.weathercode]} label={ weatherLabelValues[day.weathercode]} temperature={day.temperature_2m}/>
    ))}
  </div>
  )
}