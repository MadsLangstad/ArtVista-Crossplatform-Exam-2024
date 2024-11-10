import React, { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { database } from "@/services/firebaseConfig"; // Add database
import { get, ref as dbRef } from "firebase/database"; // Import database functions

export default function ProfileHeader() {
  const { user } = useAuth();
  const [username, setUsername] = useState(""); // New state for username

  // Fetch username from the database
  useEffect(() => {
    const fetchUsername = async () => {
      if (user) {
        const usernameRef = dbRef(database, `users/${user.uid}/username`);
        const snapshot = await get(usernameRef);
        if (snapshot.exists()) {
          setUsername(snapshot.val());
        }
      }
    };
    fetchUsername();
  }, [user]);

  if (!user) return null;

  return (
    <View className="flex-row justify-between items-center">
      <View>
        <Text className="text-black dark:text-white text-2xl font-bold">
          {username}
        </Text>
        <Text className="text-gray-800 dark:text-gray-400 text-lg">
          {user.email}
        </Text>
      </View>
      <Image
        source={{ uri: user.photoURL || "https://via.placeholder.com/150" }}
        className="w-36 h-36 rounded-full"
        resizeMode="cover"
      />
    </View>
  );
}
