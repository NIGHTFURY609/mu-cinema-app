import { useState, useEffect } from 'react';
import { Movie } from '@/types/movie';

const FAVORITES_KEY = 'movieapp_favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Movie[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (error) {
        console.error('Error parsing favorites from localStorage:', error);
        setFavorites([]);
      }
    }
  }, []);

  const addToFavorites = (movie: Movie) => {
    const updatedFavorites = [...favorites, movie];
    setFavorites(updatedFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  };

  const removeFromFavorites = (imdbID: string) => {
    const updatedFavorites = favorites.filter(movie => movie.imdbID !== imdbID);
    setFavorites(updatedFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  };

  const isFavorite = (imdbID: string) => {
    return favorites.some(movie => movie.imdbID === imdbID);
  };

  const toggleFavorite = (movie: Movie) => {
    if (isFavorite(movie.imdbID)) {
      removeFromFavorites(movie.imdbID);
    } else {
      addToFavorites(movie);
    }
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
  };
};