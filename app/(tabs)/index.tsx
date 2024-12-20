import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Animated,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { ArtworkItemProps } from "@/types/galleryTypes";
import { fetchArtworks } from "@/services/firebaseService";
import ArtworkItem from "@/components/ArtWorkItem";
import { DocumentSnapshot } from "firebase/firestore";
import { useDebounce } from "@/hooks/useDebouced";

export default function Gallery() {
  const [artworks, setArtworks] = useState<ArtworkItemProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [lastVisible, setLastVisible] = useState<DocumentSnapshot | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const scrollY = useRef(new Animated.Value(0)).current;

  // Debounced search query to reduce unnecessary API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Fetches artworks from the API with optional refresh or search query handling.
  // Ensures duplicate IDs are removed and updates the state with filtered results.
  const fetchArtworksData = async (refresh = false, query = "") => {
    try {
      if (refresh) {
        setRefreshing(true);
        setLastVisible(null);
      } else {
        setLoading(true);
      }

      const {
        artworks: fetchedArtworks,
        firstVisible: newFirstVisible,
        lastVisible: newLastVisible,
      } = await fetchArtworks(refresh ? null : lastVisible);

      const uniqueArtworks = [
        ...(refresh ? [] : artworks),
        ...fetchedArtworks,
      ].filter(
        (item, index, self) => index === self.findIndex((t) => t.id === item.id)
      );

      const filteredArtworks = query
        ? uniqueArtworks.filter((artwork) =>
            [artwork.title, artwork.description, artwork.abstract].some(
              (field) => field?.toLowerCase().includes(query.toLowerCase())
            )
          )
        : uniqueArtworks;

      setArtworks(filteredArtworks);
      setLastVisible(newLastVisible);
    } catch (error) {
      console.error("Error fetching artworks:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchArtworksData();
  }, []);

  // Refetches artworks when the debounced search query changes,
  // applying the query to filter results.
  useEffect(() => {
    fetchArtworksData(true, debouncedSearchQuery);
  }, [debouncedSearchQuery]);

  const refreshArtworksData = () => fetchArtworksData(true);

  const handleArtworkPress = (artwork: ArtworkItemProps) => {
    router.push(`/(artwork)/detail?id=${artwork.id}`);
  };

  const renderItem = ({ item }: { item: ArtworkItemProps }) => (
    <ArtworkItem
      item={item}
      handlePress={handleArtworkPress}
      searchQuery={searchQuery}
    />
  );

  // Interpolates the header's vertical translation to achieve a scroll-based collapsing effect.
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -200],
    extrapolate: "clamp",
  });

  return (
    <View className="flex-1 light:bg-white dark:bg-black">
      <Animated.View
        style={{
          transform: [{ translateY: headerTranslateY }],
          zIndex: 1,
          position: "absolute",
          top: 10,
          left: 0,
          right: 0,
          paddingHorizontal: 10,
        }}
      >
        <View className="flex-row justify-between items-center">
          <TextInput
            className="border-2 border-[#E91E63] px-2 dark:text-white py-2.5 font-semibold rounded-lg flex-1 mr-2"
            placeholder="Search by title, description, or abstract"
            placeholderTextColor="#aaa"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity
            onPress={() => setSearchQuery("")}
            className="bg-pink-700 px-4 py-3 rounded-lg"
          >
            <Text className="text-white">Search</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.FlatList
        data={artworks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={1}
        style={{ paddingHorizontal: 10 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: Platform.OS === "ios" ? 60 : 70 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshArtworksData}
            colors={["#E91E63"]}
            tintColor="#E91E63"
            progressViewOffset={40}
          />
        }
        ListEmptyComponent={
          !loading ? (
            <Text className="text-center mt-10">No artworks found</Text>
          ) : null
        }
        ListFooterComponent={
          loading && !refreshing ? (
            <View className="px-5 py-5">
              <ActivityIndicator size="large" color="#E91E63" />
            </View>
          ) : null
        }
      />
    </View>
  );
}
