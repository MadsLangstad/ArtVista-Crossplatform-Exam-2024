import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ButtonProps } from "../types/commonTypes";

const CustomButton: React.FC<ButtonProps> = ({
  isLoggedIn,
  onLogin,
  onSignup,
}) => {
  const handleClick = () => {
    if (isLoggedIn) {
      onLogin();
    } else {
      onSignup();
    }
  };

  return (
    <View className="border-2 dark:border-blue-500 rounded-md py-1 px-2">
      <TouchableOpacity onPress={handleClick}>
        <Text className="dark:text-white text-black text-lg">
          {isLoggedIn ? "Login" : "Signup"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomButton;
