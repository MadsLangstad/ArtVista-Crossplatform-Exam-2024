import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import {
  fetchArtworkById,
  voteArtwork,
  addComment,
} from "@/services/firebaseService";
import { ArtworkDetails, Comment } from "@/types/galleryTypes";
import { onSnapshot, doc } from "firebase/firestore";
import { firestore } from "@/services/firebaseService";

export default function Detail() {
  const router = useRouter();
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

  // Firestore snapshot for real-time updates
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

        console.log("Vote updated in Firestore:", type);
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

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-black">
        <Text className="text-black dark:text-white">Loading...</Text>
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
    <ScrollView className="flex-1 bg-white dark:bg-black p-4">
      <View className="items-center mb-4 bg-white dark:bg-black">
        <Image
          source={{ uri: artworkDetails.imageUrl }}
          className="w-full h-80 rounded-lg"
          resizeMode="cover"
        />
      </View>

      <Text className="text-black dark:text-white text-3xl font-bold mb-2">
        {artworkDetails.title}
      </Text>
      <Text className="text-gray-800 dark:text-gray-400 text-lg mb-4">
        By {artworkDetails.artist} ({artworkDetails.year})
      </Text>
      <Text className="text-black dark:text-white text-base mb-6">
        {artworkDetails.description}
      </Text>

      <View className="flex flex-row justify-around mb-4">
        <View className="items-center">
          <Button title="Upvote" onPress={() => handleVote("upvote")} />
          <Text className="text-green-600 mt-2">👍 {upvotes}</Text>
        </View>
        <View className="items-center">
          <Button title="Downvote" onPress={() => handleVote("downvote")} />
          <Text className="text-red-600 mt-2">👎 {downvotes}</Text>
        </View>
      </View>

      <Text className="text-black dark:text-white text-xl font-bold mb-2">
        Comments
      </Text>

      <ScrollView className="mb-4">
        {comments.map((comment, index) => (
          <Text key={index} className="text-gray-800 dark:text-gray-400 mb-2">
            {comment.text}
          </Text>
        ))}
      </ScrollView>

      <TextInput
        value={commentText}
        onChangeText={setCommentText}
        placeholder="Write a comment..."
        placeholderTextColor="#888"
        className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white p-3 rounded-lg mb-4"
      />
      <TouchableOpacity
        onPress={handleAddComment}
        className="bg-blue-500 p-3 rounded-lg"
      >
        <Text className="text-white text-center">Add Comment</Text>
      </TouchableOpacity>

      <Button title="Go Back" onPress={() => router.back()} color="#00BFFF" />
    </ScrollView>
  );
}
