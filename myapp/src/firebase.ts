import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDucwtS7LOSb6KjHc-TIxjJiLZBnGsCZ94",
  authDomain: "hairhunt-4cb41.firebaseapp.com",
  projectId: "hairhunt-4cb41",
  storageBucket: "hairhunt-4cb41.appspot.com",
  messagingSenderId: "512133398130",
  appId: "1:512133398130:web:99a082b78fde71ffe20ceb",
  measurementId: "G-LF70RRRKKX",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
