import React from "react";
import { View, Text, Image } from "react-native";
import { useAuth } from "@/hooks/useAuth";

export default function ProfileHeader() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <View className="flex-row justify-between items-center mb-8">
      <View>
        <Text className="text-black dark:text-white text-2xl font-bold">
          {user.email}
        </Text>
        <Text className="text-gray-800 dark:text-gray-400 text-lg">
          {user.email}
        </Text>
      </View>
      <Image
        source={{ uri: user.photoURL || "https://via.placeholder.com/150" }}
        className="w-36 h-36 rounded-full"
        resizeMode="cover"
      />
    </View>
  );
}
