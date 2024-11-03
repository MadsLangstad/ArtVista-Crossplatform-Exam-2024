import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { Button } from "@rneui/themed";

interface ImagePickerModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  pickImageFromLibrary: () => void;
  takeImageWithCamera: () => void;
}

export default function ImagePickerModal({
  modalVisible,
  setModalVisible,
  pickImageFromLibrary,
  takeImageWithCamera,
}: ImagePickerModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
        <View className="rounded-lg p-6 w-80 bg-white dark:bg-gray-800 shadow-lg">
          <Text className="text-lg font-bold mb-4 text-black dark:text-white">
            Select an Option
          </Text>
          <Button
            title="Pick Image from Library"
            onPress={pickImageFromLibrary}
            buttonStyle={{
              backgroundColor: "#4A90E2",
              borderRadius: 8,
              paddingVertical: 12,
            }}
            titleStyle={{ color: "#fff", fontWeight: "bold" }}
            containerStyle={{ marginBottom: 12 }}
          />
          <Button
            title="Take a Photo"
            onPress={takeImageWithCamera}
            buttonStyle={{
              backgroundColor: "#4A90E2",
              borderRadius: 8,
              paddingVertical: 12,
            }}
            titleStyle={{ color: "#fff", fontWeight: "bold" }}
            containerStyle={{ marginBottom: 12 }}
          />
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            className="p-3 rounded bg-gray-300 dark:bg-gray-600"
          >
            <Text className="text-center text-black dark:text-white font-medium">
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
