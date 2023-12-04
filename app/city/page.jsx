'use client'

import React, { useCallback, useState, useEffect } from "react";
import HourlyWeather from "../components/HourlyWeather";
import SearchInput from "../components/SearchInput";
import Image from 'next/image';
import Map from "../components/Map";  


const categories = [
  "Housing",
  "Cost of Living",
  "Safety",
  "Healthcare",
  "Education",
  "Internet Access",
  "Economy",
  "Leisure & Culture",
  "Tolerance",
  "Outdoors",
];

export default function City() {

  
  const [dailyData, setDailyData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);
  const [cityInfo, setCityInfo] = useState({});
  const [cityImage, setCityImage] = useState([]);
  const [summary, setSummary] = useState('');
  const [generalScore, setGeneralScore] = useState([]);
  const [score, setScore] = useState([]);
  const [userTyped, setUserTyped] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState([]);
  const [success, setSuccess] = useState(false);

  
  const handleClick = useCallback((city) => {
    
// Clear previous content
  setDailyData([]);
  setHourlyData([]);
  setCityInfo({});
  setCityImage([]);
  setSummary('');
  setGeneralScore([]);
  setScore([]);
  setUserTyped(true);
  setSelectedCategory(null);
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
        console.error('Error fetching weather data:', error);
      });

    // Fetch city image
    fetch(`https://api.teleport.org/api/urban_areas/slug:${city.name.toLowerCase()}/images/`)
      .then((res) => {
        if (!res.ok) {
          throw Error('Oops, Something went wrong retrieving an image.');
        }
        return res.json();
      })
      .then((responseData) => {
        if (responseData.photos && responseData.photos.length > 0) {
        setCityImage(responseData.photos);

        } else {
          // If there is no image, clear the cityImage state
          setCityImage([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching city image:', error);
      });

    // Fetch Teleport summary & score 
    fetch(`https://api.teleport.org/api/urban_areas/slug:${city.name.toLowerCase()}/scores/`)
      .then((res) => res.json())
      .then((data) => {
        const { summary, teleport_city_score, categories } = data;
        setSummary(summary);
        setScore(categories);
        setGeneralScore(teleport_city_score)

      })
      .catch((error) => {
        console.error('Error fetching Teleport summary and scores:', error);
      });

        // Extract scores for specific categories
        const housingScore = categories.find(category => category.name === "Housing")?.score_out_of_10 || 0;
        const costOfLivingScore = categories.find(category => category.name === "Cost of Living")?.score_out_of_10 || 0;
        const safetyScore = categories.find(category => category.name === "Safety")?.score_out_of_10 || 0;
        const healthcareScore = categories.find(category => category.name === "Healthcare")?.score_out_of_10 || 0;
        const educationScore = categories.find(category => category.name === "Education")?.score_out_of_10 || 0;
        const internetScore = categories.find(category => category.name === "Internet Access")?.score_out_of_10 || 0;
        const economyScore = categories.find(category => category.name === "Economy")?.score_out_of_10 || 0;
        const leisureScore = categories.find(category => category.name === "Leisure & Culture")?.score_out_of_10 || 0;
        const toleranceScore = categories.find(category => category.name === "Tolerance")?.score_out_of_10 || 0;
        const outdoorsScore = categories.find(category => category.name === "Outdoors")?.score_out_of_10 || 0;

        

    // Fetch city information
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city.name}&count=1&language=en&format=json`)
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
        console.error('Error fetching city info:', error);
      });
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleAddToFavorites = useCallback(() => {
    if (cityInfo.name) {
      const cityData = {
        name: cityInfo.name,
        image: cityImage[0]?.image.web || '',
      };

      console.log("Sending request to add city to favorites:", cityData);

      fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
  }, [cityInfo.name, cityImage]);
  
  
  return (
    <div className="w-full lg:w-4/5 p-5 overflow-x-hidden overflow-y-auto mx-auto">
      <SearchInput handleClick={handleClick} />

      {/* Display City Image */}
      <div>
        {cityImage.length > 0 && (
          <>
            {cityImage.map((photo, index) => (
              <div key={index}>
                <Image
                  src={photo.image.web}
                  alt={photo.attribution.source}
                  layout="responsive"
                  width={1000}
                  height={600} 
                />
                <p className="text-md text-text-soft mt-2">Photographer: {photo.attribution.photographer}</p>
                <p className="text-md text-text-soft italic">Source: {photo.attribution.source}</p>
              </div>
            ))}
          </>
        )}

        {/* Generic city image */}
        {userTyped && cityImage.length === 0 && (
          <div className="max-w-lg mx-auto mt-5 generic">
            <Image
              src="city-generic.svg"
              alt="Generic City Image"
              layout="responsive"
              width={1000}
              height={214} 
            />
            <p className="text-md text-text-soft mt-2 text-center">There is no image for this city</p>
          </div>
        )}
      </div>

      {/* Display City Information */}
      {Object.keys(cityInfo).length > 0 && (
        <div className="text-brand-primary text-center">
          <h2 className=" font-bold text-brand-accent mt-5 mb-2 title">{cityInfo.name} - {cityInfo.country}</h2>

           {/* Add City to Favorites */}
          
          <div className="mt-4">
            <button 
              className= "text-brand-primary p-2 rounded border border-brand-primary mb-4"
              onClick={handleAddToFavorites}             
            >
              Add to Favorites
            </button>
          </div>
        
       {/* Error & Success messages */}        
    <div className= "flex flex-col">
      {error &&
        error.map((e, index) => (
          <div
            key={index} 
            className={`${ success ? "text-green-800" : "text-red-600"
            } px-5 py-2`}
          >
           {e}
      </div>
    ))}
</div>

          <div dangerouslySetInnerHTML={{ __html: summary }} className="w-full lg:w-4/5  overflow-x-hidden overflow-y-auto mx-auto max-w-lg lg:max-w-xl text-lg lg:text-xl mt-5 text-justify description"/>

          <div className="info text-center mx-auto mt-5">
            <p className="text-md md:text-xl left"><span className="text-brand-accent uppercase mr-3 label">Timezone:</span>
              {cityInfo.timezone}</p>
            <p className="text-md md:text-xl mt-3 left1"><span className="text-brand-accent uppercase mr-3 label">Population:</span>
              {cityInfo.population} inhabitants</p>
            <p className="text-md md:text-xl mt-3 left1"><span className="text-brand-accent uppercase mr-3 label">General Score:</span>
              { parseFloat(generalScore).toFixed(2)} / 100 </p>
            <p className="text-md md:text-xl mt-3 left2"><span className="text-brand-accent uppercase  mr-3 label">Elevation:</span>
              {cityInfo.elevation}  meters above sea level</p>
          </div>
        </div>
      )}

{/* Display category select list and scores */}
{userTyped && Object.keys(cityInfo).length > 0 && (
  <div className="mt-7 text-center scores">
    <p className="text-brand-primary mb-4 label text-md md:text-xl">
      See more scores for
      <span className="text-brand-accent ml-1">{cityInfo.name}</span>
    </p>
    <select
      className="bg-brand-primary divide-y divide-text-white p-2 rounded-md text-text-white"
      onChange={(e) => handleCategoryChange(e.target.value)}
      value={selectedCategory || ""}
    >
      <option value="Select" className="text-text-white"  selected>
        Select a category
      </option>
      {categories.map((category) => (
        <option key={category} value={category} className="text-text-white">
          {category}
        </option>
      ))}
    </select>
    {selectedCategory && Array.isArray(score) && score.length > 0 ? (
      <p className="text-brand-accent text-lg font-bold mt-4">
        {selectedCategory}:{" "}
        <span className="text-brand-primary">
          {parseFloat(score.find((cat) => cat.name === selectedCategory)?.score_out_of_10)?.toFixed(2) || 'N/A'} / 10
        </span>
      </p>
    ) : (
      <p className="text-text-soft text-md mt-3">
        {selectedCategory ? `No scores available for ${cityInfo.name}` : `Please select a category`}
      </p>
    )}
  </div>
)}


      {/* Display weather information */}
      {hourlyData && hourlyData.length > 0 && (
        <div className="mt-10 text-center">
          <p className="text-brand-accent text-lg font-bold md:text-xl weather">7-DAY Weather Forecast for <span className = "ml-1 uppercase">{ cityInfo.name }</span></p>
          <HourlyWeather data={hourlyData} />
        </div>
      )}

      {/* Display map */}
      {latitude && longitude && (
       <div className = "map mt-5 shadow-text-soft"> 
        <Map latitude={latitude} longitude={longitude} />
      </div>
      )}

    </div>
  );
}
