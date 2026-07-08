import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Movie } from '../types/movie';
import { isFavorite, toggleFavorite } from '../storage/favorites';

export interface MovieCardProps {
  movie: Movie;
  onPress: () => void;
  refreshTrigger?: number;
}

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export default function MovieCard({ movie, onPress, refreshTrigger }: MovieCardProps) {
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadFavoriteState() {
      const isFav = await isFavorite(movie.id);
      if (isMounted) {
        setFavorite(isFav);
      }
    }

    loadFavoriteState();

    return () => {
      isMounted = false;
    };
  }, [movie.id, refreshTrigger]);

  async function handleFavoritePress() {
    const updated = await toggleFavorite(movie);
    setFavorite(updated.some((item) => item.id === movie.id));
  }

  return (
    <View style={styles.card}>
      <Pressable style={styles.content} onPress={onPress}>
        <Image
          source={{
            uri: movie.poster_path
              ? `${IMAGE_BASE_URL}${movie.poster_path}`
              : 'https://via.placeholder.com/500x750?text=No+Image',
          }}
          style={styles.poster}
          resizeMode="cover"
        />

        <View style={styles.info}>
          <Text numberOfLines={2} style={styles.title}>
            {movie.title}
          </Text>

          <Text style={styles.releaseDate}>{movie.release_date}</Text>

          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFC107" />
            <Text style={styles.rating}>{movie.vote_average?.toFixed(1)}</Text>
          </View>
        </View>
      </Pressable>

      <Pressable style={styles.favoriteButton} onPress={handleFavoritePress}>
        <Ionicons name={favorite ? 'heart' : 'heart-outline'} size={20} color={favorite ? '#ef4444' : '#64748b'} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  poster: {
    width: 100,
    height: 150,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  releaseDate: {
    color: '#666',
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 6,
    fontSize: 15,
    fontWeight: '600',
  },
  favoriteButton: {
    justifyContent: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#f8fafc',
  },
});
