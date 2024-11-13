import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { ImagePickerModalProps } from "@/types/profileTypes";

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
        <View className="w-4/5 bg-white dark:bg-slate-900 p-6 rounded-lg shadow-lg">
          <Text className="text-xl font-bold text-center mb-4 text-[#E91E63]">
            Select an Option
          </Text>

          <TouchableOpacity
            onPress={pickImageFromLibrary}
            className="bg-blue-700 rounded-lg py-3 mb-4"
          >
            <Text className="text-center text-white font-semibold text-lg">
              Pick Image from Library
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={takeImageWithCamera}
            className="bg-blue-700 rounded-lg py-3 mb-4"
          >
            <Text className="text-center text-white font-semibold text-lg">
              Take a Photo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            className="bg-gray-300 dark:bg-gray-700 rounded-lg py-3"
          >
            <Text className="text-center text-black dark:text-white font-semibold text-lg">
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
