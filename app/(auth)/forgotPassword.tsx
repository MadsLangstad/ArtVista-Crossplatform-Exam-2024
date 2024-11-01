import { Button, Text, TextInput, View } from "react-native";

export default function ForgotPassword() {
  return (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-2xl font-bold mb-4">Forgot Password</Text>
      <TextInput
        className="border p-2 mb-4 w-full"
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button title="Reset Password" onPress={() => {}} />
    </View>
  );
}
