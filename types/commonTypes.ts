import { GestureResponderEvent, TextStyle, ViewStyle } from "react-native";

export interface ButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  title?: string;
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children?: React.ReactNode;
}
