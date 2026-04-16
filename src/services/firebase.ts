
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from "firebase/firestore";
import { UserPreferences, DailyDrop } from "../types";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase with fallback to prevent crash
const isConfigValid = !!firebaseConfig.apiKey;
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

export const getDailyWisdom = async (): Promise<DailyDrop | null> => {
  if (!isConfigValid) return null;
  try {
    // We store the current wisdom in a document named 'current' in the 'daily_wisdom' collection
    const docRef = doc(db, "daily_wisdom", "current");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as DailyDrop;
    }
    return null;
  } catch (error) {
    console.error("Error fetching daily wisdom", error);
    return null;
  }
};

export const getWisdomHistory = async (count: number = 10): Promise<DailyDrop[]> => {
  if (!isConfigValid) return [];
  try {
    const q = query(collection(db, "daily_wisdom_history"), orderBy("timestamp", "desc"), limit(count));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as DailyDrop);
  } catch (error) {
    console.error("Error fetching wisdom history", error);
    return [];
  }
};

export const saveDailyWisdom = async (drop: DailyDrop) => {
  if (!isConfigValid) return;
  try {
    // Update current
    await setDoc(doc(db, "daily_wisdom", "current"), drop);
    // Add to history
    await addDoc(collection(db, "daily_wisdom_history"), drop);
  } catch (error) {
    console.error("Error saving daily wisdom", error);
    throw error;
  }
};
