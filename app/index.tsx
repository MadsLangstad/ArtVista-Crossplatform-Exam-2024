import { useEffect } from "react";
import { Image, Text, View } from "react-native";
import { useRouter } from "expo-router";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Set a 3-second timer to navigate to the gallery screen
    const timer = setTimeout(() => {
      router.push("/(tabs)/");
    }, 2000);

    // Clear the timer if the component unmounts
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View className="flex-1 justify-center items-center bg-black px-6">
      <Image
        source={require("../assets/images/artivista-logo.png")}
        className="w-80 h-80 mb-10"
        resizeMode="contain"
      />

      <View className="flex gap-4">
        <Text className="text-white text-4xl font-extrabold text-center">
          Welcome to ArtiVista
        </Text>
        <Text className="text-gray-300 text-lg text-center">
          Discover a world of inspiration, curated by artists for art lovers.
          Step into the future of digital art exhibitions.
        </Text>
      </View>
    </View>
  );
}
