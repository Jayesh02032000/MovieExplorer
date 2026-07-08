import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { movieService } from '../services/movieService';
import { isFavorite, toggleFavorite } from '../storage/favorites';
import type { Movie } from '../types/movie';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

export default function DetailsScreen({ route, navigation }: any) {
  const { movieId } = route.params;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorite, setFavorite] = useState(false);
  const insets = useSafeAreaInsets();
  const headerTop = insets.top + 12;
  const headerLeft = insets.left + 16;

  useEffect(() => {
    let isMounted = true;

    async function loadMovieDetails() {
      try {
        const details = await movieService.getMovieDetails(movieId);
        const isFav = await isFavorite(movieId);
        if (isMounted) {
          setMovie(details);
          setFavorite(isFav);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unable to load movie details.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadMovieDetails();

    return () => {
      isMounted = false;
    };
  }, [movieId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.centered} edges={['left', 'right', 'bottom']}>
        <Pressable style={[styles.backButton, { top: headerTop, left: headerLeft }]} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#0f172a" />
        </Pressable>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading movie details…</Text>
      </SafeAreaView>
    );
  }

  if (error || !movie) {
    return (
      <SafeAreaView style={styles.centered} edges={['left', 'right', 'bottom']}>
        <Pressable style={[styles.backButton, { top: headerTop, left: headerLeft }]} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#0f172a" />
        </Pressable>
        <Text style={styles.errorText}>{error ?? 'Movie not found.'}</Text>
      </SafeAreaView>
    );
  }

  const backdropUri = movie.backdrop_path
    ? `${BACKDROP_BASE_URL}${movie.backdrop_path}`
    : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80';

  const posterUri = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  async function handleFavoriteToggle() {
    if (!movie) return;

    const updated = await toggleFavorite(movie);
    setFavorite(updated.some((item) => item.id === movie.id));
  }

  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
  const runtimeText = movie.runtime ? `${movie.runtime} min` : 'N/A';
  const genresText = movie.genres?.map((genre) => genre.name).join(', ') || 'N/A';

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
      <Pressable style={[styles.backButtonOverlay, { top: headerTop, left: headerLeft }]} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={20} color="#0f172a" />
      </Pressable>
      <View style={styles.backdropContainer}>
        <Image source={{ uri: backdropUri }} style={styles.backdrop} resizeMode="cover" />
        <View style={styles.backdropOverlay} />
        <Image source={{ uri: posterUri }} style={styles.poster} resizeMode="cover" />
      </View>

      <View style={styles.infoBox}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{movie.title}</Text>
          <Pressable style={styles.favoriteButton} onPress={handleFavoriteToggle}>
            <Ionicons name={favorite ? 'heart' : 'heart-outline'} size={22} color={favorite ? '#ef4444' : '#64748b'} />
          </Pressable>
        </View>
        {movie.tagline ? <Text style={styles.tagline}>{movie.tagline}</Text> : null}

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{releaseYear}</Text>
          <Text style={styles.metaText}>•</Text>
          <Text style={styles.metaText}>{runtimeText}</Text>
          <Text style={styles.metaText}>•</Text>
          <Text style={styles.metaText}>{movie.vote_average?.toFixed(1) ?? 'N/A'}/10</Text>
        </View>

        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.overview}>{movie.overview || 'No overview available.'}</Text>

        <Text style={styles.sectionTitle}>Genres</Text>
        <Text style={styles.overview}>{genresText}</Text>

        {movie.original_title && movie.original_title !== movie.title ? (
          <>
            <Text style={styles.sectionTitle}>Original Title</Text>
            <Text style={styles.overview}>{movie.original_title}</Text>
          </>
        ) : null}
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f8fafc',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  backButtonOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 2,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#475569',
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    textAlign: 'center',
  },
  backdropContainer: {
    position: 'relative',
    height: 320,
    backgroundColor: '#0f172a',
  },
  backdrop: {
    width: '100%',
    height: '100%',
  },
  backdropOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  poster: {
    position: 'absolute',
    left: 20,
    bottom: -40,
    width: 128,
    height: 192,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#e2e8f0',
  },
  infoBox: {
    paddingHorizontal: 20,
    paddingTop: 72,
    paddingBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  favoriteButton: {
    padding: 8,
    borderRadius: 999,
    backgroundColor: '#f8fafc',
  },
  tagline: {
    fontSize: 15,
    color: '#64748b',
    marginTop: 8,
    fontStyle: 'italic',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: '#475569',
  },
  sectionTitle: {
    marginTop: 18,
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  overview: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: '#334155',
  },
});
