import { ActivityIndicator, Text, View } from "react-native";
import React, { memo, useState } from "react";
import { Image, TouchableOpacity } from "react-native";
import { ArtworkItemComponentProps } from "@/types/galleryTypes";

const ArtworkItem = memo(({ item, handlePress }: ArtworkItemComponentProps) => {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <TouchableOpacity
      onPress={() => handlePress(item)}
      className="p-4 mb-6 rounded-lg bg-white dark:bg-gray-800 shadow-md w-full"
      style={{ elevation: 3 }}
    >
      <View className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden mb-3 relative">
        {imageLoading && (
          <View className="center-loader">
            <ActivityIndicator size="large" color="#00E0FF" />
          </View>
        )}
        <Image
          source={{ uri: item.imageUrl }}
          className="w-full h-full"
          resizeMode="cover"
          onLoad={() => setImageLoading(false)}
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
  );
});

export default ArtworkItem;
