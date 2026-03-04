import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyAovbDbmf5JB5PIMuBcgQ7NQ_EemKpcGRk",
  authDomain: "house-marrketplace.firebaseapp.com",
  projectId: "house-marrketplace",
  storageBucket: "house-marrketplace.firebasestorage.app",
  messagingSenderId: "599894964976",
  appId: "1:599894964976:web:f4adff980d98eab08ba035",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
