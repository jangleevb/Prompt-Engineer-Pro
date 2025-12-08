import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";

// Safe access to env, fallback to empty object if undefined
const env = (import.meta as any).env || {};

// Check if API key is present and not the default placeholder
// Also checking length > 10 to avoid dummy strings
const apiKey = env.VITE_FIREBASE_API_KEY;
export const isFirebaseConfigured = 
  !!apiKey && 
  apiKey.length > 10 &&
  apiKey !== "YOUR_API_KEY_HERE" &&
  !apiKey.includes("YOUR_API_KEY");

// Default config or actual config
const firebaseConfig = {
  apiKey: apiKey || "YOUR_API_KEY_HERE",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
  appId: env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
};

let app;
let auth: Auth | undefined;
let googleProvider: GoogleAuthProvider | undefined;

// Only initialize if we have a valid-looking configuration
if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
  } catch (error) {
    console.warn("Firebase initialization failed. Falling back to mock mode.", error);
  }
}

export { auth, googleProvider };