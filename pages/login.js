import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '../lib/firebase'; // Ensure Firebase auth and db are correctly imported
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await createUserProfile(user); // Ensure user is created in Firestore
        router.push('/feet'); // Redirect to home page if user is already logged in
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await createUserProfile(result.user); // Create user profile in Firestore
      router.push('/home'); // Redirect to home page after successful login
    } catch (error) {
      console.error("Google Sign-in Error:", error.message);
    }
  };

  const createUserProfile = async (user) => {
    // Check if user exists in Firestore
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // If user doesn't exist, create a new user document
      await setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: new Date(),
      });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-6">Welcome to Your App</h1>
        <button
          onClick={signInWithGoogle}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
