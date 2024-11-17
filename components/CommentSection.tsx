import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Comment, CommentSectionProps } from "@/types/galleryTypes";
import { useAuth } from "@/hooks/useAuth";
import { deleteComment, editComment } from "@/services/firebaseService";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Button from "./Button";

const CommentSection: React.FC<
  CommentSectionProps & { fetchMoreComments: () => Promise<void> }
> = ({
  comments,
  commentText,
  setCommentText,
  handleAddComment,
  setComments,
  fetchMoreComments,
}) => {
  const { user } = useAuth();
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleDelete = async (commentId: string, artworkId: string) => {
    Alert.alert(
      "Delete Comment",
      "Are you sure you want to delete this comment?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteComment(artworkId, commentId);
              setComments((prevComments) =>
                prevComments.filter((c) => c.id !== commentId)
              );
            } catch (error) {
              console.error("Error deleting comment:", error);
            }
          },
        },
      ]
    );
  };

  const handleEdit = async (id: string, artworkId: string) => {
    try {
      await editComment(artworkId, id, editingText);
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === id ? { ...comment, text: editingText } : comment
        )
      );
      setEditingComment(null);
      setEditingText("");
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const onScrollEnd = async ({ nativeEvent }: { nativeEvent: any }) => {
    if (isCloseToBottom(nativeEvent)) {
      setIsLoadingMore(true);
      await fetchMoreComments();
      setIsLoadingMore(false);
    }
  };

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: {
    layoutMeasurement: { height: number };
    contentOffset: { y: number };
    contentSize: { height: number };
  }) => layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

  return (
    <View className="flex-1 relative">
      <Text className="text-black dark:text-white text-xl font-bold mb-2">
        Comments
      </Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 mb-2"
        onScrollEndDrag={onScrollEnd}
        scrollEventThrottle={400}
      >
        {comments.map((comment) => (
          <View
            key={comment.id}
            className="mb-4 flex-row items-start px-2 rounded-lg border-b-2 border-pink-500"
          >
            {comment.userId === user?.uid && (
              <CommentActions
                comment={comment}
                setEditingComment={setEditingComment}
                setEditingText={setEditingText}
                handleDelete={handleDelete}
              />
            )}
            <View className="flex-1">
              <Text className="font-bold text-gray-900 dark:text-gray-300 mb-1">
                {comment.author}
              </Text>
              {editingComment === comment.id ? (
                <EditCommentInput
                  editingText={editingText}
                  setEditingText={setEditingText}
                  handleEdit={() => handleEdit(comment.id, comment.artworkId)}
                  cancelEdit={() => {
                    setEditingComment(null);
                    setEditingText("");
                  }}
                />
              ) : (
                <Text className="text-gray-800 dark:text-gray-400 mb-1">
                  {comment.text}
                </Text>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
      {isLoadingMore && (
        <View
          className="absolute inset-x-0 bottom-44 items-center"
          style={{ zIndex: 10 }}
        >
          <ActivityIndicator size="small" color="#E91E63" />
        </View>
      )}
      <CommentInput
        commentText={commentText}
        setCommentText={setCommentText}
        handleAddComment={handleAddComment}
      />
    </View>
  );
};

const CommentActions = ({
  comment,
  setEditingComment,
  setEditingText,
  handleDelete,
}: {
  comment: Comment;
  setEditingComment: (id: string | null) => void;
  setEditingText: (text: string) => void;
  handleDelete: (commentId: string, artworkId: string) => void;
}) => (
  <View className="flex-col items-center mr-2">
    <Button
      onPress={() => {
        setEditingComment(comment.id);
        setEditingText(comment.text);
      }}
      style={{
        backgroundColor: "transparent",
        padding: 0,
        marginRight: 8,
      }}
    >
      <Icon name="pencil" size={18} color="#4CAF50" />
    </Button>
    <Button
      onPress={() => handleDelete(comment.id, comment.artworkId)}
      style={{
        backgroundColor: "transparent", // No background
        padding: 0, // Remove padding
        marginRight: 8, // Add margin
      }}
    >
      <Icon name="close-circle" size={18} color="#f44336" />
    </Button>
  </View>
);

const EditCommentInput = ({
  editingText,
  setEditingText,
  handleEdit,
  cancelEdit,
}: {
  editingText: string;
  setEditingText: (text: string) => void;
  handleEdit: () => void;
  cancelEdit: () => void;
}) => (
  <View>
    <TextInput
      value={editingText}
      onChangeText={setEditingText}
      placeholder="Edit your comment..."
      className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white p-2 rounded-lg mb-1"
    />
    <View className="flex-row mt-2">
      <Button
        onPress={handleEdit}
        style={{
          backgroundColor: "green",
          padding: 8,
          borderRadius: 8,
        }}
        textStyle={{
          color: "white",
        }}
      >
        <Text style={{ color: "white" }}>Save</Text>
      </Button>
      <Button
        onPress={cancelEdit}
        style={{
          backgroundColor: "gray",
          padding: 8,
          borderRadius: 8,
          marginLeft: 8, // Adds spacing between buttons
        }}
        textStyle={{
          color: "white",
        }}
      >
        <Text style={{ color: "white" }}>Cancel</Text>
      </Button>
    </View>
  </View>
);

const CommentInput = ({
  commentText,
  setCommentText,
  handleAddComment,
}: {
  commentText: string;
  setCommentText: (text: string) => void;
  handleAddComment: () => void;
}) => (
  <View className="absolute bottom-0 left-0 right-0 dark:bg-black py-4 dark:border-gray-800">
    <TextInput
      value={commentText}
      onChangeText={setCommentText}
      placeholder="Write a comment..."
      placeholderTextColor="#888"
      className="bg-gray-200 w-[70%] m-auto dark:bg-gray-800 text-black dark:text-white p-3 rounded-lg mb-2.5 border-2 border-[#E91E63]"
    />
    <TouchableOpacity
      onPress={handleAddComment}
      className="bg-blue-700 w-[70%] m-auto py-3 rounded-lg"
    >
      <Text className="text-white text-center">Add Comment</Text>
    </TouchableOpacity>
  </View>
);

export default CommentSection;
