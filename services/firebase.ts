
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { UserPreferences } from "../types";

// Security: Load config from environment variables
// Ensure these are set in your Vercel project settings
const getEnvVar = (key: string) => {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    // @ts-ignore
    return import.meta.env[key];
  }
  // @ts-ignore
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    // @ts-ignore
    return process.env[key];
  }
  return '';
};

const firebaseConfig = {
  apiKey: getEnvVar('VITE_FIREBASE_API_KEY'),
  authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVar('VITE_FIREBASE_APP_ID'),
  measurementId: getEnvVar('VITE_FIREBASE_MEASUREMENT_ID')
};

// Validate config
const isConfigValid = Object.values(firebaseConfig).every(v => v !== '');

if (!isConfigValid) {
  console.warn("Firebase config missing. Please set VITE_FIREBASE_... environment variables.");
}

// Initialize Firebase only if config is valid to prevent crashes
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  if (!isConfigValid) throw new Error("Firebase configuration missing.");
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

// Helper to separate guest data from auth user fallback data
const getStorageKey = (uid: string) => `bodhi_user_${uid}`;

export const saveUserProfile = async (uid: string, data: UserPreferences) => {
    if (!isConfigValid) {
        // Fallback for missing config (Guest mode mostly)
        localStorage.setItem(getStorageKey(uid), JSON.stringify(data));
        return;
    }
    try {
        await setDoc(doc(db, "users", uid), data, { merge: true });
    } catch (error: any) {
        // Fallback to localStorage if permission denied or unavailable
        if (error.code === 'permission-denied' || error.code === 'unavailable') {
            localStorage.setItem(getStorageKey(uid), JSON.stringify(data));
        } else {
            console.error("Error saving user profile", error);
            throw error;
        }
    }
};

export const getUserProfile = async (uid: string): Promise<UserPreferences | null> => {
    if (!isConfigValid) {
         const localData = localStorage.getItem(getStorageKey(uid));
         return localData ? JSON.parse(localData) : null;
    }
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data() as UserPreferences;
        }
        return null;
    } catch (error: any) {
        if (error.code === 'permission-denied' || error.code === 'unavailable') {
             const localData = localStorage.getItem(getStorageKey(uid));
             if (localData) {
                 return JSON.parse(localData);
             }
             return null;
        }
        console.error("Error fetching user profile", error);
        return null;
    }
};
