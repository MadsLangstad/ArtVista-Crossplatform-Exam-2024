import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  Alert,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { addArtworkDetails } from "@/services/firebaseService";
import { ArtworkDetails } from "@/types/galleryTypes";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/services/firebaseConfig";

export default function Profile() {
  const { user, logOut } = useAuth();
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/(auth)/auth");
    }
  }, [user, navigation]);

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
      setSelectedImage(result.assets[0].uri);
      setModalVisible(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      alert("Please select an image first!");
      return;
    }

    if (!user) {
      alert("User not authenticated!");
      return;
    }

    setIsUploading(true);
    try {
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const fileName = `${user.uid}_${Date.now()}.jpg`;

      const storageRef = ref(storage, `artwork-images/${fileName}`);

      await uploadBytesResumable(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      const artworkDetails: ArtworkDetails = {
        title: "New Artwork",
        description: "Description of the artwork",
        imageUrl: downloadURL,
        artist: user.displayName || "Anonymous Artist",
        year: new Date().getFullYear(),
        hashtags: [],
        artistId: user.uid,
        uploadDate: new Date().toISOString(),
        exhibitionInfo: {
          location: "Default Location",
          date: new Date().toISOString(),
        },
        upvote: 0,
        downvote: 0,
      };

      await addArtworkDetails(artworkDetails);
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black p-4">
        <Text className="text-red-500 text-xl">
          Please log in to view your profile.
        </Text>
        <Button
          title="Go to Login"
          onPress={() => router.push("/(auth)/auth")}
          color="blue"
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-black p-4">
      <View className="items-center mb-8">
        <Image
          source={{
            uri: user.photoURL || "https://via.placeholder.com/150",
          }}
          className="w-32 h-32 rounded-full mb-4"
          resizeMode="cover"
        />

        <Text className="text-black dark:text-white text-2xl font-bold">
          {user.displayName}
        </Text>
        <Text className="text-gray-800 dark:text-gray-400 text-lg">
          {user.email}
        </Text>
      </View>

      <View className="mb-4">
        {selectedImage && (
          <Image
            source={{ uri: selectedImage }}
            className="w-full h-40 rounded-lg mb-2"
            resizeMode="cover"
          />
        )}
        <Button title="Pick an Image" onPress={() => setModalVisible(true)} />
        <TouchableOpacity
          onPress={handleUpload}
          disabled={isUploading}
          className="bg-blue-500 mt-4 p-3 rounded-lg"
        >
          <Text className="text-white text-center">
            {isUploading ? "Uploading..." : "Upload Image"}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white rounded-lg p-4 w-80">
            <Text className="text-black text-lg font-bold mb-4">
              Select an Image
            </Text>
            <Button title="Pick Image" onPress={pickImage} />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="mt-4 p-2 bg-gray-300 rounded"
            >
              <Text className="text-center">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Actions */}
      <View className="flex-row justify-around w-full mt-4">
        <Button title="Edit Profile" onPress={() => alert("Edit Profile")} />
        <Button title="Log Out" color="red" onPress={logOut} />
      </View>
    </View>
  );
}
