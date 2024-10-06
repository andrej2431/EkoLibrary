import axios from 'axios';

export interface Species {
  id: number;
  name: string;
  latin_name: string;
  life_expectancy: number;
  habitat: string;
}

const API_URL = 'http://localhost:3030/api';    
export const fetchSpecies = async (prefix: string = ''): Promise<Species[]> => {
    try {
        const response = await axios.get<Species[]>(API_URL, {
            params: {
                prefix: prefix
            }   
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching species:', error);
        throw error;
    }
};


export const fetchSpeciesById = async (id: string = ''): Promise<Species> => {
    try {
        const response = await axios.get<Species>(API_URL+"/species/" + id);
        return response.data;
    } catch (error) {
        console.error('Error fetching species:', error);
        throw error;
    }
};