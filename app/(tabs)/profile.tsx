import React, { useEffect } from "react";
import { View, Text, Button, Image } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { useNavigation } from "@react-navigation/native"; // Import navigation hook
import { router } from "expo-router";

export default function Profile() {
  const { user, logOut } = useAuth();
  const navigation = useNavigation(); // Initialize navigation

  // Redirect to the login screen if the user is not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/(auth)/auth");
    }
  }, [user, navigation]);

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black p-4">
        <Text className="text-red-500 text-xl">
          Please log in to view your profile.
        </Text>
        <Button
          title="Go to Login"
          onPress={() => router.push("/(auth)/auth")} // Navigate to the login screen
          color="blue"
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-black p-4">
      <View className="items-center mb-8">
        {/* Profile Picture */}
        <Image
          source={{
            uri: user.photoURL || "https://via.placeholder.com/150",
          }}
          className="w-32 h-32 rounded-full mb-4"
          resizeMode="cover"
        />

        {/* User Details */}
        <Text className="text-black dark:text-white text-2xl font-bold">
          {user.displayName || "Anonymous User"}
        </Text>
        <Text className="text-gray-800 dark:text-gray-400 text-lg">
          {user.email}
        </Text>
      </View>

      {/* Actions */}
      <View className="flex-row justify-around w-full mt-4">
        <Button title="Edit Profile" onPress={() => alert("Edit Profile")} />
        <Button title="Log Out" color="red" onPress={logOut} />
      </View>
    </View>
  );
}
