import React from "react";
import { View, ActivityIndicator } from "react-native";

import { useAuth } from "@/contexts/AuthContext";

import AccessDenied from "@/components/AccessDenied";

type Props = {
  children: React.ReactNode;
};

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-black">
        <ActivityIndicator size="large" color="#E91E63" />
      </View>
    );
  }

  if (!user) {
    return <AccessDenied />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
