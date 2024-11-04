import { ActivityIndicator, Alert, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { router } from "expo-router";
import { ArtworkItemProps } from "@/types/galleryTypes";
import { fetchArtworks } from "@/services/firebaseService";
import ArtworkItem from "@/components/ArtWorkItem";
import { useAuth } from "@/hooks/useAuth";

export default function Gallery() {
  const [artworks, setArtworks] = useState<Array<ArtworkItemProps>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

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
    if (!user) {
      Alert.alert(
        "Access Denied",
        "Only logged-in users have access to this page."
      );
      router.push("/(auth)/auth");
      return;
    } else {
      router.push(`/(artwork)/detail?id=${artwork.id}`);
    }
  };

  const renderItem = ({ item }: { item: ArtworkItemProps }) => (
    <ArtworkItem item={item} handlePress={handleArtworkPress} />
  );

  if (loading) {
    return (
      <View className="center-loader">
        <ActivityIndicator size="large" color="#00E0FF" />
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
