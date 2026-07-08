import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import useDebounce from '../hooks/useDebounce';
import { movieService } from '../services/movieService';
import type { Movie } from '../types/movie';

export default function SearchScreen() {
  const navigation = useNavigation<any>();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    const trimmedQuery = debouncedQuery.trim();

    if (!trimmedQuery) {
      setResults([]);
      setError(null);
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function searchMovies() {
      try {
        setLoading(true);
        setError(null);
        const response = await movieService.searchMovies(trimmedQuery);

        if (isMounted) {
          setResults(response.results);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unable to search movies.');
          setResults([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    searchMovies();

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery]);

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder="Search for a movie"
        onSubmit={() => undefined}
      />

      {loading ? (
        <View style={styles.stateContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.stateText}>Searching…</Text>
        </View>
      ) : error ? (
        <View style={styles.stateContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : !query.trim() ? (
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>Type a movie title to begin searching.</Text>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>No movies found for “{query}”.</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <MovieCard
              movie={item}
              onPress={() => navigation.navigate('Details', { movieId: item.id })}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  stateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  stateText: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    textAlign: 'center',
  },
  list: {
    paddingBottom: 24,
  },
});
