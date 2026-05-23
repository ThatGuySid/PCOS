import { storage } from "@/services/storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import {
    getAuth,
    getReactNativePersistence,
    initializeAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let auth: Auth;
let authInitialized = false;
try {
  // initializeAuth must only be called once. If it has already been
  // initialized (e.g. on HMR/reload), initializeAuth will throw —
  // fall back to getAuth in that case.
  console.log(
    "[firebaseConfig] attempting initializeAuth with AsyncStorage persistence",
  );
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(storage),
  });
  authInitialized = true;
  console.log(
    "[firebaseConfig] initializeAuth succeeded — AsyncStorage persistence set",
  );
} catch (e) {
  // Already initialized or other issue: use existing auth instance.
  console.warn(
    "[firebaseConfig] initializeAuth threw, falling back to getAuth:",
    e,
  );
  auth = getAuth(app);
}

const db = getFirestore(app);

export { auth, authInitialized, db };
export default app;
