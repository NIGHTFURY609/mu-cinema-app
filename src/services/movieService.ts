import axios from 'axios';
import { SearchResponse, MovieDetailsResponse } from '@/types/movie';

const API_KEY = '47babe01';
const BASE_URL = 'https://www.omdbapi.com/';

const movieAPI = axios.create({
  baseURL: BASE_URL,
  params: {
    apikey: API_KEY,
  },
});

export const movieService = {
  searchMovies: async (query: string, page: number = 1): Promise<SearchResponse> => {
    console.log('Making API request to:', BASE_URL, 'with key:', API_KEY);
    const response = await movieAPI.get('', {
      params: {
        s: query,
        page,
        type: 'movie',
      },
    });
    console.log('API response:', response.data);
    return response.data;
  },

  getMovieDetails: async (imdbID: string): Promise<MovieDetailsResponse> => {
    const response = await movieAPI.get('', {
      params: {
        i: imdbID,
        plot: 'full',
      },
    });
    return response.data;
  },

  searchByTitle: async (title: string, year?: string): Promise<MovieDetailsResponse> => {
    const response = await movieAPI.get('', {
      params: {
        t: title,
        y: year,
        plot: 'full',
      },
    });
    return response.data;
  },
};