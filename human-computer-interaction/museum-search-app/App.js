import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import SearchScreen from "./screens/SearchScreen";
import ResultsScreen from "./screens/ResultsScreen";
import ArtworkDetailsScreen from "./screens/ArtworkDetailsScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Search"
            component={SearchScreen}
            options={{ title: "MuseumSearch" }}
          />

          <Stack.Screen
            name="Results"
            component={ResultsScreen}
            options={{ title: "Search Results" }}
          />

          <Stack.Screen
            name="ArtworkDetails"
            component={ArtworkDetailsScreen}
            options={{ title: "Artwork Details" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
