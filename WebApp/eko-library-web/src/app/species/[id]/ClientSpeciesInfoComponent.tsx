"use client";
import { useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Species, fetchSpeciesById } from '@/api/species';


const ClientSpeciesInfoComponent = () => {
  const params = useParams();
  const id = params.id as string;

  const [species, setSpecies] = useState<Species | null>(null);
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const fetchedSpecies = await fetchSpeciesById(id);
          setSpecies(fetchedSpecies); 
        } catch (error) {
          console.error("Error fetching species:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-4 border rounded-lg shadow-lg bg-white mt-4">
    <h1 className="text-2xl font-bold text-center text-gray-800">{species?.name}</h1>
    <p className="mt-2 text-gray-600"><strong>Latin Name:</strong> {species?.latin_name}</p>
    <p className="mt-1 text-gray-600"><strong>Life Expectancy:</strong> {species?.life_expectancy} years</p>
    <p className="mt-1 text-gray-600"><strong>Habitat:</strong> {species?.habitat}</p>
  </div>
  );
};

export default ClientSpeciesInfoComponent;