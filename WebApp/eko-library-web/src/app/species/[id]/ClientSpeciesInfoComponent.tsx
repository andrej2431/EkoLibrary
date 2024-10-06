"use client";
import { useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface SpeciesInfo {
    id: number;
    name: string;
    latinName: string;
    lifeExpectancy: number;
    habitat: string;
  }

const ClientSpeciesInfoComponent = () => {
  const { id } = useParams();
  const [species, setSpecies] = useState<SpeciesInfo>();

  useEffect(() => {
    axios.get(`/api/species/${id}`)
      .then(res => setSpecies(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!species) return <div>Loading...</div>;

  return (
    <div>
      <h1>{species.name} ({species.latinName})</h1>
      <p>Life Expectancy: {species.lifeExpectancy} years</p>
      <p>Habitat: {species.habitat}</p>
    </div>
  );
};

export default ClientSpeciesInfoComponent;