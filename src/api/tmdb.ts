import type { Movie } from '../types/movie';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

function readEnv(name: string) {
  return (globalThis as typeof globalThis & {
    process?: { env?: Record<string, string | undefined> };
  }).process?.env?.[name];
}

export const TMDB_API_KEY = readEnv('EXPO_PUBLIC_TMDB_API_KEY') || process.env.EXPO_PUBLIC_TMDB_API_KEY || '';
export const TMDB_ACCESS_TOKEN =
  readEnv('EXPO_PUBLIC_TMDB_ACCESS_TOKEN') || process.env.EXPO_PUBLIC_TMDB_ACCESS_TOKEN || '';

interface TMDBPagedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

async function tmdbRequest<T>(path: string, params: Record<string, string | number> = {}) {
  if (!TMDB_ACCESS_TOKEN || TMDB_ACCESS_TOKEN.includes('YOUR_')) {
    throw new Error('TMDB access token is not configured yet. Replace the placeholder value in src/api/tmdb.ts.');
  }

  const url = new URL(`${TMDB_BASE_URL}${path}`);
  url.searchParams.set('language', 'en-US');
  url.searchParams.set('api_key', TMDB_API_KEY);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`TMDB request failed (${response.status}): ${errorBody}`);
  }

  return (await response.json()) as T;
}

export async function getPopularMovies(page = 1) {
  return tmdbRequest<TMDBPagedResponse<Movie>>('/movie/popular', { page });
}

export async function searchMovies(query: string, page = 1) {
  return tmdbRequest<TMDBPagedResponse<Movie>>('/search/movie', {
    query,
    page,
  });
}

export async function getMovieDetails(movieId: number) {
  return tmdbRequest<Movie>(`/movie/${movieId}`);
}
