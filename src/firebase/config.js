import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// 1. Go to https://console.firebase.google.com -> Create project
// 2. Add a Web app inside the project (</> icon) to get this config object
// 3. Enable: Authentication -> Sign-in method -> Email/Password
// 4. Enable: Firestore Database -> Create database (start in test mode for dev)
// 5. Enable: Storage -> Get started
// 6. Paste your config below.
const firebaseConfig = {
  apiKey: "AIzaSyAxVy-YA0EG9XgRrOLtdim4wQMeVyGZKaw",
  authDomain: "vyoma-b3ea9.firebaseapp.com",
  projectId: "vyoma-b3ea9",
  storageBucket: "vyoma-b3ea9.firebasestorage.app",
  messagingSenderId: "360099268683",
  appId: "1:360099268683:web:21b19ddff66e2997a765ce",
  measurementId: "G-YN63EG862T"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;