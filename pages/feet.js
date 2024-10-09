// pages/home.js
import { useRouter } from 'next/router';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { useEffect } from 'react';

export default function Feed() {
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!auth.currentUser) {
      router.push('/login');
    }
  }, [auth.currentUser, router]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const navigateToChat = () => {
    router.push('/chat');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Navbar */}
      <header className="bg-white p-4 shadow-md flex items-center justify-between">
        <h1 className="text-2xl font-bold">Instagram Feed</h1>
        <div className="flex items-center space-x-4">
          {/* Message Icon */}
          <button onClick={navigateToChat}>
            <img src="/message-icon.png" alt="Messages" className="w-8 h-8" />
          </button>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white py-2 px-4 rounded-full"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Instagram Feed - Dummy Posts */}
      <main className="flex-1 p-4">
        <div className="space-y-4">
          <div className="bg-white p-4 shadow-md rounded-lg">
            <div className="flex items-center space-x-2">
              <img src="/default-avatar.png" alt="User" className="w-10 h-10 rounded-full" />
              <span className="font-bold">User 1</span>
            </div>
            <p className="mt-2">This is a sample post content, just like Instagram!</p>
          </div>

          <div className="bg-white p-4 shadow-md rounded-lg">
            <div className="flex items-center space-x-2">
              <img src="/default-avatar.png" alt="User" className="w-10 h-10 rounded-full" />
              <span className="font-bold">User 2</span>
            </div>
            <p className="mt-2">Another post here!</p>
          </div>
        </div>
      </main>
    </div>
  );
}
