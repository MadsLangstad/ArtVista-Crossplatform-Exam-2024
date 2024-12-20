import React, { memo, useState, useEffect } from "react";
import {
  ActivityIndicator,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { firestore } from "@/services/firebaseService";
import {
  doc,
  updateDoc,
  increment,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { ArtworkItemComponentProps } from "@/types/galleryTypes";
import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";

const ArtworkItem = memo(({ item, handlePress }: ArtworkItemComponentProps) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(item.likes || 0);
  const [upvoteCount, setUpvoteCount] = useState(item.upvote || 0);
  const [downvoteCount, setDownvoteCount] = useState(item.downvote || 0);
  const [commentsCount, setCommentsCount] = useState(item.commentsCount || 0);

  const { user } = useAuth();

  // Fetches initial counts (likes, comments, votes) for the artwork and subscribes to real-time updates for any changes.
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const artworkRef = doc(firestore, "artworks", item.id);
        const artworkDoc = await getDoc(artworkRef);

        if (artworkDoc.exists()) {
          const data = artworkDoc.data();
          setLikesCount(data.likes || 0);
          setCommentsCount(data.commentsCount || 0);
          setUpvoteCount(data.upvote || 0);
          setDownvoteCount(data.downvote || 0);
          console.log("Artwork data fetched:", data);
        }

        if (user) {
          const userLikeRef = doc(
            firestore,
            "artworks",
            item.id,
            "likes",
            user.uid
          );
          const userLikeDoc = await getDoc(userLikeRef);
          setIsLiked(userLikeDoc.exists());
        }
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();

    const unsubscribe = onSnapshot(
      doc(firestore, "artworks", item.id),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setLikesCount(data.likes || 0);
          setCommentsCount(data.commentsCount || 0);
          setUpvoteCount(data.upvote || 0);
          setDownvoteCount(data.downvote || 0);
          console.log("Real-time artwork data fetched:", data);
        }
      }
    );

    return () => unsubscribe();
  }, [item.id, user]);

  // Toggles the like status for an artwork,
  // updating Firestore and maintaining UI state consistency.
  const toggleLike = async () => {
    if (!user) {
      Alert.alert("Authentication Required", "Please log in to like artworks.");
      return;
    }

    const artworkRef = doc(firestore, "artworks", item.id);
    const userLikeRef = doc(firestore, "artworks", item.id, "likes", user.uid);

    try {
      if (!isLiked) {
        await setDoc(userLikeRef, { liked: true });
        await updateDoc(artworkRef, { likes: increment(1) });

        const updatedArtwork = await getDoc(artworkRef);
        setLikesCount(updatedArtwork.data()?.likes || 0);
        setIsLiked(true);
      } else {
        await deleteDoc(userLikeRef);
        await updateDoc(artworkRef, { likes: increment(-1) });

        const updatedArtwork = await getDoc(artworkRef);
        setLikesCount(updatedArtwork.data()?.likes || 0);
        setIsLiked(false);
      }
    } catch (error) {
      console.error("Error updating like status:", error);
      Alert.alert("Error", "Failed to update like status. Please try again.");
    }
  };

  const handleCommentPress = () => {
    router.push(`/(artwork)/detail?id=${item.id}`);
  };

  return (
    <TouchableOpacity
      onPress={() => handlePress(item)}
      className="mb-6 rounded-lg bg-white dark:bg-slate-900 shadow-md w-full"
      style={{ elevation: 3 }}
    >
      <View className="w-full h-48 bg-gray-200 dark:bg-slate-800 rounded-sm overflow-hidden relative">
        {imageLoading && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1,
            }}
          >
            <ActivityIndicator size="large" color="#E91E63" />
          </View>
        )}
        <Image
          source={{ uri: item.imageUrl }}
          className="w-full h-full border-2 border-[#E91E63] rounded-lg"
          resizeMode="cover"
          onLoad={() => setImageLoading(false)}
          style={{ position: "absolute", width: "100%", height: "100%" }}
        />

        <View className="absolute bottom-0 rounded-b-lg inset-x-0 bg-black opacity-75 px-2 flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-lg font-bold text-white">{item.title}</Text>
            <Text
              className="text-sm font-semibold text-white mt-1"
              numberOfLines={2}
            >
              {item.description}
            </Text>
          </View>

          <View className="flex-row items-center space-x-4">
            <View>
              <MaterialCommunityIcons
                name="thumb-up"
                size={24}
                color="#007BFF"
              />
              {upvoteCount > 0 && (
                <View
                  className="absolute -top-3 right-0 bg-red-500 rounded-full flex items-center justify-center"
                  style={{
                    width: 18,
                    height: 18,
                  }}
                >
                  <Text className="text-xs text-white text-center">
                    {upvoteCount}
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity onPress={toggleLike} className="relative p-1">
              <MaterialCommunityIcons
                name={isLiked ? "heart" : "heart-outline"}
                size={24}
                color={isLiked ? "#E91E63" : "#FFFFFF"}
              />
              {likesCount > 0 && (
                <View
                  className="absolute -top-2 right-0 bg-red-500 rounded-full flex items-center justify-center"
                  style={{
                    width: 18,
                    height: 18,
                  }}
                >
                  <Text className="text-xs text-white text-center">
                    {likesCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCommentPress}
              className="relative p-1"
            >
              <MaterialCommunityIcons
                name="comment"
                size={24}
                color="#007BFF"
              />
              {commentsCount > 0 && (
                <View
                  className="absolute -top-2 right-0 bg-red-500 rounded-full flex items-center justify-center"
                  style={{
                    width: 18,
                    height: 18,
                  }}
                >
                  <Text className="text-xs text-white text-center">
                    {commentsCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default ArtworkItem;
