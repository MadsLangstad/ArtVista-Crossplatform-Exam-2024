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
import { useAuth } from "@/contexts/AuthContext";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { addArtworkDetails, firestore } from "@/services/firebaseService";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/services/firebaseConfig";
import ProfileHeader from "@/components/ProfileHeader";
import ImagePickerModal from "@/components/ImagePickerModal";
import EditProfileModal from "@/components/EditProfileModal";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Profile() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
  const { user, logOut } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
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

  // Function to convert URI to Blob using XMLHttpRequest
  const uriToBlob = (uri: string): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new Error("Failed to convert URI to Blob"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
  };

  // Function to compress image using Expo ImageManipulator
  const compressImage = async (uri: string): Promise<string> => {
    try {
      const compressedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1024 } }], // Resize to 1024px width
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      return compressedImage.uri;
    } catch (error) {
      console.error("Error compressing image:", error);
      throw new Error("Failed to compress image.");
    }
  };

  const handleUpload = async () => {
    if (!selectedImage || !title || !description) {
      Alert.alert(
        "Missing Information",
        "Please fill out all fields and select an image!"
      );
      return;
    }
    if (!user) {
      Alert.alert("Authentication Error", "User not authenticated!");
      return;
    }
    setIsUploading(true);
    try {
      // Compress the image before uploading
      const compressedImageUri = await compressImage(selectedImage);
      // Convert the compressed image URI to Blob
      const blob = await uriToBlob(compressedImageUri);

      const fileName = `${user.uid}_${Date.now()}.jpg`;
      const storageRef = ref(storage, `artwork-images/${fileName}`);

      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
          setUploadProgress(Number(progress.toFixed(2)));
        },
        (error) => {
          console.error("Error during upload:", error.code, error.message);
          Alert.alert(
            "Upload Error",
            `Failed to upload image: ${error.message}`
          );
          setIsUploading(false);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("Upload completed, file URL:", downloadURL);
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
            Alert.alert("Success", "Image uploaded successfully!");
            setTitle("");
            setDescription("");
            setSelectedImage(null);
            setUploadProgress(0);
          } catch (error) {
            console.error("Error saving artwork details:", error);
            Alert.alert(
              "Save Error",
              "Failed to save artwork details. Please try again."
            );
          } finally {
            setIsUploading(false);
          }
        }
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error uploading image:", error.message);
      } else {
        console.error("Error uploading image:", error);
      }
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      Alert.alert("Upload Error", `Failed to upload image: ${errorMessage}`);
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
          const compressedProfileImageUri = await compressImage(
            profileImageUrl
          );
          const blob = await uriToBlob(compressedProfileImageUri);
          const fileName = `profile-images/${user.uid}_${Date.now()}.jpg`;
          const storageRef = ref(storage, fileName);
          const uploadTask = uploadBytesResumable(storageRef, blob);

          await new Promise<void>((resolve, reject) => {
            uploadTask.on(
              "state_changed",
              (snapshot) => {
                const progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Profile Image Upload is ${progress}% done`);
                setUploadProgress(Number(progress.toFixed(2)));
              },
              (error) => {
                console.error("Error during profile image upload:", error);
                Alert.alert(
                  "Upload Error",
                  `Failed to upload profile image: ${error.message}`
                );
                reject(error);
              },
              async () => {
                try {
                  updatedImageUrl = await getDownloadURL(storageRef);
                  resolve();
                } catch (error) {
                  reject(error);
                }
              }
            );
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
        Alert.alert("Success", "Profile updated successfully!");
      } catch (error) {
        console.error("Error updating profile:", error);
        Alert.alert(
          "Update Error",
          "Failed to update profile. Please try again."
        );
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

  return (
    <View className="flex-1 bg-white dark:bg-black p-4">
      <ProfileHeader refresh={refresh} />
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
        {isUploading && (
          <View className="mb-4">
            <View className="bg-gray-300 h-2 rounded-lg overflow-hidden">
              <View
                style={{ width: `${uploadProgress}%` }}
                className="bg-blue-700 h-full"
              />
            </View>
            <Text className="text-center text-sm mt-2 dark:text-white">
              Uploading: {uploadProgress}%
            </Text>
          </View>
        )}
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          disabled={isUploading}
          className={`p-3 rounded-lg ${
            isUploading ? "bg-gray-500" : "bg-blue-700"
          }`}
        >
          <Text className="text-white text-center">Choose Image</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleUpload}
          disabled={isUploading}
          className={`p-3 rounded-lg ${
            isUploading ? "bg-gray-500" : "bg-blue-700"
          }`}
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
