import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  fetchComments,
  firestore,
  voteArtwork,
  addComment,
} from "@/services/firebaseService";
import {
  onSnapshot,
  doc,
  DocumentSnapshot,
  DocumentData,
  getDoc,
  updateDoc,
  setDoc,
  increment,
} from "firebase/firestore";
import { ArtworkDetails, Comment } from "@/types/galleryTypes";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import CommentSection from "@/components/CommentSection";
import { router } from "expo-router";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Detail() {
  return (
    <ProtectedRoute>
      <DetailContent />
    </ProtectedRoute>
  );
}

function DetailContent() {
  const { id } = useLocalSearchParams();
  const { user, username } = useAuth();
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

          // Format the timestamps for each comment
          const formattedComments = fetchedComments.map((comment) => ({
            ...comment,
            timestamp: comment.timestamp || "Unknown date",
          }));

          setComments(formattedComments);
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
    if (!user || !id) return;

    const artworkId = Array.isArray(id) ? id[0] : id;
    const artworkRef = doc(firestore, "artworks", artworkId);
    const userVoteRef = doc(
      firestore,
      "artworks",
      artworkId,
      "votes",
      user.uid
    );

    try {
      // Check if the user has already voted
      const userVoteDoc = await getDoc(userVoteRef);

      if (userVoteDoc.exists()) {
        const currentVoteType = userVoteDoc.data().type;

        // If user is trying to vote the same way again, ignore it
        if (currentVoteType === type) {
          Alert.alert("You've already voted this way.");
          return;
        }

        // If user is changing their vote, adjust the counts accordingly
        if (currentVoteType === "upvote" && type === "downvote") {
          await updateDoc(artworkRef, {
            upvote: increment(-1),
            downvote: increment(1),
          });
        } else if (currentVoteType === "downvote" && type === "upvote") {
          await updateDoc(artworkRef, {
            upvote: increment(1),
            downvote: increment(-1),
          });
        }

        // Update the user's vote in the `votes` subcollection
        await setDoc(userVoteRef, { type });
      } else {
        // If the user hasn't voted before, add their vote
        await updateDoc(artworkRef, {
          [type]: increment(1),
        });

        // Store the user's vote in the `votes` subcollection
        await setDoc(userVoteRef, { type });
      }

      // Update local state to reflect the new vote count
      if (type === "upvote") {
        setUpvotes((prev) => prev + (userVoteDoc.exists() ? 0 : 1));
        if (userVoteDoc.exists()) setDownvotes((prev) => prev - 1);
      } else {
        setDownvotes((prev) => prev + (userVoteDoc.exists() ? 0 : 1));
        if (userVoteDoc.exists()) setUpvotes((prev) => prev - 1);
      }
    } catch (error) {
      console.error("Error voting on artwork:", error);
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
            author: username || "Anonymous User",
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
            <Text className="text-green-600 text-lg mt-1">
              {typeof upvotes === "number" ? upvotes : 0}
            </Text>
          </View>
          <View className="items-center">
            <TouchableOpacity onPress={() => handleVote("downvote")}>
              <Text className="text-red-600 text-2xl">👎🏻</Text>
            </TouchableOpacity>
            <Text className="text-red-600 text-lg mt-1">
              {typeof downvotes === "number" ? downvotes : 0}
            </Text>
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
