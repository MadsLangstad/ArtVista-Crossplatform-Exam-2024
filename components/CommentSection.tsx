import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Comment, CommentSectionProps } from "@/types/galleryTypes";

const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  commentText,
  setCommentText,
  handleAddComment,
}) => {
  return (
    <View className="flex-1">
      <Text className="text-black dark:text-white text-xl font-bold mb-2">
        Comments
      </Text>
      <ScrollView className="flex-1 mb-2">
        {comments.map((comment, index) => (
          <Text key={index} className="text-gray-800 dark:text-gray-400 mb-2">
            {/* Maybe add the user here */} {comment.text}
          </Text>
        ))}
      </ScrollView>
      <View className="absolute bottom-4 left-0 right-0 bg-white dark:bg-black mb-4">
        <TextInput
          value={commentText}
          onChangeText={setCommentText}
          placeholder="Write a comment..."
          placeholderTextColor="#888"
          className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white p-3 rounded-lg mb-2"
        />
        <TouchableOpacity
          onPress={handleAddComment}
          className="bg-blue-500 p-3 rounded-lg"
        >
          <Text className="text-white text-center">Add Comment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CommentSection;
