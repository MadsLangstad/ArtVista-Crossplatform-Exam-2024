import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "react-router-native";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Redirect to="/login" />;
  }
  return children;
}
