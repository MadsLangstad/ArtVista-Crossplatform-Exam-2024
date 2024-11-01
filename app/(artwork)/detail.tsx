// app/artwork/detail.tsx
import React from "react";
import { View, Text, Image, ScrollView, Button } from "react-native";
import { useRouter } from "expo-router";

const artworkDetails = {
  id: "1",
  title: "Starry Night",
  image:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1200px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
  description:
    "An iconic painting by Vincent van Gogh, depicting a swirling night sky.",
  artist: "Vincent van Gogh",
  year: 1889,
};

export default function Detail() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-white dark:bg-black p-4">
      <View className="items-center mb-4 bg-white dark:bg-black">
        {/* Artwork Image */}
        <Image
          source={{ uri: artworkDetails.image }}
          className="w-full h-80 rounded-lg"
          resizeMode="cover"
        />
      </View>

      {/* Artwork Details */}
      <Text className="text-black dark:text-white text-3xl font-bold mb-2">
        {artworkDetails.title}
      </Text>
      <Text className="text-gray-800 dark:text-gray-400 text-lg mb-4">
        By {artworkDetails.artist} ({artworkDetails.year})
      </Text>
      <Text className="text-black dark:text-white text-base mb-6">
        {artworkDetails.description}
      </Text>

      {/* Actions */}
      {/* <Button title="Go Back" onPress={() => router.back()} color="#00BFFF" /> */}
    </ScrollView>
  );
}
