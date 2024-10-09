// pages/chat.js

import { useEffect, useRef, useState } from 'react';
import { auth, db } from '../lib/firebase'; // Import your Firebase config
import { signOut } from 'firebase/auth';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [formValue, setFormValue] = useState('');
  const dummy = useRef();

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesArray = [];
      querySnapshot.forEach((doc) => {
        messagesArray.push({ id: doc.id, ...doc.data() });
      });
      setMessages(messagesArray);
    });

    return () => unsubscribe(); // Clean up subscription on unmount
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid, displayName, photoURL } = auth.currentUser;

    await addDoc(collection(db, 'messages'), {
      text: formValue,
      createdAt: new Date(),
      uid,
      displayName,
      photoURL,
    });

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white p-4 shadow-md">
        <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Chat Room</h1>
        
        <button
          onClick={handleSignOut}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full "
        >
          Sign Out
        </button>
        </div>
      </header>

      <main className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map(msg => (
            <div key={msg.uid} className="flex items-start">
              <img src={msg.photoURL} alt="Avatar" className="w-10 h-10 rounded-full mr-2" />
              <div className="bg-white p-2 rounded-lg shadow-md">
                <p className="font-bold">{msg.displayName}</p>
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
          <span ref={dummy}></span>
        </div>
      </main>

      <form onSubmit={sendMessage} className="p-4 bg-white shadow-md">
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-full"
          placeholder="Type your message..."
        />
        <button type="submit" disabled={!formValue} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg mt-2 float-right w-full">
          Send
        </button>
      </form>
    </div>
  );
}
