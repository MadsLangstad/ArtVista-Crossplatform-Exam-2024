import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  increment,
  onSnapshot,
  query,
  limit,
} from "firebase/firestore";
import { app } from "./firebaseConfig";
import { ArtworkDetails, Comment } from "@/types/galleryTypes";

const storage = getStorage(app);
export const firestore = getFirestore(app);

export const uploadArtworkImage = async (file: Blob, fileName: string) => {
  try {
    const storageRef = ref(storage, `artwork-images/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        null,
        (error) =>
          reject(new Error("Failed to upload image. Please try again.")),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  } catch (error) {
    throw new Error("Failed to upload image. Please try again.");
  }
};

export const addArtworkDetails = async (artworkDetails: ArtworkDetails) => {
  try {
    const docRef = await addDoc(collection(firestore, "artworks"), {
      ...artworkDetails,
      upvotes: 0,
      downvotes: 0,
    });
    return docRef.id;
  } catch (error) {
    throw new Error("Failed to add artwork details. Please try again.");
  }
};

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
          text: doc.data().text,
          timestamp: doc.data().timestamp,
        } as Comment)
    );

    return { artwork, comments };
  } catch (error) {
    throw new Error("Failed to fetch artwork. Please try again.");
  }
};

export const addComment = async (
  artworkId: string,
  text: string,
  userId: string
) => {
  try {
    const comment = { text, timestamp: new Date().toISOString(), userId };
    await addDoc(
      collection(firestore, `artworks/${artworkId}/comments`),
      comment
    );
  } catch (error) {
    throw new Error("Failed to add comment. Please try again.");
  }
};

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

export const fetchArtworks = async (): Promise<ArtworkDetails[]> => {
  try {
    const querySnapshot = await getDocs(collection(firestore, "artworks"));
    const artworks: ArtworkDetails[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      artworks.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        artist: data.artist,
        year: data.year,
        hashtags: data.hashtags,
        artistId: data.artistId,
        uploadDate: data.uploadDate,
        exhibitionInfo: data.exhibitionInfo,
        upvotes: data.upvotes || 0,
        downvotes: data.downvotes || 0,
        upvote: data.upvote || 0,
        downvote: data.downvote || 0,
      } as ArtworkDetails);
    });
    return artworks;
  } catch (error) {
    throw new Error("Failed to fetch artworks. Please try again.");
  }
};

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
};

const sampleVote = {
  artworkId: "artworkId123",
  userId: "userId123",
  voteType: "upvote",
  timestamp: new Date().toISOString(),
};

export async function initializeFirestoreData() {
  try {
    const artworksCollection = collection(firestore, "artworks");
    const artworksQuery = query(artworksCollection, limit(1));
    const artworksSnapshot = await getDocs(artworksQuery);

    if (!artworksSnapshot.empty) {
      console.log("Firestore data already initialized. Skipping setup.");
      return;
    }

    await addDoc(artworksCollection, sampleArtwork);

    const usersCollection = collection(firestore, "users");
    await addDoc(usersCollection, sampleUser);

    const commentsCollection = collection(firestore, "comments");
    await addDoc(commentsCollection, sampleComment);

    const votesCollection = collection(firestore, "votes");
    await addDoc(votesCollection, sampleVote);

    console.log("Firestore collections initialized with sample data.");
  } catch (error) {
    console.error("Error initializing Firestore data:", error);
  }
}
