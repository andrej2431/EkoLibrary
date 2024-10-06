"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import {fetchSpecies, Species} from '../api/species'

export default function Home() {
  const [query, setQuery] = useState('');
  const [species, setSpecies] = useState<Species[]>([]);

  useEffect(() => {
      const loadSpecies = async () => {
          try {
              const data = await fetchSpecies(query);  // Fetch species based on query
              setSpecies(data);
          } catch (error) {
              console.error('Failed to load species:', error);
          }
      };

      loadSpecies();
  }, [query]);  // Fetch whenever query changes


  
  return (
    <div className="flex flex-col items-center">
    <input
      type="text"
      placeholder="Search species..."
      className="w-full p-4 mb-4 text-lg text-gray-800 bg-gray-100 border-2 rounded-lg border-gray-400 focus:outline-none focus:border-green-700 placeholder-gray-500"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
    <ul className="w-full">
      {species.map((spec) => (
        <li key={spec.id} className="mb-2">
          <a href={`/species/${spec.id}`} className="text-green-700 hover:underline">{spec.name}</a>
        </li>
      ))}
    </ul>
  </div>
  );
}
