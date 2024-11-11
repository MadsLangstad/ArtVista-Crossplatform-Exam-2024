import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  Animated,
  RefreshControl,
  TextInput,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { router } from "expo-router";
import { ArtworkItemProps } from "@/types/galleryTypes";
import { fetchArtworks } from "@/services/firebaseService";
import ArtworkItem from "@/components/ArtWorkItem";
import { useAuth } from "@/hooks/useAuth";
import { DocumentSnapshot } from "firebase/firestore";

export default function Gallery() {
  const [artworks, setArtworks] = useState<ArtworkItemProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [lastVisible, setLastVisible] = useState<DocumentSnapshot | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const scrollY = useRef(new Animated.Value(0)).current;

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
            artwork.title.toLowerCase().includes(query.toLowerCase())
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

  const refreshArtworksData = () => fetchArtworksData(true);

  const handleArtworkPress = (artwork: ArtworkItemProps) => {
    router.push(`/(artwork)/detail?id=${artwork.id}`);
  };

  const handleSearch = () => {
    fetchArtworksData(true, searchQuery);
  };

  const renderItem = ({ item }: { item: ArtworkItemProps }) => (
    <ArtworkItem item={item} handlePress={handleArtworkPress} />
  );

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
            className="border-2 border-pink-700 px-2 dark:text-white py-2.5 font-semibold rounded-lg flex-1 mr-2"
            placeholder="Search for specific artwork"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity
            className="flex justify-center items-center bg-blue-700 rounded-lg px-4 py-2"
            onPress={handleSearch}
          >
            <Text className="text-lg font-semibold text-white">Search</Text>
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
        contentContainerStyle={{ paddingTop: 60 }}
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
