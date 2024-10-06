import axios from 'axios';

// Define the type for Species data
export interface Species {
  id: number;
  name: string;
  latinName: string;
  lifeExpectancy: number;
  habitat: string;
}

const API_URL = 'http://localhost:3030/api';    

export const fetchSpecies = async (prefix: string = ''): Promise<Species[]> => {
    try {
        const response = await axios.get<Species[]>(API_URL, {
            params: {
                prefix: prefix  // Send the prefix as a query parameter
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching species:', error);
        throw error;
    }
};
