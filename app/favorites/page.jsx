'use client'

//favorite cities page
import React, { useEffect, useState } from 'react';
import CityCard from '../components/CityCard';
import  fetchCities  from '../lib/fetchCities';

export default function Favorites() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCities = await fetchCities();

         // Sort cities in alphabetical order by name
         const sortedCities = [...fetchedCities.data].sort((a, b) => a.name.localeCompare(b.name));
         setCities(sortedCities || []);
       } catch (error) {
         console.error('Error fetching cities:', error);
       }
       finally {
        setLoading(false); 
      }
     };
  
    fetchData();
  }, []);

  return (
    <div className="container mx-auto my-8">
      <h2 className="text-brand-primary text-center text-4xl font-bold mt-4 mb-5">Your Favorite Cities</h2>
    {!loading && cities.length === 0 && (
        <p className='text-center text-lg'>
          You have no favorite cities yet
        </p>
      )}
        {loading && <p className='text-center mt-7'>Loading...</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-4 p-4 gridFav">
        {cities.map((city) => (
          <CityCard key={city.id} city={city} />
        ))}
      </div>
    </div>
  );
}
