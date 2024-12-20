export interface ArtworkItemProps {
  id: string;
  title: string;
  imageUrl: string;
  likes: number;
  commentsCount: number;
  description: string;
  abstract: string;
  upvote: number;
  downvote: number;
}

export interface ArtworkItemComponentProps {
  item: ArtworkItemProps;
  handlePress: (item: ArtworkItemProps) => void;
  searchQuery: string;
}

export interface ArtworkDetails {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  artist: string;
  year: number;
  hashtags: Array<string>;
  artistId: string;
  uploadDate: string;
  exhibitionInfo: {
    location: string;
    date: string;
  };
  upvote: number;
  downvote: number;
}

export interface UserProfile {
  name: string;
  email: string;
  profilePicture: string;
  bio: string;
  isArtist: boolean;
  socialLinks: {
    instagram: string;
    website: string;
  };
}

export interface Comment {
  id: string;
  artworkId: string;
  author: string;
  userId: string;
  text: string;
  timestamp: string;
}

export interface CommentSectionProps {
  comments: Comment[];
  commentText: string;
  setCommentText: (text: string) => void;
  handleAddComment: () => void;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}

export interface Vote {
  artworkId: string;
  userId: string;
  voteType: "upvote" | "downvote";
  timestamp: string;
}
