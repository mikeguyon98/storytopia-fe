import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";
import { v4 as uuidv4 } from "uuid";

export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Generate a unique username
    const username = `user-${uuidv4().slice(0, 8)}`;

    // Add user data to Firestore
    await setDoc(doc(db, "users", user.uid), {
      username: username,
      profile_picture: '', // Default or empty value
      bio: '', // Default or empty value
      followers: [],
      following: [],
      liked_books: [],
      saved_books: [],
      public_books: [],
      private_books: [],
      createdAt: new Date().toISOString()
    });
    return user;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();
    console.log(idToken)
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    throw error;
  }
};
