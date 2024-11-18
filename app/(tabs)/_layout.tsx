import { Tabs } from "expo-router";
import React from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabsLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colorScheme === "dark" ? "#000000" : "#FFFFFF",
        },
        tabBarActiveTintColor: "#E91E63",
        tabBarInactiveTintColor: "#007BFF",
        headerShown: true,
        headerStyle: {
          backgroundColor: colorScheme === "dark" ? "#000000" : "#FFFFFF",
        },
        headerTintColor: colorScheme === "dark" ? "#FFFFFF" : "#000000",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Gallery",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="browse-gallery" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="face-man-profile"
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
