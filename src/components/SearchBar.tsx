import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search movies...',
  onSubmit,
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color="#64748b" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={styles.input}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value ? (
        <Pressable onPress={() => onChangeText('')}>
          <Ionicons name="close-circle" size={20} color="#94a3b8" />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#0f172a',
  },
});
