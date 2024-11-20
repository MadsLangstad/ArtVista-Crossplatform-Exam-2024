import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app, storage } from "./firebaseConfig";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  increment,
  query,
  limit,
  deleteDoc,
  orderBy,
  startAfter,
  DocumentSnapshot,
  endBefore,
} from "firebase/firestore";
import {
  ArtworkDetails,
  ArtworkItemProps,
  Comment,
} from "@/types/galleryTypes";

export const firestore = getFirestore(app);

// Fetches Artworks from Firestore
export const fetchArtworks = async (
  referenceDoc: DocumentSnapshot | null = null,
  loadOlderItems: boolean = false,
  pageSize: number = 10
): Promise<{
  artworks: ArtworkItemProps[];
  firstVisible: DocumentSnapshot | null;
  lastVisible: DocumentSnapshot | null;
}> => {
  try {
    let artworksQuery = query(
      collection(firestore, "artworks"),
      orderBy("uploadDate", "desc"),
      limit(pageSize)
    );

    if (referenceDoc) {
      artworksQuery = loadOlderItems
        ? query(artworksQuery, startAfter(referenceDoc))
        : query(artworksQuery, endBefore(referenceDoc));
    }

    const artworkSnapshots = await getDocs(artworksQuery);
    const artworks = artworkSnapshots.docs.map((doc) => ({
      ...(doc.data() as ArtworkItemProps),
      id: doc.id,
    }));

    if (artworkSnapshots.empty) {
      return { artworks: [], firstVisible: null, lastVisible: null };
    }

    const firstVisible = artworkSnapshots.docs[0] || null;
    const lastVisible =
      artworkSnapshots.docs[artworkSnapshots.docs.length - 1] || null;

    return { artworks, firstVisible, lastVisible };
  } catch (error) {
    console.error("Error fetching artworks:", error);
    throw new Error("Failed to fetch artworks. Please try again.");
  }
};

// Fetch Artwork by ID with Comments from Firestore (for Details Page) - Async Function
export const fetchArtworkById = async (id: string) => {
  try {
    const docRef = doc(firestore, "artworks", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) throw new Error("Artwork not found");

    const artwork = docSnap.data() as ArtworkDetails;
    const commentsSnapshot = await getDocs(
      collection(firestore, `artworks/${id}/comments`)
    );
    const comments: Comment[] = commentsSnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          artworkId: id,
          userId: doc.data().userId,
          author: doc.data().author,
          text: doc.data().text,
          timestamp: doc.data().timestamp,
        } as Comment)
    );

    return { artwork, comments };
  } catch (error) {
    throw new Error("Failed to fetch artwork. Please try again.");
  }
};

