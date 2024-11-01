// app/artwork/upload.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Button, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

export default function UploadArtwork() {
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  // Function to pick an image from the gallery
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "We need camera roll permissions to proceed!"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  // Function to handle the form submission
  const handleSubmit = () => {
    if (!title || !description || !image) {
      Alert.alert(
        "Missing Fields",
        "Please fill in all fields and select an image."
      );
      return;
    }

    // Replace this with your upload logic (e.g., Firebase, API call)
    Alert.alert("Success", "Artwork uploaded successfully!");
    setTitle("");
    setDescription("");
    setImage(null);
    router.back(); // Navigate back after submission
  };

  return (
    <View className="flex-1 bg-black p-4">
      <Text className="text-white text-2xl font-bold mb-4">Upload Artwork</Text>

      {/* Image Picker */}
      <View className="items-center mb-4">
        {image ? (
          <Image
            source={{ uri: image }}
            className="w-full h-60 rounded-lg mb-4"
            resizeMode="cover"
          />
        ) : (
          <Button title="Pick an Image" onPress={pickImage} />
        )}
      </View>

      {/* Title Input */}
      <TextInput
        placeholder="Title"
        placeholderTextColor="#666"
        value={title}
        onChangeText={setTitle}
        className="bg-gray-800 text-white p-3 rounded mb-4"
      />

      {/* Description Input */}
      <TextInput
        placeholder="Description"
        placeholderTextColor="#666"
        value={description}
        onChangeText={setDescription}
        className="bg-gray-800 text-white p-3 rounded mb-4"
        multiline
        numberOfLines={4}
      />

      {/* Submit Button */}
      <Button title="Submit" onPress={handleSubmit} color="#00BFFF" />
    </View>
  );
}
