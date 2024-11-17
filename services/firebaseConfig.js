import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";
import {
  getAuth,
  initializeAuth,
  browserSessionPersistence,
} from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage } from "firebase/storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_DATABASE_URL,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

const auth =
  Platform.OS === "web"
    ? (() => {
        const authInstance = getAuth(app);
        authInstance.setPersistence(browserSessionPersistence);
        return authInstance;
      })()
    : initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });

const storage = getStorage(app);
const database = getDatabase(app);

export { auth, app, storage, database };
