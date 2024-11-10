export interface ButtonProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onSignup: () => void;
  loading: boolean; // Add loading prop
}
