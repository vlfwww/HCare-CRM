import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ??
    "AIzaSyDcV7-3QMrAXavbwHtYfOH-88NWu0F0",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "hcare-8158d.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "hcare-8158d",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ??
    "hcare-8158d.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "466814247455",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ??
    "1:466814247455:web:5e38d40b9cd67edf112b2a",
  measurementId:
    import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? "G-SY1KPL1C2M",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
