import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDgW9-2WKLS7jUrU2kG4N1hYIXG0jhlk78",
  authDomain: "agent-ai-fd414.firebaseapp.com",
  projectId: "agent-ai-fd414",
  storageBucket: "agent-ai-fd414.firebasestorage.app",
  messagingSenderId: "937510287770",
  appId: "1:937510287770:web:f03affe4120accdeaf6223",
  measurementId: "G-9NG2FY3VNY"
};

// Initialize Firebase (Prevents re-initializing if the file hot-reloads during dev)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
