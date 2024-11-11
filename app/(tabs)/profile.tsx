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
import { addArtworkDetails, firestore } from "@/services/firebaseService";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/services/firebaseConfig";
import ProfileHeader from "@/components/ProfileHeader";
import ImagePickerModal from "@/components/ImagePickerModal";
import EditProfileModal from "@/components/EditProfileModal";
import { doc, getDoc, setDoc } from "firebase/firestore";

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
            data.profileImageUrl || "https://via.placeholder.com/150"
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

  if (!user)
    return (
      <View className="flex-1 justify-between items-center px-4">
        <Image
          source={require("@/assets/images/access-denied.png")}
          className="w-96 h-96"
          resizeMode="contain"
        />
        <Text className="text-white text-center text-lg">
          Only logged-in users have access to the profile page. Please log in to
          continue.
        </Text>
        <TouchableOpacity
          onPress={() => {
            router.push("/(auth)/auth");
          }}
          className="flex justify-center items-center bg-blue-700 w-32 rounded-lg py-2 px-4 shadow-lg mb-20"
        >
          <Text className="text-white text-xl font-semibold">Log In</Text>
        </TouchableOpacity>
      </View>
    );

  return (
    <View className="flex-1 bg-white dark:bg-black p-4">
      <Text>
        <ProfileHeader refresh={refresh} />
      </Text>
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
          className="bg-gray-200 dark:bg-black text-black border-2 border-[#E91E63] dark:text-white p-3 rounded-lg"
        />
        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          className="bg-gray-200 dark:bg-black text-black border-2 border-[#E91E63] dark:text-white p-3 rounded-lg mb-4"
          multiline
        />

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="bg-blue-700 p-3 rounded-lg"
        >
          <Text className="text-white text-center">Add Image</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleUpload}
          disabled={isUploading}
          className="bg-blue-700 p-3 rounded-lg"
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
        takeImageWithCamera={pickImageWithCamera}
      />
      <View className="flex-row justify-center gap-8 w-full mt-4">
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
      <EditProfileModal
        modalVisible={editModalVisible}
        setModalVisible={setEditModalVisible}
        saveProfile={saveProfile}
      />
    </View>
  );
}
