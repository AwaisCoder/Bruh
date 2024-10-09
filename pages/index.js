// pages/index.js

import { useEffect, useState } from 'react';
import { auth } from '../lib/firebase'; // Import your Firebase config
import Login from './login'; // Importing the Login component
import Chat from './chat'; // Importing the Chat component

import Feed from './feet';

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); // Clean up the subscription
  }, []);

  return (
    <div>
      {user ? <Feed  /> : <Login />}
    </div>
  );
}
