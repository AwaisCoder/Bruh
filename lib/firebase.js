import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Firebase configuration (replace with your actual config)
const firebaseConfig = {
    apiKey: "AIzaSyDqk1B9VKNSkYNbUvFaAEOI5bJ4VzlWnKk",
    authDomain: "chatting-689bc.firebaseapp.com",
    projectId: "chatting-689bc",
    storageBucket: "chatting-689bc.appspot.com",
    messagingSenderId: "1051024629362",
    appId: "1:1051024629362:web:64c58aa20dc65c6d9beceb",
    measurementId: "G-1BZ1X84BVQ"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };
