import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import DetailsScreen from "../screens/DetailsScreen";
import FavoritesScreen from "../screens/FavoritesScreen";

export type RootStackParamList = {
  Home: undefined;
  Search: undefined;
  Favorites: undefined;
  Details: {
    movieId: number;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerTitleAlign: "left",
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            title: "Movie Explorer",
            headerRight: () => (
              <View style={{ flexDirection: "row", gap: 16 }}>
                <Pressable onPress={() => navigation.navigate("Favorites")}>
                  <Ionicons name="heart-outline" size={24} color="black" />
                </Pressable>

                <Pressable onPress={() => navigation.navigate("Search")}>
                  <Ionicons name="search" size={24} color="black" />
                </Pressable>
              </View>
            ),
          })}
        />

        <Stack.Screen name="Search"
                   options={{ title: "Search Movies" }}
 component={SearchScreen} />

        <Stack.Screen
                  options={{ title: "Favorite Movies" }}
 name="Favorites" component={FavoritesScreen} />

        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={{ headerShown:false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
