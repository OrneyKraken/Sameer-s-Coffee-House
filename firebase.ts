
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

const isPlaceholder = (key: string | undefined) => 
  !key || key.includes("PLACEHOLDER") || key === "AIzaSy-PLACEHOLDER";

// Use the credentials provided in the latest project update
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyCAVwDzW70kCVabDiI8D1Ykhxe6P-VhYew",
  authDomain: "sameer-s-coffee-shop.firebaseapp.com",
  projectId: "sameer-s-coffee-shop",
  storageBucket: "sameer-s-coffee-shop.firebasestorage.app",
  messagingSenderId: "932982891616",
  appId: "1:932982891616:web:225d86a4e067f560f0cf05",
  measurementId: "G-7RRFZTH8P2"
};

// Check if we are using the real credentials or the initial placeholder
export const isCloudEnabled = !isPlaceholder(firebaseConfig.apiKey);

let dbInstance: Firestore | null = null;

if (isCloudEnabled) {
  try {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    dbInstance = getFirestore(app);
  } catch (error) {
    console.warn("Firebase initialization failed:", error);
  }
}

export const db = dbInstance;
