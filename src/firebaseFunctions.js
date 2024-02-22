import { db, storage } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth } from "./firebase";

// Function to add a forum post to the database
export const addForumPost = async (userId, postData) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { uid, email } = user;
    const postsCollection = collection(db, "forumPosts");

    // Upload images to Firebase Storage and get their download URLs
    const imageUrls = [];
    for (const imageFile of postData.images) {
      const storageRef = ref(
        storage,
        `forumImages/${userId}/${imageFile.name}`
      );

      // Upload the image file as bytes
      await uploadBytes(storageRef, imageFile);

      // Get the download URL of the uploaded image
      const imageUrl = await getDownloadURL(storageRef);
      imageUrls.push(imageUrl);
    }

    // Create a new post document
    const newPostRef = await addDoc(postsCollection, {
      userId: uid,
      userEmailDomain: email.split('@')[1],
      forumTitle: postData.forumTitle,
      description: postData.description,
      images: imageUrls,
      tags: postData.tags,
      createdAt: serverTimestamp(),
      commentsCount: 0, // Initialize comment count as 0
    });

    return newPostRef.id;
  } catch (error) {
    throw error;
  }
};

// Function to add an event to the database
export const addEvent = async (eventData) => {
  try {
    const eventsCollection = collection(db, "events");

    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { email } = user;

    // Upload thumbnail to Firebase Storage and get its download URL
    const thumbnailStorageRef = ref(
      storage,
      `eventImages/${eventData.thumbnail.name}`
    );

    // Upload the thumbnail image file as bytes
    await uploadBytes(thumbnailStorageRef, eventData.thumbnail);

    // Get the download URL of the uploaded thumbnail image
    const thumbnailUrl = await getDownloadURL(thumbnailStorageRef);

    // Upload other images to Firebase Storage and get their download URLs
    const imageUrls = [];
    for (const imageFile of eventData.images) {
      const storageRef = ref(storage, `eventImages/${imageFile.name}`);

      // Upload the image file as bytes
      await uploadBytes(storageRef, imageFile);

      // Get the download URL of the uploaded image
      const imageUrl = await getDownloadURL(storageRef);
      imageUrls.push(imageUrl);
    }

    // Create a new event document
    const newEventRef = await addDoc(eventsCollection, {
      title: eventData.title,
      description: eventData.description,
      date: eventData.date,
      time: eventData.time,
      location: eventData.location,
      price: eventData.price,
      thumbnail: thumbnailUrl,
      images: imageUrls,
      createdAt: serverTimestamp(),
      uid: eventData.uid,
      userEmailDomain: email.split('@')[1],
      type: eventData.type,
    });

    return newEventRef.id;
  } catch (error) {
    throw error;
  }
};
