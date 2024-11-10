import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Dimensions,
  RefreshControl,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { TextInput } from "react-native";
import { router } from "expo-router";
import { ArtworkItemProps } from "@/types/galleryTypes";
import { fetchArtworks } from "@/services/firebaseService";
import ArtworkItem from "@/components/ArtWorkItem";
import { useAuth } from "@/hooks/useAuth";
import { DocumentSnapshot } from "firebase/firestore";

const headerTranslateYConfig: Animated.InterpolationConfigType = {
  inputRange: [0, 10],
  outputRange: [0, -55],
  extrapolate: "clamp" as const,
};

const { height: screenHeight } = Dimensions.get("window");

export default function Gallery() {
  const [artworks, setArtworks] = useState<ArtworkItemProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [lastVisible, setLastVisible] = useState<DocumentSnapshot | null>(null);
  const { user } = useAuth();
  const scrollY = useRef(new Animated.Value(0)).current;

  const fetchArtworksData = async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
        setLastVisible(null); // Reset lastVisible on refresh
      } else {
        setLoading(true);
      }

      const {
        artworks: fetchedArtworks,
        firstVisible: newFirstVisible,
        lastVisible: newLastVisible,
      } = await fetchArtworks(refresh ? null : lastVisible);

      // Filter out duplicate items
      const uniqueArtworks = [
        ...(refresh ? [] : artworks),
        ...fetchedArtworks,
      ].filter(
        (item, index, self) => index === self.findIndex((t) => t.id === item.id)
      );

      setArtworks(uniqueArtworks);
      setLastVisible(newLastVisible); // Update the last visible item
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

  if (loading && !refreshing) {
    return <Loader />;
  }

  const headerTranslateY = scrollY.interpolate(headerTranslateYConfig);

  return (
    <View className="flex dark:bg-black p-4">
      <Animated.View
        style={{ transform: [{ translateY: headerTranslateY }] }}
        className="flex justify-between flex-row"
      >
        <TextInput
          className="border-2 border-pink-700 text-pink-700 px-2 font-semibold rounded-lg w-3/4"
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

      <Animated.FlatList
        data={artworks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={1}
        showsVerticalScrollIndicator={false}
        className="pt-4 mb-10"
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
          />
        }
        ListFooterComponent={
          loading && !refreshing ? (
            <View className="px-5">
              <ActivityIndicator size="large" color="#E91E63" />
            </View>
          ) : null
        }
      />
    </View>
  );
}

const Loader = () => (
  <View className="center-loader">
    <ActivityIndicator size="large" color="#E91E63" />
  </View>
);
