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
import { DocumentSnapshot } from "firebase/firestore"; // Ensure this is imported

// Get device height
const { height: screenHeight } = Dimensions.get("window");

export default function Gallery() {
  const [artworks, setArtworks] = useState<ArtworkItemProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [lastVisible, setLastVisible] = useState<DocumentSnapshot | null>(null);
  const { user } = useAuth();
  const scrollY = useRef(new Animated.Value(0)).current;

  const loadArtworks = async (refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else setLoading(true);

      const { artworks: fetchedArtworks, firstVisible: newLastVisible } =
        await fetchArtworks(null); // Fetch the latest artworks

      setArtworks(fetchedArtworks);
      setLastVisible(newLastVisible);
    } catch (error) {
      console.error("Error fetching artworks:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadArtworks();
  }, []);

  const handleRefresh = () => {
    loadArtworks(true); // Trigger a refresh
  };

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

      {/* FlatList with pull-to-refresh */}
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
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListFooterComponent={
          loading && !refreshing ? (
            <View style={{ paddingVertical: 20 }}>
              <ActivityIndicator size="small" color="#E91E63" />
            </View>
          ) : null
        }
      />
    </View>
  );
}
