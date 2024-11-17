import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { ImagePickerModalProps } from "@/types/profileTypes";
import Button from "./Button";

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

          {/* Pick Image from Library */}
          <Button
            onPress={pickImageFromLibrary}
            style={{
              backgroundColor: "#007BFF",
              borderRadius: 8,
              paddingVertical: 12,
              marginBottom: 16,
            }}
            textStyle={{
              fontSize: 16,
              fontWeight: "600",
              textAlign: "center",
              color: "white",
            }}
          >
            <Text>Pick Image from Library</Text>
          </Button>

          {/* Take a Photo */}
          <Button
            onPress={takeImageWithCamera}
            style={{
              backgroundColor: "#007BFF",
              borderRadius: 8,
              paddingVertical: 12,
              marginBottom: 16,
            }}
            textStyle={{
              fontSize: 16,
              fontWeight: "600",
              textAlign: "center",
              color: "white",
            }}
          >
            <Text>Take a Photo</Text>
          </Button>

          {/* Cancel */}
          <Button
            onPress={() => setModalVisible(false)}
            style={{
              backgroundColor: "#D1D5DB", // Light gray background
              borderRadius: 8,
              paddingVertical: 12,
            }}
            textStyle={{
              fontSize: 16,
              fontWeight: "600",
              textAlign: "center",
              color: "black",
            }}
          >
            <Text>Cancel</Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
}
