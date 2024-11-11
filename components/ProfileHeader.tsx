import React, { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/services/firebaseService";

interface ProfileHeaderProps {
  refresh: boolean;
}

export default function ProfileHeader({ refresh }: ProfileHeaderProps) {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    username: "Loading...",
    bio: "",
    profileImageUrl: "",
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setProfileData({
            username: data.username || "Unknown",
            bio: data.bio || "",
            profileImageUrl: data.profileImageUrl || user.photoURL || "",
          });
        }
      }
    };
    fetchProfileData();
  }, [user, refresh]);

  if (!user) return null;

  return (
    <View className="flex-row pb-4 gap-6 justify-between items-center">
      <View className="left-0">
        <Text className="text-black dark:text-white text-2xl font-bold">
          {profileData.username}
        </Text>
        {profileData.bio ? (
          <Text className="w-64 dark:text-white text-lg">
            Bio:{" "}
            <Text className="text-gray-800 dark:text-gray-400">
              {profileData.bio}
            </Text>
          </Text>
        ) : null}
        <Text className="dark:text-white text-lg">
          Contact:{" "}
          <Text className="text-gray-800 dark:text-gray-400">{user.email}</Text>
        </Text>
      </View>
      <Image
        source={
          profileData.profileImageUrl
            ? { uri: profileData.profileImageUrl }
            : require("@/assets/images/profile.jpg")
        }
        className="w-36 h-36 right-0 rounded-full"
        resizeMode="cover"
      />
    </View>
  );
}
