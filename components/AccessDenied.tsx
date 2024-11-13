import { router } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { Image } from "react-native";
import { View } from "react-native";

export default function AccessDenied() {
  return (
    <View className="flex-1 justify-between items-center px-4">
      <Image
        source={require("@/assets/images/access-denied.png")}
        className="w-96 h-96"
        resizeMode="contain"
      />
      <Text className="text-white text-center text-lg">
        Only logged-in users have access to the profile page. Please log in to
        continue.
      </Text>
      <TouchableOpacity
        onPress={() => {
          router.push("/(auth)/auth");
        }}
        className="flex justify-center items-center bg-blue-700 w-32 rounded-lg py-2 px-4 shadow-lg mb-20"
      >
        <Text className="text-white text-xl font-semibold">Log In</Text>
      </TouchableOpacity>
    </View>
  );
}
