import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Movie } from '../interfaces/Movie';
import type { MovieContextValue } from '../interfaces/MovieContextValue';

const MovieContext = createContext<MovieContextValue | undefined>(undefined);

export function useMovieContext() {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovieContext must be used within a MovieProvider');
  }
  return context;
}

export const MovieProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Movie[]>(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? (JSON.parse(savedFavorites) as Movie[]) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (movie: Movie) => {
    setFavorites((prev) => [...prev, movie]);
  };

  const removeFromFavorites = (movieId: number) => {
    setFavorites((prev) => prev.filter((m) => m.id !== movieId));
  };

  const isFavorite = (movieId: number) => {
    return favorites.some((m) => m.id === movieId);
  };

  const removeAllFavorites = () => {
    setFavorites([]);
    alert('All Favorites REMOVED !!')
  }

  const exposedValues: MovieContextValue = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    removeAllFavorites
  };

  return <MovieContext.Provider value={exposedValues}>{children}</MovieContext.Provider>;
};
