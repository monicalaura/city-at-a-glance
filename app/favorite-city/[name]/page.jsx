'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import HourlyWeather from '../../components/HourlyWeather';
import Map from '../../components/Map';
import AddReviewForm from '../../components/AddReviewForm';
import categories from '../../data/categories';

export default function FavoriteCityPage({ params }) {
  const name = params.name;

  const [favImage, setFavImage] = useState([]);
  const [favCityInfo, setFavCityInfo] = useState({});
  const [summary, setSummary] = useState('');
  const [generalScore, setGeneralScore] = useState([]);
  const [score, setScore] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [dailyData, setDailyData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);

  // Fetch favorite city image
  useEffect(() => {
    const fetchFavImage = async () => {
      try {
        const res = await fetch(`https://api.teleport.org/api/urban_areas/slug:${name.toLowerCase()}/images/`);
        if (!res.ok) {
          throw new Error('Oops, Something went wrong retrieving an image.');
        }
        const responseData = await res.json();
        if (responseData.photos && responseData.photos.length > 0) {
          setFavImage(responseData.photos);
        } else {
          setFavImage([]);
        }
      } catch (error) {
        console.error('Error fetching city image:', error);
      }
    };
    fetchFavImage();
  }, [name]);


  // Fetch Teleport summary & score
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`https://api.teleport.org/api/urban_areas/slug:${name.toLowerCase()}/scores/`);
        if (!res.ok) {
          throw new Error('Oops, Something went wrong fetching Teleport summary and scores.');
        }
        const data = await res.json();
        const { summary, teleport_city_score, categories } = data;
        setSummary(summary);
        setScore(categories);
        setGeneralScore(teleport_city_score);
      } catch (error) {
        console.error('Error fetching Teleport summary and scores:', error);
      }
    };
    fetchData();
  }, [name]);

  // Extract scores for specific categories
  const getCategoryScore = (categoryName) => {
    return categories.find((category) => category.name === categoryName)?.score_out_of_10 || 0;
  };

  // Fetch favorite city general info
  useEffect(() => {
    const fetchfavCityInfo = async () => {
      try {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${name}&count=1&language=en&format=json`);
        if (!res.ok) {
          throw new Error('Oops, Something went wrong fetching city info.');
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
        console.error('Error fetching city info:', error);
      }
    };
    fetchfavCityInfo();
  }, [name]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  //fetch meteo info
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
          console.error('Error fetching weather data:', error);
        }
      };
  
      fetchWeatherData();
    }
  }, [name]);
  
  return (
    <div>
      <h1 className="text-3xl md:text-4xl lg:text-5xl text-brand-primary text-center mt-5 mb-5 favHeading">
       <span className="text-brand-accent favCity">{name.charAt(0).toUpperCase() + name.slice(1)}</span> ( {favCityInfo.country} ) 
      </h1>
      {/* Favorite City Image */}
      <div className="p-4">
        {favImage.length > 0 ? (
          favImage.map((photo, index) => (
            <div key={index}>
              <Image src={photo.image.web} alt={photo.attribution.source} layout="responsive" width={1000} height={600} />
              <p className="text-md text-text-soft mt-2">Photographer: {photo.attribution.photographer}</p>
              <p className="text-md text-text-soft italic">Source: {photo.attribution.source}</p>
            </div>
          ))
        ) : (
          <div className="max-w-lg mx-auto mt-5 generic">
            <Image src="/city-generic.svg" alt="Generic City Image" layout="responsive" width={1000} height={214} />
            <p className="text-md text-text-soft mt-2 text-center">There is no image for this city</p>
          </div>
        )}
      </div>
       {/* AddReviewForm component */}
      <AddReviewForm cityName={name} />
  
      {/* City info from external API's */}
      <h2 className="text-brand-primary text-3xl font-bold mb-2 mt-5 text-center info-heading">{favCityInfo.name} Information</h2>
       {/* Summary */}
      <div dangerouslySetInnerHTML={{ __html: summary }} className="max-w-full lg:max-w-full overflow-x-hidden overflow-y-auto mx-auto p-3 text-lg lg:text-xl mt-5 text-justify description"/>
        {/* Timezone */}
      <div className="info text-center mx-auto">
        <p className="text-md md:text-xl left">
          <span className="text-brand-accent uppercase mr-3 label">Timezone:</span>
          {favCityInfo.timezone}
        </p>
         {/* Population */}
        <p className="text-md md:text-xl mt-3 left1">
          <span className="text-brand-accent uppercase mr-3 label">Population:</span>
          {favCityInfo.population} inhabitants
        </p>
          {/* Gen score */}
        <p className="text-md md:text-xl mt-3 left1">
          <span className="text-brand-accent uppercase mr-3 label">General Score:</span>
          {parseFloat(generalScore).toFixed(2)} / 100
        </p>
         {/* Elevation */}
        <p className="text-md md:text-xl mt-3 left2">
          <span className="text-brand-accent uppercase  mr-3 label">Elevation:</span>
          {favCityInfo.elevation}  meters above sea level
        </p>
      </div>

      {/* Category select list and scores */}
      {Object.keys(favCityInfo).length > 0 && (
        <div className="mt-7 text-center scores">
          <p className="text-brand-primary mb-4 label text-md md:text-xl">
            See more scores for
            <span className="text-brand-accent ml-1">{favCityInfo.name}</span>
          </p>
          <select
            className="bg-brand-primary divide-y divide-text-white p-2 rounded-md text-text-white"
            onChange={(e) => handleCategoryChange(e.target.value)}
            value={selectedCategory || ""}
          >
            <option value="Select" className="text-text-white" selected>
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
              {selectedCategory ? `No scores available for ${favCityInfo.name}` : `Please select a category`}
            </p>
          )}
        </div>
      )}
       {/* Weather */}
       {hourlyData && hourlyData.length > 0 && (
        <div className="mt-1 text-center p-7 mx-3 shadow-text-soft ">
          <p className="text-brand-accent text-lg font-bold md:text-xl weather">7-DAY Weather Forecast for <span className = "ml-1 uppercase">{ favCityInfo.name }</span></p>
          <HourlyWeather data={hourlyData} />
        </div>
      )}
        {/* Map */}
        {latitude && longitude && (
          <div className = "map mt-5 shadow-text-soft"> 
            <Map latitude={latitude} longitude={longitude} />
          </div>
          )}
        </div>
  );
}
