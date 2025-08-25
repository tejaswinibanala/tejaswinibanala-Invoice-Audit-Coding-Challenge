import axios from 'axios';
import { ReferenceDrug } from '../types';

const MOCK_API_URL = 'https://685daed17b57aebd2af6da54.mockapi.io/api/v1/drugs';

export const fetchReferenceDrugsService = async (): Promise<ReferenceDrug[]> => {
  try {
    const response = await axios.get(MOCK_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching reference drugs:', error);
    throw new Error('Failed to fetch reference drugs');
  }
};
