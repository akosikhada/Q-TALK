import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDHZ1zcFb71tm5OtkNJOmPARrCQIry4kAE",
  authDomain: "q-talk-3cf63.firebaseapp.com",
  databaseURL: "https://q-talk-3cf63-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "q-talk-3cf63",
  storageBucket: "q-talk-3cf63.firebasestorage.app",
  messagingSenderId: "243098645657",
  appId: "1:243098645657:web:6ab8ef4e1866550182f408"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db, ref, get, onAuthStateChanged, signOut, signInWithEmailAndPassword, getAuth };
