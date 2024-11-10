import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Alert, TouchableOpacity } from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { useColorScheme } from "react-native";
import { router } from "expo-router";
import CustomButton from "@/components/Button";

export default function Auth() {
  const { user, signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (user) {
      router.push("/(tabs)/profile");
    }
  }, [user]);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
        router.push("/(tabs)/profile");
      } else {
        await signUp(email, password);
        router.push("/(tabs)/profile");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred.";
      Alert.alert(isLogin ? "Login Failed" : "Signup Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      className={`flex-1 justify-center items-center p-4 ${
        colorScheme === "dark" ? "bg-black" : "bg-white"
      }`}
    >
      <Text
        className={`text-2xl font-bold mb-4 ${
          colorScheme === "dark" ? "text-white" : "text-black"
        }`}
      >
        {isLogin ? "Login" : "Sign Up"}
      </Text>
      {!isLogin && (
        <TextInput
          placeholder="Username"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          className={`w-full p-3 mb-4 rounded-lg ${
            colorScheme === "dark"
              ? "bg-gray-800 text-white"
              : "bg-gray-200 text-black"
          }`}
        />
      )}

      <TextInput
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        className={`w-full p-3 mb-4 rounded-lg ${
          colorScheme === "dark"
            ? "bg-gray-800 text-white"
            : "bg-gray-200 text-black"
        }`}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className={`w-full p-3 mb-6 rounded-lg ${
          colorScheme === "dark"
            ? "bg-gray-800 text-white"
            : "bg-gray-200 text-black"
        }`}
      />

      <CustomButton
        isLoggedIn={isLogin}
        onLogin={handleAuth}
        onSignup={handleAuth}
      />

      <TouchableOpacity onPress={() => setIsLogin(!isLogin)} className="mt-4">
        <Text className="dark:text-lightblue-500 text-blue-500">
          {isLogin
            ? "Don't have an account? Sign up"
            : "Already have an account? Log in"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
