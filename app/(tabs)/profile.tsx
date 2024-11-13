import React, { useEffect, useState } from "react";
import {
  View,
  Alert,
  TextInput,
  TouchableOpacity,
  Image,
  Text,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { addArtworkDetails, firestore } from "@/services/firebaseService";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/services/firebaseConfig";
import ProfileHeader from "@/components/ProfileHeader";
import ImagePickerModal from "@/components/ImagePickerModal";
import EditProfileModal from "@/components/EditProfileModal";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AccessDenied from "@/components/AccessDenied";

export default function Profile() {
  const { user, logOut } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUsername(data.username || "");
          setBio(data.bio || "");
          setProfileImageUrl(
            data.profileImageUrl || require("@/assets/images/profile.jpg")
          );
        }
      }
    };
    fetchUserProfile();
  }, [user, refresh]);

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
        artist: username || "Anonymous Artist",
        year: new Date().getFullYear(),
        hashtags: [],
        artistId: user.uid,
        uploadDate: new Date().toISOString(),
        exhibitionInfo: {
          location: "",
          date: "",
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

  const saveProfile = async ({
    username,
    bio,
    profileImageUrl,
  }: {
    username: string;
    bio: string;
    profileImageUrl: string;
  }) => {
    if (user) {
      try {
        let updatedImageUrl = profileImageUrl;

        if (profileImageUrl && !profileImageUrl.startsWith("https://")) {
          const response = await fetch(profileImageUrl);
          const blob = await response.blob();
          const fileName = `profile-images/${user.uid}_${Date.now()}.jpg`;
          const storageRef = ref(storage, fileName);
          const uploadTask = uploadBytesResumable(storageRef, blob);

          await new Promise((resolve, reject) => {
            uploadTask.on("state_changed", null, reject, async () => {
              updatedImageUrl = await getDownloadURL(storageRef);
              resolve(updatedImageUrl);
            });
          });
        }

        await setDoc(
          doc(firestore, "users", user.uid),
          {
            username,
            bio,
            profileImageUrl: updatedImageUrl,
            email: user.email,
          },
          { merge: true }
        );

        setUsername(username);
        setBio(bio);
        setProfileImageUrl(updatedImageUrl);
        setRefresh((prev) => !prev);
        alert("Profile updated successfully!");
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("Failed to update profile. Please try again.");
      }
    }
  };

  const clearSelection = () => {
    setSelectedImage(null);
    setTitle("");
    setDescription("");
  };

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

  const pickImageWithCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need camera permissions!");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
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

  if (!user) return <AccessDenied />;

  return (
    <View className="flex-1 bg-white dark:bg-black p-4">
      <Text>
        <ProfileHeader refresh={refresh} />
      </Text>
      <View className="flex-1 mb-8">
        {selectedImage ? (
          <>
            <Image
              source={{ uri: selectedImage }}
              className="w-full h-52 rounded-lg mb-4"
              resizeMode="cover"
            />
            <TextInput
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
              className="bg-gray-200 dark:bg-black text-black border-2 border-[#E91E63] dark:text-white p-3 rounded-lg mb-4"
            />
            <TextInput
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              className="bg-gray-200 dark:bg-black text-black border-2 border-[#E91E63] dark:text-white p-3 rounded-lg mb-2"
              multiline
            />
            <View className="flex items-center justify-center">
              <TouchableOpacity onPress={clearSelection}>
                <Icon name="close-circle" size={35} color="#f44336" />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View className="flex-1 pl-10 justify-center items-center">
            <Image
              source={require("@/assets/images/cat.png")}
              className="w-full h-72 rounded-lg mb-2"
              resizeMode="contain"
            />
          </View>
        )}
      </View>
      <View className="flex gap-4 justify-center w-[70%] m-auto">
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="bg-blue-700 p-3  rounded-lg"
        >
          <Text className="text-white text-center">Choose Image</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleUpload}
          disabled={isUploading}
          className="bg-blue-700 p-3 rounded-lg"
        >
          <Text className="text-white text-center">
            {isUploading ? <ActivityIndicator /> : "Upload Image"}
          </Text>
        </TouchableOpacity>

        <ImagePickerModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          pickImageFromLibrary={pickImageFromLibrary}
          takeImageWithCamera={pickImageWithCamera}
        />
        <View className="flex-row justify-center gap-8 w-full">
          <TouchableOpacity
            onPress={() => setEditModalVisible(true)}
            className="bg-blue-700 rounded-lg flex justify-center items-center p-3 w-32"
          >
            <Text className="text-white text-lg">Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={logOut}
            className="bg-[#E61E63] rounded-lg flex justify-center items-center p-3 w-32"
          >
            <Text className="text-white text-lg">Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
      <EditProfileModal
        modalVisible={editModalVisible}
        setModalVisible={setEditModalVisible}
        saveProfile={saveProfile}
      />
    </View>
  );
}
