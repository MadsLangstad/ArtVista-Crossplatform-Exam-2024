import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { useColorScheme } from "react-native";
import { router } from "expo-router";
import Button from "@/components/Button";

export default function Auth() {
  const { user, signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (user) {
      router.push("/(tabs)/profile");
    }
  }, [user]);

  const handleAuth = async () => {
    if (!email || !password || (!isLogin && !username)) {
      Alert.alert("Error", "Please fill out all required fields.");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, username);
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
      className={`flex-1 justify-center items-center p-4 mb-20 ${
        colorScheme === "dark" ? "bg-black" : "bg-white"
      }`}
    >
      <Text
        className={`text-2xl font-bold mb-4 ${
          colorScheme === "dark" ? "text-white" : "text-black"
        }`}
      >
        <Image
          source={require("@/assets/images/artvista-logo.png")}
          className="w-96 h-96"
        />
      </Text>
      {!isLogin && (
        <TextInput
          placeholder="Username"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          className={`p-3 mb-4 bg-gray-200 w-[70%] m-auto dark:bg-gray-800 text-black dark:text-white rounded-lg border-2 border-[#E91E63] ${
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
        className={`p-3 mb-4 w-[70%] border-2 border-[#E61E63] rounded-lg  ${
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
        className={`p-3 mb-6 w-[70%] rounded-lg border-2 border-[#E61E63] ${
          colorScheme === "dark"
            ? "bg-gray-800 text-white"
            : "bg-gray-200 text-black"
        }`}
      />

      <Button
        onPress={handleAuth}
        title={isLogin ? "Login" : "Sign Up"}
        style={{
          backgroundColor: "#007BFF",
          borderRadius: 8,
          paddingVertical: 12,
          marginBottom: 16,
          width: "45%",
        }}
        textStyle={{
          fontSize: 16,
          fontWeight: "600",
          textAlign: "center",
          color: "white",
        }}
      />
      <TouchableOpacity>
        <Text
          onPress={() => setIsLogin(!isLogin)}
          className={`text-blue-500 ${
            colorScheme === "dark" ? "text-white" : "text-black"
          }`}
        >
          {isLogin
            ? "Don't have an account? Sign up"
            : "Already have an account? Login"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
