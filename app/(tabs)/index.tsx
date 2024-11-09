import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Dimensions,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { TextInput } from "react-native";
import { router } from "expo-router";
import { ArtworkItemProps } from "@/types/galleryTypes";
import { fetchArtworks } from "@/services/firebaseService";
import ArtworkItem from "@/components/ArtWorkItem";
import { useAuth } from "@/hooks/useAuth";

// Get device height
const { height: screenHeight } = Dimensions.get("window");

export default function Gallery() {
  const [artworks, setArtworks] = useState<Array<ArtworkItemProps>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadArtworks = async () => {
      try {
        const fetchedArtworks = await fetchArtworks();
        console.log("Fetched Artworks:", fetchedArtworks); // Debugging line
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

  const handleArtworkPress = (artwork: ArtworkItemProps) => {
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
        <ActivityIndicator size="large" color="#E91E63" />
      </View>
    );
  }

  // Animate the search bar's vertical position
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 10],
    outputRange: [0, -55],
    extrapolate: "clamp",
  });

  return (
    <View className="flex dark:bg-black p-4">
      {/* Animated header */}
      <Animated.View
        style={{
          transform: [{ translateY: headerTranslateY }],
        }}
        className="flex justify-between flex-row"
      >
        <TextInput
          className="border-2 p-2 border-[#E91E63] rounded-lg w-[275px] dark:text-[#E91E63]"
          placeholder="Search for specific artwork"
        />
        <TouchableOpacity
          className="flex justify-center items-center bg-blue-700 rounded-lg px-2"
          onPress={() => {
            Alert.alert(
              "Search",
              "Search functionality is not implemented yet."
            );
          }}
        >
          <Text className="text-lg p-2 font-semibold text-white">Search</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Animated.FlatList with onScroll to animate the header */}
      <Animated.FlatList
        data={artworks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={1}
        showsVerticalScrollIndicator={false}
        className="w-full rounded-lg"
        contentContainerStyle={{
          paddingTop: 10,
          paddingBottom: 16,
          minHeight: screenHeight,
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      />
    </View>
  );
}
