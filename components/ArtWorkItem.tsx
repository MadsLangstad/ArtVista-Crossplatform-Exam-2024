import { ActivityIndicator, Text, View } from "react-native";
import React, { memo, useState } from "react";
import { Image, TouchableOpacity } from "react-native";
import { ArtworkItemComponentProps } from "@/types/galleryTypes";

const ArtworkItem = memo(({ item, handlePress }: ArtworkItemComponentProps) => {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <TouchableOpacity
      onPress={() => handlePress(item)}
      className="mb-6 z-10 rounded-lg bg-white dark:bg-slate-900 shadow-md w-full border-2 border-[#E91E63]"
      style={{ elevation: 3 }}
    >
      <View className="w-full h-48 bg-gray-200 dark:bg-slate-800 rounded-lg overflow-hidden relative">
        {imageLoading && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1,
            }}
          >
            <ActivityIndicator size="large" color="#E91E63" />
          </View>
        )}
        <Image
          source={{ uri: item.imageUrl }}
          className="w-full h-full"
          resizeMode="cover"
          onLoad={() => setImageLoading(false)}
          style={{ position: "absolute", width: "100%", height: "100%" }}
        />
        <View className="absolute bottom-0 inset-x-0 bg-opacity-30 p-2 px-2">
          <Text className="text-lg font-bold text-white">{item.title}</Text>
          <Text className="text-sm font-semibold text-white mt-1">
            {item.description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default ArtworkItem;
