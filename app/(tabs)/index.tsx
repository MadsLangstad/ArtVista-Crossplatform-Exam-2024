import { Text, View } from "react-native";
import React, { memo } from "react";
import { FlatList, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { ArtworkItemProps } from "@/types/galleryTypes";
import { ArtworkItemComponentProps } from "@/types/galleryTypes";

// Test data
const artworks = [
  {
    id: "1",
    title: "Artwork 1",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHe0MpcScrdxPwjT_aL06_aCYrDv1l3_GAUg&s",
    abstract: "Abstract 1",
  },
  {
    id: "2",
    title: "Artwork 2",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHe0MpcScrdxPwjT_aL06_aCYrDv1l3_GAUg&s",
    abstract: "Abstract 2",
  },
  {
    id: "3",
    title: "Artwork 3",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHe0MpcScrdxPwjT_aL06_aCYrDv1l3_GAUg&s",
    abstract: "Abstract 3",
  },
  {
    id: "4",
    title: "Artwork 4",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHe0MpcScrdxPwjT_aL06_aCYrDv1l3_GAUg&s",
    abstract: "Abstract 4",
  },
  {
    id: "5",
    title: "Artwork 5",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHe0MpcScrdxPwjT_aL06_aCYrDv1l3_GAUg&s",
    abstract: "Abstract 5",
  },
  {
    id: "6",
    title: "Artwork 6",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHe0MpcScrdxPwjT_aL06_aCYrDv1l3_GAUg&s",
    abstract: "Abstract 6",
  },
  {
    id: "7",
    title: "Artwork 7",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHe0MpcScrdxPwjT_aL06_aCYrDv1l3_GAUg&s",
    abstract: "Abstract 7",
  },
  {
    id: "8",
    title: "Artwork 8",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHe0MpcScrdxPwjT_aL06_aCYrDv1l3_GAUg&s",
    abstract: "Abstract 8",
  },
  {
    id: "9",
    title: "Artwork 9",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHe0MpcScrdxPwjT_aL06_aCYrDv1l3_GAUg&s",
    abstract: "Abstract 9",
  },
  {
    id: "10",
    title: "Artwork 10",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHe0MpcScrdxPwjT_aL06_aCYrDv1l3_GAUg&s",
    abstract: "Abstract 10",
  },
  {
    id: "11",
    title: "Artwork 11",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHe0MpcScrdxPwjT_aL06_aCYrDv1l3_GAUg&s",
    abstract: "Abstract 11",
  },
  {
    id: "12",
    title: "Artwork 12",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHe0MpcScrdxPwjT_aL06_aCYrDv1l3_GAUg&s",
    abstract: "Abstract 12",
  },
  {
    id: "13",
    title: "Artwork 13",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHe0MpcScrdxPwjT_aL06_aCYrDv1l3_GAUg&s",
    abstract: "Abstract 13",
  },
  {
    id: "14",
    title: "Artwork 14",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHe0MpcScrdxPwjT_aL06_aCYrDv1l3_GAUg&s",
    abstract: "Abstract 14",
  },
  {
    id: "15",
    title: "Artwork 15",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHe0MpcScrdxPwjT_aL06_aCYrDv1l3_GAUg&s",
    abstract: "Abstract 15",
  },
  {
    id: "16",
    title: "Artwork 16",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHe0MpcScrdxPwjT_aL06_aCYrDv1l3_GAUg&s",
    abstract: "Abstract 16",
  },
  {
    id: "17",
    title: "Artwork 17",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHe0MpcScrdxPwjT_aL06_aCYrDv1l3_GAUg&s",
    abstract: "Abstract 17",
  },
  {
    id: "18",
    title: "Artwork 18",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHe0MpcScrdxPwjT_aL06_aCYrDv1l3_GAUg&s",
    abstract: "Abstract 18",
  },
  {
    id: "19",
    title: "Artwork 19",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHe0MpcScrdxPwjT_aL06_aCYrDv1l3_GAUg&s",
    abstract: "Abstract 19",
  },
  {
    id: "20",
    title: "Artwork 20",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHe0MpcScrdxPwjT_aL06_aCYrDv1l3_GAUg&s",
    abstract: "Abstract 20",
  },
  {
    id: "21",
    title: "Artwork 21",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHe0MpcScrdxPwjT_aL06_aCYrDv1l3_GAUg&s",
    abstract: "Abstract 21",
  },
  {
    id: "22",
    title: "Artwork 22",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHe0MpcScrdxPwjT_aL06_aCYrDv1l3_GAUg&s",
    abstract: "Abstract 22",
  },
  {
    id: "23",
    title: "Artwork 23",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHe0MpcScrdxPwjT_aL06_aCYrDv1l3_GAUg&s",
    abstract: "Abstract 23",
  },
  {
    id: "24",
    title: "Artwork 24",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHe0MpcScrdxPwjT_aL06_aCYrDv1l3_GAUg&s",
    abstract: "Abstract 24",
  },
  {
    id: "25",
    title: "Artwork 25",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHe0MpcScrdxPwjT_aL06_aCYrDv1l3_GAUg&s",
    abstract: "Abstract 25",
  },
  {
    id: "26",
    title: "Artwork 26",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHe0MpcScrdxPwjT_aL06_aCYrDv1l3_GAUg&s",
    abstract: "Abstract 26",
  },
  {
    id: "27",
    title: "Artwork 27",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHe0MpcScrdxPwjT_aL06_aCYrDv1l3_GAUg&s",
    abstract: "Abstract 27",
  },
  {
    id: "28",
    title: "Artwork 28",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHe0MpcScrdxPwjT_aL06_aCYrDv1l3_GAUg&s",
    abstract: "Abstract 28",
  },
  {
    id: "29",
    title: "Artwork 29",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHe0MpcScrdxPwjT_aL06_aCYrDv1l3_GAUg&s",
    abstract: "Abstract 29",
  },
  {
    id: "30",
    title: "Artwork 30",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHe0MpcScrdxPwjT_aL06_aCYrDv1l3_GAUg&s",
    abstract: "Abstract 30",
  },
];

const ArtworkItem = memo(({ item, handlePress }: ArtworkItemComponentProps) => (
  <TouchableOpacity
    onPress={() => handlePress(item)}
    className="p-4 mb-4 rounded-lg bg-slate-200 dark:bg-black w-full"
  >
    <View className="w-full h-40 bg-slate-100 dark:bg-black rounded-lg overflow-hidden mb-2">
      <Image
        source={{ uri: item.image }}
        className="w-full h-full"
        resizeMode="cover"
      />
    </View>
    <View className="flex flex-row justify-between">
      <Text className="dark:text-white font-bold">Title: {item.title}</Text>
      <Text className="dark:text-gray-400">Abstract: {item.abstract}</Text>
    </View>
  </TouchableOpacity>
));

export default function Gallery() {
  const handleArtworkPress = (artwork: { id: any }) => {
    router.push(`/(artwork)/detail?id=${artwork.id}`);
  };

  const renderItem = ({ item }: { item: ArtworkItemProps }) => (
    <ArtworkItem item={item} handlePress={handleArtworkPress} />
  );
  const ITEM_HEIGHT = 200;

  return (
    <View className="flex-1 bg-white dark:bg-black p-4">
      <FlatList
        data={artworks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={1}
        showsVerticalScrollIndicator={false}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        initialNumToRender={10}
        windowSize={5}
        className="w-full"
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
}
