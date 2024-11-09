import React, { useState, useCallback } from "react";
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
  const [isEditing, setIsEditing] = useState(false);
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
  }) => {
    return (
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20
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

  return (
    <View className="flex-1">
      <Text className="text-black dark:text-white text-xl font-bold mb-2">
        Comments
      </Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 mb-2"
        onScrollEndDrag={onScrollEnd} // Trigger when scroll ends
        scrollEventThrottle={400} // Reduce frequency of events for better performance
      >
        {comments.map((comment) => (
          <View
            key={comment.id}
            className="mb-4 flex-row items-start px-2 rounded-lg border-b-2 border-[#E91E63]"
          >
            {comment.userId === user?.uid && (
              <View className="flex-col items-center mr-2">
                <TouchableOpacity
                  onPress={() => {
                    setEditingComment(comment.id);
                    setEditingText(comment.text);
                  }}
                  style={{ marginRight: 8 }}
                >
                  <Icon name="pencil" size={18} color="#4CAF50" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(comment.id, comment.artworkId)}
                  style={{ marginRight: 8 }}
                >
                  <Icon name="close-circle" size={18} color="#f44336" />
                </TouchableOpacity>
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text className="font-bold text-gray-900 dark:text-gray-300 mb-1">
                {comment.author}:
              </Text>
              {editingComment === comment.id ? (
                <TextInput
                  value={editingText}
                  onChangeText={setEditingText}
                  placeholder="Edit your comment..."
                  className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white p-2 rounded-lg mb-1"
                />
              ) : (
                <Text className="text-gray-800 dark:text-gray-400 mb-1">
                  {comment.text}
                </Text>
              )}
              {editingComment === comment.id && (
                <View className="flex-row mt-2">
                  <TouchableOpacity
                    onPress={() => handleEdit(comment.id, comment.artworkId)}
                    className="bg-green-600 p-2 rounded-lg"
                  >
                    <Text className="text-white">Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setEditingComment(null);
                      setEditingText("");
                    }}
                    className="bg-gray-600 p-2 rounded-lg ml-2"
                  >
                    <Text className="text-white">Cancel</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        ))}
        {isLoadingMore && <ActivityIndicator size="small" color="#E91E63" />}
      </ScrollView>
      <View className="absolute bottom-0 left-0 right-0 bg-white dark:bg-black p-4 border-t border-gray-200 dark:border-gray-800">
        <TextInput
          value={commentText}
          onChangeText={setCommentText}
          placeholder="Write a comment..."
          placeholderTextColor="#888"
          className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white p-3 rounded-lg mb-2"
        />
        <TouchableOpacity
          onPress={handleAddComment}
          className="bg-blue-700 p-3 rounded-lg"
        >
          <Text className="text-white text-center">Add Comment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CommentSection;