// Upload Artwork Image to Firebase Storage
export const uploadArtworkImage = async (file: Blob, fileName: string) => {
  try {
    const storageRef = ref(storage, `artwork-images/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error(
            `Upload failed. Code: ${error.code}, Message: ${error.message}`
          );
          reject(new Error(`Failed to upload image: ${error.message}`));
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("Upload successful, file available at:", downloadURL);
          resolve(downloadURL);
        }
      );
    });
  } catch (error) {
    console.error("Error initializing upload:", error);
    throw new Error("Failed to upload image. Please try again.");
  }
};

// Vote on Artwork (Upvote/Downvote)
export const voteArtwork = async (
  artworkId: string,
  voteType: "upvote" | "downvote"
) => {
  try {
    const docRef = doc(firestore, "artworks", artworkId);
    await updateDoc(docRef, {
      [voteType]: increment(1),
    });
    console.log(`Vote updated in Firestore: ${voteType}`);
  } catch (error) {
    console.error("Error voting on artwork in Firestore:", error);
    throw new Error("Failed to vote on artwork. Please try again.");
  }
};

// Add Artwork Details to Firestore
export const addArtworkDetails = async (artworkDetails: ArtworkDetails) => {
  try {
    const docRef = await addDoc(collection(firestore, "artworks"), {
      ...artworkDetails,
      upvotes: 0,
      downvotes: 0,
      commentsCount: 0,
    });
    return docRef.id;
  } catch (error) {
    throw new Error("Failed to add artwork details. Please try again.");
  }
};

// Fetch Comments for Artwork
export const fetchComments = async (
  artworkId: string,
  lastComment?: DocumentSnapshot,
  pageSize: number = 10
): Promise<{ comments: Comment[]; lastVisible: DocumentSnapshot | null }> => {
  console.log("Fetching comments for artworkId:", artworkId);
  const commentsRef = collection(firestore, `artworks/${artworkId}/comments`);

  let commentsQuery = query(
    commentsRef,
    orderBy("timestamp", "desc"),
    limit(pageSize)
  );
  if (lastComment) {
    commentsQuery = query(
      commentsRef,
      orderBy("timestamp", "desc"),
      startAfter(lastComment),
      limit(pageSize)
    );
  }

  try {
    const commentSnapshots = await getDocs(commentsQuery);
    const comments: Comment[] = commentSnapshots.docs.map(
      (doc) =>
        ({
          id: doc.id,
          artworkId,
          ...doc.data(),
          author: doc.data()?.author || "Anonymous",
        } as Comment)
    );

    const lastVisible =
      commentSnapshots.docs[commentSnapshots.docs.length - 1] || null;

    console.log("Fetched comments:", comments);
    console.log("Last visible document:", lastVisible);
    return { comments, lastVisible };
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw new Error("Failed to fetch comments. Please try again.");
  }
};

// Add Comment to Artwork
export const addComment = async (
  artworkId: string,
  text: string,
  userId: string
): Promise<string> => {
  try {
    const userDoc = await getDoc(doc(firestore, "users", userId));
    if (!userDoc.exists()) {
      throw new Error("User profile not found.");
    }

    const author = userDoc.data()?.username || "Anonymous";

    const comment = {
      text,
      timestamp: new Date().toISOString(),
      userId,
      author,
    };

    const docRef = await addDoc(
      collection(firestore, `artworks/${artworkId}/comments`),
      comment
    );

    const artworkRef = doc(firestore, "artworks", artworkId);
    await updateDoc(artworkRef, {
      commentsCount: increment(1),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw new Error("Failed to add comment. Please try again.");
  }
};

// Edit Comment
export const editComment = async (
  artworkId: string,
  commentId: string,
  newText: string
) => {
  try {
    const commentRef = doc(
      firestore,
      `artworks/${artworkId}/comments`,
      commentId
    );
    await updateDoc(commentRef, {
      text: newText,
      editedAt: new Date().toISOString(),
    });
    console.log("Comment updated successfully");
  } catch (error) {
    console.error("Error updating comment:", error);
    throw new Error("Failed to update comment. Please try again.");
  }
};

// Delete Comment from Artwork
export const deleteComment = async (artworkId: string, commentId: string) => {
  try {
    const commentRef = doc(
      firestore,
      `artworks/${artworkId}/comments`,
      commentId
    );

    await deleteDoc(commentRef);

    const artworkRef = doc(firestore, "artworks", artworkId);
    await updateDoc(artworkRef, {
      commentsCount: increment(-1),
    });

    console.log("Comment deleted and commentsCount decremented successfully");
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw new Error("Failed to delete comment. Please try again.");
  }
};

// Sample data for Firestore collections
const sampleArtwork = {
  title: "Starry Night",
  description: "An iconic painting by Vincent van Gogh.",
  imageUrl:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1200px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
  artist: "Vincent van Gogh",
  year: 1889,
  hashtags: ["impressionism", "van-gogh", "starry-night"],
  artistId: "artistUserId123",
  uploadDate: new Date().toISOString(),
  exhibitionInfo: {
    location: "Museum of Modern Art",
    date: new Date().toISOString(),
  },
  upvotes: 0,
  downvotes: 0,
  commentsCount: 0,
};

const sampleUser = {
  name: "Vincent van Gogh",
  email: "vincent@example.com",
  profilePicture:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeeV2u9NP1C-xWVMoDSsxAWkXn6_SOxShGXqWahHGDNG8qgDhP",
  bio: "A Dutch post-impressionist painter.",
  isArtist: true,
  socialLinks: {
    instagram: "https://instagram.com/vincentvangogh",
    website: "https://vangogh.com",
  },
};

const sampleComment = {
  artworkId: "artworkId123",
  userId: "userId123",
  text: "This is a beautiful piece of art!",
  timestamp: new Date().toISOString(),
  author: "Elon Musk",
};

const sampleVote = {
  artworkId: "artworkId123",
  userId: "userId123",
  voteType: "upvote",
  timestamp: new Date().toISOString(),
};

// Initialize Firestore Data
export async function initializeFirestoreData() {
  try {
    const artworksCollection = collection(firestore, "artworks");
    const artworksQuery = query(artworksCollection, limit(1));
    const artworksSnapshot = await getDocs(artworksQuery);

    if (!artworksSnapshot.empty) {
      console.log("Firestore data already initialized. Skipping setup.");
      return;
    }

    const artworkDocRef = await addDoc(artworksCollection, sampleArtwork);

    const usersCollection = collection(firestore, "users");
    await addDoc(usersCollection, sampleUser);

    const commentsCollection = collection(
      firestore,
      `artworks/${artworkDocRef.id}/comments`
    );
    await addDoc(commentsCollection, sampleComment);

    const votesCollection = collection(firestore, "votes");
    await addDoc(votesCollection, sampleVote);

    console.log("Firestore collections initialized with sample data.");
  } catch (error) {
    console.error("Error initializing Firestore data:", error);
  }
}
