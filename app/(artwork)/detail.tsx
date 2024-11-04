import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { firestore } from "@/services/firebaseService";
import { onSnapshot, doc } from "firebase/firestore";
import { voteArtwork, addComment } from "@/services/firebaseService";
import { ArtworkDetails, Comment } from "@/types/galleryTypes";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import CommentSection from "@/components/CommentSection";

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
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);

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
            console.log("Document does not exist!");
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
        await addComment(Array.isArray(id) ? id[0] : id, commentText, user.uid);
        setComments([
          ...comments,
          {
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

  if (!user) return null;

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-black">
        <ActivityIndicator size="large" color="#00BFFF" />
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

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <View className="flex-1 p-4">
        <View className="relative w-full h-80 mb-4 bg-white dark:bg-black">
          {imageLoading && (
            <View className="center-loader">
              <ActivityIndicator size="large" color="#00E0FF" />
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
        />
      </View>
    </View>
  );
}
