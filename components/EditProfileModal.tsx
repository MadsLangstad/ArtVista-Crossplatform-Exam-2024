import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { EditProfileModalProps } from "@/types/profileTypes";

export default function EditProfileModal({
  modalVisible,
  setModalVisible,
  saveProfile,
}: EditProfileModalProps) {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleSave = () => {
    saveProfile({ username, bio, profileImageUrl: profileImage || "" });
    setModalVisible(false);
  };

  const pickProfileImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need camera roll permissions!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const takeProfileImageWithCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need camera permissions!");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <Modal
      transparent
      animationType="slide"
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
        <View className="w-4/5 bg-white dark:bg-slate-900 p-6 rounded-lg shadow-lg">
          <Text className="text-xl font-bold text-center mb-4 text-[#E91E63]">
            Edit Profile
          </Text>
          <TouchableOpacity onPress={pickProfileImage} className="mb-4">
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                className="w-24 h-24 rounded-full self-center"
                resizeMode="cover"
              />
            ) : (
              <Text className="text-center text-blue-500">
                Select Profile Image from Library
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={takeProfileImageWithCamera}
            className="mb-4"
          >
            <Text className="text-center text-blue-500">
              Take Profile Image with Camera
            </Text>
          </TouchableOpacity>
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            className="bg-gray-200 dark:bg-black text-black dark:text-white border-2 border-[#E91E63] p-3 rounded-lg mb-4"
          />
          <TextInput
            placeholder="Bio"
            value={bio}
            onChangeText={setBio}
            className="bg-gray-200 dark:bg-black text-black dark:text-white border-2 border-[#E91E63] p-3 rounded-lg mb-4"
            multiline
          />
          <View className="flex-row justify-between px-10">
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="bg-blue-700 rounded-lg flex justify-center items-center p-3 w-1/3"
            >
              <Text className="text-white text-lg">Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              className="bg-blue-700 rounded-lg flex justify-center items-center p-3 w-1/3"
            >
              <Text className="text-white text-lg">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
