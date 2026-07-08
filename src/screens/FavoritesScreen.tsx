import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import MovieCard from '../components/MovieCard';
import { getFavorites } from '../storage/favorites';
import type { Movie } from '../types/movie';

export default function FavoritesScreen() {
  const navigation = useNavigation<any>();
  const [favorites, setFavorites] = useState<Movie[]>([]);

  const loadFavorites = useCallback(async () => {
    const saved = await getFavorites();
    setFavorites(saved);
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites]),
  );

  return (
    <SafeAreaView style={styles.container}>

      {favorites.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No favorite movies yet.</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
  },
  list: {
    paddingBottom: 24,
  },
});
