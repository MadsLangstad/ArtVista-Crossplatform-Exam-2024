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
    <View className="flex-row pb-4 justify-between items-center">
      <View>
        <Text className="text-black dark:text-white text-2xl font-bold">
          {profileData.username}
        </Text>
        {profileData.bio ? (
          <Text className="text-gray-800 w-64 dark:text-gray-400 text-lg">
            {profileData.bio}
          </Text>
        ) : null}
        <Text className="text-gray-800 dark:text-gray-400 text-lg">
          {user.email}
        </Text>
      </View>
      <Image
        source={{
          uri: profileData.profileImageUrl || "https://via.placeholder.com/150",
        }}
        className="w-36 h-36 rounded-full"
        resizeMode="cover"
      />
    </View>
  );
}
