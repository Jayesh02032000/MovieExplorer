
import 'react-native-gesture-handler';
import StackNavigator from "./src/navigation/StackNavigator";

export default function App() {
   console.log("API:", process.env.EXPO_PUBLIC_TMDB_API_KEY);
  console.log("TOKEN:", process.env.EXPO_PUBLIC_TMDB_ACCESS_TOKEN);
  return <StackNavigator />;
}