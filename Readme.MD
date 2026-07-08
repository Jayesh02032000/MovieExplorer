# Movie Explorer App

A React Native mobile application that allows users to explore popular movies, search movies, view detailed information, and manage favorite movies.

Built using React Native with Expo and integrated with The Movie Database (TMDB) API.

## Features

### Home Screen
- Fetches and displays popular movies from TMDB
- Shows:
  - Movie poster
  - Movie title
  - Release date
  - Rating
- Tap on a movie to view details

### Search Screen
- Search movies by keyword
- Implements 500ms debounce to optimize API requests
- Displays search results using FlatList

### Movie Details Screen
Displays:
- Poster image
- Backdrop image
- Movie overview
- Genres
- Runtime
- Rating
- Release date

### Favorites Screen
- Add/remove movies from favorites
- Favorites are stored locally using AsyncStorage
- Favorites persist after app restart

## Tech Stack

- React Native
- Expo
- TypeScript
- React Navigation
- TMDB API
- AsyncStorage
- Expo Vector Icons

Follow below steps to check the app-
1) Clone the repo
2) npm install
3) npm start

Use Expo Go app for quick testing.


