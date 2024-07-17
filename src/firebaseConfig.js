// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD838qZFyQ3Z01s0NF0ybZiCuf5y3k-up8",
  authDomain: "repurpose-ai.firebaseapp.com",
  projectId: "repurpose-ai",
  storageBucket: "repurpose-ai.appspot.com",
  messagingSenderId: "705001969649",
  appId: "1:705001969649:web:4348a303ec28089832d650",
  measurementId: "G-F4153PT0X4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export {app, auth, analytics, db}