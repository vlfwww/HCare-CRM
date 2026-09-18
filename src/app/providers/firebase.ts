import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDcV7-3QMrAXavbwkHtckYfOH-88NWu0F0",
  authDomain: "hcare-8158d.firebaseapp.com",
  projectId: "hcare-8158d",
  storageBucket: "hcare-8158d.firebasestorage.app",
  messagingSenderId: "466814247455",
  appId: "1:466814247455:web:5e38d40b9cd67edf112b2a",
  measurementId: "G-SY1KPL1C2M",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
