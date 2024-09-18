"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

interface SpeciesPreview {
  id: number;
  name: string;
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SpeciesPreview[]>([]);

  useEffect(() => {
    if (query.length > 2) {
      axios.get(`/api/species?search=${query}`)
        .then(res => setResults(res.data))
        .catch(err => console.error(err));
    }
  }, [query]);

  
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
      {results.map((species) => (
        <li key={species.id} className="mb-2">
          <a href={`/species/${species.id}`} className="text-green-700 hover:underline">{species.name}</a>
        </li>
      ))}
    </ul>
  </div>
  );
}
