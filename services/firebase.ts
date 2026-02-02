import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { UserPreferences } from "../types";

// Configuration from environment variables or placeholders
const firebaseConfig = {
  apiKey: "AIzaSyDVwA7P8cGAkdMw7VrCI4ZHVJ2OAxEuzcs",
  authDomain: "bodhipath-2d6ad.firebaseapp.com",
  projectId: "bodhipath-2d6ad",
  storageBucket: "bodhipath-2d6ad.firebasestorage.app",
  messagingSenderId: "1069054638776",
  appId: "1:1069054638776:web:efc5eda96c50406c5c924d",
  measurementId: "G-RRYL822MC2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
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
    try {
        await setDoc(doc(db, "users", uid), data, { merge: true });
    } catch (error: any) {
        // Fallback to localStorage if permission denied (Firestore rules) or unavailable
        if (error.code === 'permission-denied' || error.code === 'unavailable') {
            console.warn("Firestore permission denied. Falling back to local storage for user profile.");
            localStorage.setItem(getStorageKey(uid), JSON.stringify(data));
        } else {
            console.error("Error saving user profile", error);
            throw error;
        }
    }
};

export const getUserProfile = async (uid: string): Promise<UserPreferences | null> => {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data() as UserPreferences;
        }
        return null;
    } catch (error: any) {
        // Fallback to localStorage if permission denied
        if (error.code === 'permission-denied' || error.code === 'unavailable') {
             console.warn("Firestore permission denied. Checking local storage fallback.");
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