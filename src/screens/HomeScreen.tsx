import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useIsFocused } from "@react-navigation/native";
import { movieService } from "../../src/services/movieService";
import type { Movie } from "../../src/types/movie";
import MovieCard from "../components/MovieCard";

export default function HomeScreen({ navigation }: any) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) return;
    setRefreshTrigger((value) => value + 1);
  }, [isFocused]);

  useEffect(() => {
    let isMounted = true;

    async function loadMovies() {
      try {
        const response = await movieService.getPopularMovies();
        if (isMounted) {
          setMovies(response.results);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Unable to load movies.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadMovies();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Popular Movies</Text>

      {loading ? (
        <Text>Loading movies…</Text>
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <MovieCard
              movie={item}
              refreshTrigger={refreshTrigger}
              onPress={() =>
                navigation.navigate("Details", {
                  movieId: item.id,
                })
              }
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
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
  },
  list: {
    gap: 8,
  },
  movieItem: {
    fontSize: 16,
    paddingVertical: 6,
  },
  error: {
    color: "crimson",
  },
});
