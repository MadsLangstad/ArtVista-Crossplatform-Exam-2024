import { Stack } from "expo-router";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuth } from "@/hooks/useAuth";
import "react-native-reanimated";
import { initializeFirestoreData } from "@/services/firebaseService";
import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      initializeFirestoreData();
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (loading || !loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(auth)/auth"
          initialParams={{ isLogin }}
          options={{
            title: isLogin ? "Login" : "Sign Up",
          }}
        />
        <Stack.Screen
          name="(auth)/forgotPassword"
          options={{ title: "Forgot Password" }}
        />
        <Stack.Screen
          name="(artwork)/detail"
          options={{ title: "Artwork Detail", headerBackTitle: "Back" }}
        />
        <Stack.Screen name="+not-found" options={{ title: "Not Found" }} />
      </Stack>
    </ThemeProvider>
  );
}
