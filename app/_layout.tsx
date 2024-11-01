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
import { useAuth } from "@/hooks/useAuth"; // Import your useAuth hook
import "react-native-reanimated";
import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { loading } = useAuth(); // Destructure loading from useAuth
  const [isLogin, setIsLogin] = useState(true); // State to manage Login/Sign Up title
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (loading || !loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Main Tab Navigator */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Auth Screens with Dynamic Title */}
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

        {/* Artwork Screens */}
        <Stack.Screen
          name="(artwork)/detail"
          options={{ title: "Artwork Detail" }}
        />
        <Stack.Screen
          name="(artwork)/upload"
          options={{ title: "Upload Artwork" }}
        />

        {/* Not Found Screen */}
        <Stack.Screen name="+not-found" options={{ title: "Not Found" }} />
      </Stack>
    </ThemeProvider>
  );
}
