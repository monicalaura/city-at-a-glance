'use client'
import React, { useEffect, useState } from 'react';
import CityCard from './CityCard';
import fetchCities from '../lib/fetchCities';

export default function HomeCities() {
  const [favoriteCities, setFavoriteCities] = useState([]);
  const [randomCities, setRandomCities] = useState([]);
  const [loading, setLoading] = useState(true);

  //fetch the 3 most recent favorite cities
  const fetchFavoriteCitiesList = async () => {
    try {
      const fetchedFavoriteCities = await fetchCities();
      const sortedFavoriteCities = [...fetchedFavoriteCities.data]
        .sort((a, b) => b._id.localeCompare(a._id))
        .slice(0, 3);

      setFavoriteCities(sortedFavoriteCities || []);
    } catch (error) {
      console.error('Error fetching favorite cities:', error);
    }
  };
//fetch 3 random favorite cities
  const fetchRandomCitiesList = async () => {
    try {
      const fetchedRandomCities = await fetchCities();
      const uniqueRandomCities = Array.from(new Set(fetchedRandomCities.data))
        .sort(() => Math.random() - 0.3)
        .slice(0, 3);

      setRandomCities(uniqueRandomCities || []);
    } catch (error) {
      console.error('Error fetching random cities:', error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        await fetchFavoriteCitiesList();
        await fetchRandomCitiesList();
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const hasFavoriteCities = favoriteCities.length > 0;

  return (
    <div className="container mx-auto my-8">
      {loading && <p>Loading...</p>}

      {hasFavoriteCities && (
        <>
          <h2 className="text-brand-primary text-center text-4xl font-bold mt-4 mb-5">Latest Favorite Cities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-4 p-4 gridFav">
            {favoriteCities.map((city) => (
              <CityCard key={city.id} city={city} />
            ))}
          </div>

          <h2 className="text-brand-primary text-center text-4xl font-bold mt-8 mb-5">Random Cities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-4 p-4 gridFav">
            {randomCities.map((city) => (
              <CityCard key={city.id} city={city} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
