// lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDqk1B9VKNSkYNbUvFaAEOI5bJ4VzlWnKk",
  authDomain: "chatting-689bc.firebaseapp.com",
  projectId: "chatting-689bc",
  storageBucket: "chatting-689bc.appspot.com",
  messagingSenderId: "1051024629362",
  appId: "1:1051024629362:web:64c58aa20dc65c6d9beceb",
  measurementId: "G-1BZ1X84BVQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
