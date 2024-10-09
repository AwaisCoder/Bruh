// pages/login.js

import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../lib/firebase'; // Adjust path as necessary
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const navigate = useRouter();

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.push('/chat'); // Redirect to chat page after login
    } catch (error) {
      console.error("Google Sign-in Error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-6">Welcome to !Insta</h1>
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
