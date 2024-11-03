import React, { useEffect, useState } from "react";
import {
  View,
  Alert,
  TextInput,
  TouchableOpacity,
  Image,
  Text,
} from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { addArtworkDetails } from "@/services/firebaseService";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/services/firebaseConfig";
import { Button } from "@rneui/themed";
import ProfileHeader from "@/components/ProfileHeader";
import ImagePickerModal from "@/components/ImagePickerModal";

export default function Profile() {
  const { user, logOut } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/(auth)/auth");
    }
  }, [user]);

  const pickImageFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need camera roll permissions!");
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

  const takeImageWithCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need camera permissions!");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
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
    if (!selectedImage || !title || !description) {
      alert("Please fill out all fields and select an image!");
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
      await addArtworkDetails({
        title,
        description,
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
      });
      alert("Image uploaded successfully!");
      setTitle("");
      setDescription("");
      setSelectedImage(null);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View className="flex-1 bg-white dark:bg-black p-4">
      <ProfileHeader />

      <View className="mb-8 flex gap-4">
        {selectedImage && (
          <Image
            source={{ uri: selectedImage }}
            className="w-full h-52 rounded-lg mb-2"
            resizeMode="cover"
          />
        )}
        <TextInput
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white p-3 rounded-lg"
        />
        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white p-3 rounded-lg mb-4"
          multiline
        />

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="bg-blue-500 p-3 rounded-lg"
        >
          <Text className="text-white text-center">Add Image</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleUpload}
          disabled={isUploading}
          className="bg-blue-500 p-3 rounded-lg"
        >
          <Text className="text-white text-center">
            {isUploading ? "Uploading..." : "Upload Image"}
          </Text>
        </TouchableOpacity>
      </View>

      <ImagePickerModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        pickImageFromLibrary={pickImageFromLibrary}
        takeImageWithCamera={takeImageWithCamera}
      />

      <View className="flex-row justify-center gap-8 w-full mt-4">
        <TouchableOpacity
          onPress={() => alert("Edit Profile")}
          className="bg-blue-500 rounded-lg flex justify-center items-center p-3 w-32"
        >
          <Text className="text-white text-lg">Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={logOut}
          className="bg-red-600 rounded-lg flex justify-center items-center p-3 w-32"
        >
          <Text className="text-white text-lg">Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
