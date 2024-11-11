import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { fetchComments, firestore } from "@/services/firebaseService";
import {
  onSnapshot,
  doc,
  DocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { voteArtwork, addComment } from "@/services/firebaseService";
import { ArtworkDetails, Comment } from "@/types/galleryTypes";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import CommentSection from "@/components/CommentSection";
import { router } from "expo-router";

export default function Detail() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [artworkDetails, setArtworkDetails] = useState<ArtworkDetails | null>(
    null
  );
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [lastComment, setLastComment] =
    useState<DocumentSnapshot<DocumentData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchInitialComments = async () => {
        try {
          const { comments: fetchedComments, lastVisible } =
            await fetchComments(Array.isArray(id) ? id[0] : id);
          setComments(fetchedComments);
          setLastComment(lastVisible);
        } catch (error) {
          console.error("Error loading initial comments:", error);
        }
      };
      fetchInitialComments();
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      const docRef = doc(firestore, "artworks", Array.isArray(id) ? id[0] : id);
      const unsubscribe = onSnapshot(
        docRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as ArtworkDetails;
            setArtworkDetails(data);
            setUpvotes(data.upvote || 0);
            setDownvotes(data.downvote || 0);
            setLoading(false);
          } else {
            setLoading(false);
          }
        },
        (error) => {
          console.error("Error fetching document:", error);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleVote = async (type: "upvote" | "downvote") => {
    if (id) {
      try {
        await voteArtwork(Array.isArray(id) ? id[0] : id, type);
      } catch (error) {
        console.error("Error voting on artwork:", error);
      }
    }
  };

  const handleAddComment = async () => {
    if (id && commentText.trim() && user) {
      try {
        const commentId = await addComment(
          Array.isArray(id) ? id[0] : id,
          commentText,
          user.uid
        );
        setComments([
          ...comments,
          {
            id: commentId,
            text: commentText,
            userId: user.uid,
            author: user.displayName || "Anonymous User",
            artworkId: Array.isArray(id) ? id[0] : id,
            timestamp: new Date().toISOString(),
          },
        ]);
        setCommentText("");
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  // Render the "Access Denied" screen if the user is not authenticated
  if (!user) {
    return (
      <View className="flex-1 justify-between items-center px-4 bg-white dark:bg-black">
        <Image
          source={require("@/assets/images/access-denied.png")}
          className="w-80 h-80"
          resizeMode="contain"
        />
        <Text className="text-white text-center text-lg">
          Only logged-in users have access to the artwork details. Please log in
          to continue.
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(auth)/auth")}
          className="flex justify-center items-center bg-blue-700 w-32 rounded-lg py-2 px-4 shadow-lg mb-40"
        >
          <Text className="text-white text-xl font-semibold">Log In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-black">
        <ActivityIndicator size="large" color="#E91E63" />
      </View>
    );
  }

  if (!artworkDetails) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-black">
        <Text className="text-black dark:text-white">
          Artwork details not found.
        </Text>
      </View>
    );
  }

  function fetchMoreComments(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <View className="flex-1 p-4">
        <View className="relative w-full h-80 mb-4 bg-white dark:bg-black">
          {imageLoading && (
            <View className="center-loader">
              <ActivityIndicator size="large" color="#E91E63" />
            </View>
          )}
          <Image
            source={{ uri: artworkDetails.imageUrl }}
            className="w-full h-full rounded-lg"
            resizeMode="cover"
            onLoad={() => setImageLoading(false)}
          />
        </View>

        <Text className="text-black dark:text-white text-3xl font-bold mb-4">
          {artworkDetails.title}
        </Text>
        <Text className="text-gray-800 dark:text-gray-400 text-lg mb-4">
          By {artworkDetails.artist} ({artworkDetails.year})
        </Text>
        <Text className="text-black dark:text-white text-base mb-4">
          {artworkDetails.description}
        </Text>

        <View className="flex flex-row justify-start gap-4 mr-4 mb-4">
          <View className="items-center">
            <TouchableOpacity onPress={() => handleVote("upvote")}>
              <Text className="text-green-600 text-2xl">👍🏻</Text>
            </TouchableOpacity>
            <Text className="text-green-600 text-lg mt-1">{upvotes}</Text>
          </View>
          <View className="items-center">
            <TouchableOpacity onPress={() => handleVote("downvote")}>
              <Text className="text-red-600 text-2xl">👎🏻</Text>
            </TouchableOpacity>
            <Text className="text-red-600 text-lg mt-1">{downvotes}</Text>
          </View>
        </View>

        <CommentSection
          comments={comments}
          commentText={commentText}
          setCommentText={setCommentText}
          handleAddComment={handleAddComment}
          setComments={setComments}
          fetchMoreComments={fetchMoreComments}
        />
      </View>
    </View>
  );
}
