/**
 * Firebase Client & Cloud Firestore Configuration
 * Configured for project: nefra-creators-x
 */
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBqECg338_YVo1KHGeT1iAvuqfbCMj8ScQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "nefra-creators-x.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "nefra-creators-x",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "nefra-creators-x.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "194521973902",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:194521973902:web:20aa32af9f94ce240bb5df",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-ZWY7QLDQWS"
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;
