import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// यह कोड आपको Firebase Console की Project Settings से मिलेगा
const firebaseConfig = {
  apiKey: "AIzaSyCeH3DpOwVxM77l-uFo5mRTUVBLtNy86K4",
  authDomain: "smartfintool-7b1c5.firebaseapp.com",
  projectId: "smartfintool-7b1c5",
  storageBucket: "smartfintool-7b1c5.firebasestorage.app",
  messagingSenderId: "444746236807",
  appId: "1:444746236807:web:5d922c615cbc33f15fc922"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();