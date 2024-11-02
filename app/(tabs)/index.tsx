import { ActivityIndicator, Text, View } from "react-native";
import React, { memo, useEffect, useState } from "react";
import { FlatList, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { ArtworkItemProps } from "@/types/galleryTypes";
import { ArtworkItemComponentProps } from "@/types/galleryTypes";
import { fetchArtworks } from "@/services/firebaseService";

const ArtworkItem = memo(({ item, handlePress }: ArtworkItemComponentProps) => (
  <TouchableOpacity
    onPress={() => handlePress(item)}
    className="p-4 mb-6 rounded-lg bg-white dark:bg-gray-800 shadow-md w-full"
    style={{ elevation: 3 }}
  >
    <View className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden mb-3">
      <Image
        source={{ uri: item.imageUrl }}
        className="w-full h-full"
        resizeMode="cover"
      />
    </View>

    <View className="flex flex-col space-y-1">
      <Text className="text-lg font-bold text-gray-900 dark:text-white">
        {item.title}
      </Text>
      <Text className="text-sm text-gray-600 dark:text-gray-400">
        {item.description}
      </Text>
    </View>
  </TouchableOpacity>
));

export default function Gallery() {
  const [artworks, setArtworks] = useState<Array<ArtworkItemProps>>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadArtworks = async () => {
      try {
        const fetchedArtworks = await fetchArtworks();

        const transformedArtworks: ArtworkItemProps[] = fetchedArtworks
          .map((artwork) => ({
            id: artwork.id ?? "default-id",
            title: artwork.title,
            imageUrl: artwork.imageUrl,
            description: artwork.description,
            abstract: artwork.description,
          }))
          .filter((artwork) => artwork.id !== "default-id");

        setArtworks(transformedArtworks);
      } catch (error) {
        console.error("Error fetching artworks:", error);
      } finally {
        setLoading(false);
      }
    };

    loadArtworks();
  }, []);

  const handleArtworkPress = (artwork: { id: string }) => {
    router.push(`/(artwork)/detail?id=${artwork.id}`);
  };

  const renderItem = ({ item }: { item: ArtworkItemProps }) => (
    <ArtworkItem item={item} handlePress={handleArtworkPress} />
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-black">
        <ActivityIndicator size="large" color="#00BFFF" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-black p-4">
      <FlatList
        data={artworks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={1}
        showsVerticalScrollIndicator={false}
        className="w-full"
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
}
