import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";

interface EditProfileModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  saveProfile: (profile: { username: string; bio: string }) => void;
}

export default function EditProfileModal({
  modalVisible,
  setModalVisible,
  saveProfile,
}: EditProfileModalProps) {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  const handleSave = () => {
    // Pass the updated data back to parent or handle here
    saveProfile({ username, bio });
    setModalVisible(false);
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
