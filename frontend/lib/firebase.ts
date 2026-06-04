// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgW9-2WKLS7jUrU2kG4N1hYIXG0jhlk78",
  authDomain: "agent-ai-fd414.firebaseapp.com",
  projectId: "agent-ai-fd414",
  storageBucket: "agent-ai-fd414.firebasestorage.app",
  messagingSenderId: "937510287770",
  appId: "1:937510287770:web:f03affe4120accdeaf6223",
  measurementId: "G-9NG2FY3VNY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
