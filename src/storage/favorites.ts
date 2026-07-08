import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Movie } from '../types/movie';

const FAVORITES_KEY = 'favorites';

function safeParse<T>(value: string | null): T[] {
  if (!value) return [] as T[];

  try {
    return JSON.parse(value) as T[];
  } catch {
    return [] as T[];
  }
}

export async function getFavorites(): Promise<Movie[]> {
  try {
    const stored = await AsyncStorage.getItem(FAVORITES_KEY);
    return safeParse<Movie>(stored);
  } catch {
    return [];
  }
}

export async function toggleFavorite(movie: Movie): Promise<Movie[]> {
  try {
    const favorites = await getFavorites();
    const exists = favorites.some((item) => item.id === movie.id);

    const nextFavorites = exists
      ? favorites.filter((item) => item.id !== movie.id)
      : [...favorites, movie];

    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(nextFavorites));
    return nextFavorites;
  } catch {
    return [];
  }
}

export async function isFavorite(movieId: number): Promise<boolean> {
  try {
    const favorites = await getFavorites();
    return favorites.some((movie) => movie.id === movieId);
  } catch {
    return false;
  }
}
