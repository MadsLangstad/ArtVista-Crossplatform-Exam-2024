import React, { useState } from "react";
import { View, Text, TextInput, Modal, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { EditProfileModalProps } from "@/types/profileTypes";
import Button from "./Button";

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
      <View className="flex-1 justify-center items-center bg-white dark:bg-black bg-opacity-50">
        <View className="w-4/5 bg-white dark:bg-slate-900 p-6 rounded-lg shadow-lg">
          <Text className="text-xl font-bold text-center mb-4 text-[#E91E63]">
            Edit Profile
          </Text>

          {/* Profile Image Selector */}
          <Button
            onPress={pickProfileImage}
            style={{
              backgroundColor: "transparent",
              marginBottom: 16,
              justifyContent: "center",
            }}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={{ width: 96, height: 96, borderRadius: 48 }}
                resizeMode="cover"
              />
            ) : (
              <Text style={{ color: "#007BFF", textAlign: "center" }}>
                Select Profile Image from Library
              </Text>
            )}
          </Button>

          {/* Take Profile Image Button */}
          <Button
            onPress={takeProfileImageWithCamera}
            style={{
              backgroundColor: "transparent",
              marginBottom: 16,
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#007BFF", textAlign: "center" }}>
              Take Profile Image with Camera
            </Text>
          </Button>

          {/* Text Inputs */}
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

          {/* Close and Save Buttons */}
          <View className="flex-row justify-between px-10">
            <Button
              onPress={() => setModalVisible(false)}
              style={{
                backgroundColor: "#007BFF",
                padding: 12,
                borderRadius: 8,
                width: "45%",
                justifyContent: "center",
              }}
              textStyle={{ color: "white", fontSize: 16 }}
            >
              <Text style={{ color: "white", fontSize: 16 }}>Close</Text>
            </Button>
            <Button
              onPress={handleSave}
              style={{
                backgroundColor: "#007BFF",
                padding: 12,
                borderRadius: 8,
                width: "45%",
                justifyContent: "center",
              }}
              textStyle={{ color: "white", fontSize: 16 }}
            >
              <Text style={{ color: "white", fontSize: 16 }}>Save</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
