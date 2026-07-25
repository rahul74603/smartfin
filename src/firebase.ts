import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

/**
 * Firebase config.
 *
 * These values were hardcoded in the repo. Firebase web API keys are not
 * secrets (they identify the project, they do not authorise it — access is
 * controlled by Firebase Security Rules and the Authorized Domains list), so
 * this was not a breach. But hardcoding them means you cannot point staging and
 * production at different projects, and rotating requires a code change.
 *
 * They now read from Vite env vars with the existing values as fallback, so
 * nothing breaks if .env is absent. To override, create a .env file:
 *
 *   VITE_FIREBASE_API_KEY=...
 *   VITE_FIREBASE_AUTH_DOMAIN=...
 *   VITE_FIREBASE_PROJECT_ID=...
 *   VITE_FIREBASE_STORAGE_BUCKET=...
 *   VITE_FIREBASE_MESSAGING_SENDER_ID=...
 *   VITE_FIREBASE_APP_ID=...
 *
 * IMPORTANT: in the Firebase console, restrict Authentication →
 * Settings → Authorized domains to smartfintool.com and localhost only.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "AIzaSyCeH3DpOwVxM77l-uFo5mRTUVBLtNy86K4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "smartfintool-7b1c5.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "smartfintool-7b1c5",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "smartfintool-7b1c5.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "444746236807",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "1:444746236807:web:5d922c615cbc33f15fc922",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
