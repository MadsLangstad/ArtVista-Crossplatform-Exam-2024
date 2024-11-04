import { useEffect } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/(tabs)/");
    }, 10002000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View className="flex top-32 justify-center items-center bg-black px-6">
      <Image
        source={require("../assets/images/artvista-logo.png")}
        className="w-96 h-96"
        resizeMode="contain"
      />

      <View className="flex gap-6 items-center">
        <Text className="text-[#00BFFF] text-3xl font-extrabold text-center tracking-wider">
          Welcome To ArtVista
        </Text>
        <Text className="text-pink-500 text-lg font-semibold text-center leading-relaxed">
          Step into a world of inspiration where digital art comes alive.
          Curated by artists for art lovers, experience the future of art
          exhibitions today.
        </Text>

        <TouchableOpacity
          onPress={() => {
            router.push("/(tabs)/");
          }}
          className="flex justify-center items-center border-2 border-[#00BFFF] w-28 rounded-lg mt-20"
        >
          <Text className="text-[#00BFFF] text-2xl font-semibold px-4">
            Enter
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
