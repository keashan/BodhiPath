
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { UserPreferences } from "../types";

// Static replacement works best with direct property access.
// We use a safe fallback that works across Vite (dev) and Vercel (prod).
const env = (import.meta as any).env || {};
const proc = (typeof process !== 'undefined' ? process.env : {}) as any;

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || proc.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || proc.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID || proc.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || proc.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || proc.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID || proc.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || proc.VITE_FIREBASE_MEASUREMENT_ID
};

// Diagnostic Check
const missingKeys = Object.entries(firebaseConfig)
  .filter(([key, value]) => !value && key !== 'measurementId')
  .map(([key]) => `VITE_FIREBASE_${key.toUpperCase().replace(/[A-Z]/g, letter => `_${letter}`)}`);

if (missingKeys.length > 0) {
  console.warn(
    `Firebase config incomplete. Missing: ${missingKeys.join(', ')}. ` +
    `Check your .env file locally or Vercel Environment Variables in production.`
  );
}

const isConfigValid = !!firebaseConfig.apiKey;

// Initialize Firebase with fallback to prevent crash
const app = initializeApp(isConfigValid ? firebaseConfig : { 
    apiKey: "AIzaSy_DUMMY_KEY_PREVENTS_CRASH", 
    authDomain: "dummy.firebaseapp.com",
    projectId: "dummy-project",
    appId: "1:123456789:web:dummy"
});

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  if (!isConfigValid) throw new Error("Firebase configuration missing. Cannot sign in with Google.");
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

const getStorageKey = (uid: string) => `bodhi_user_${uid}`;

export const saveUserProfile = async (uid: string, data: UserPreferences) => {
    if (!isConfigValid) {
        localStorage.setItem(getStorageKey(uid), JSON.stringify(data));
        return;
    }
    try {
        await setDoc(doc(db, "users", uid), data, { merge: true });
    } catch (error: any) {
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
             if (localData) return JSON.parse(localData);
             return null;
        }
        console.error("Error fetching user profile", error);
        return null;
    }
};

/**
 * Saves a contact message to Firestore. 
 * To enable actual email delivery to bodhipath@ktktools.net, 
 * you should install the "Trigger Email from Firestore" extension in your Firebase console.
 */
export const saveContactMessage = async (name: string, email: string, message: string) => {
  if (!isConfigValid) {
    console.log("Offline/Mock mode: Saving contact message locally", { name, email, message });
    return;
  }
  try {
    await addDoc(collection(db, "contacts"), {
      to: "bodhipath@ktktools.net", // Useful metadata for the Trigger Email extension
      name,
      email,
      message,
      createdAt: serverTimestamp(),
      status: 'new'
    });
  } catch (error) {
    console.error("Error saving contact message", error);
    throw error;
  }
};
