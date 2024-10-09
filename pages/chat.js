import { useEffect, useRef, useState } from 'react';
import { auth, db } from '../lib/firebase'; // Firebase config
import { collection, addDoc, query, orderBy, onSnapshot, doc, setDoc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [formValue, setFormValue] = useState('');
  const [recipient, setRecipient] = useState(null); // For private chat
  const [users, setUsers] = useState([]); // List of users to chat with
  const [chatId, setChatId] = useState(''); // Unique chat room ID
  const dummy = useRef();

  // Fetch users for chat
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersArray = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (doc.id !== auth.currentUser.uid) { // Exclude current user from the list
          usersArray.push({ uid: doc.id, ...data });
        }
      });
      setUsers(usersArray);
    });

    return () => unsubscribe();
  }, []);

  // Fetch private chat messages when recipient is selected
  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, `chats/${chatId}/messages`),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesArray = [];
      snapshot.forEach((doc) => {
        messagesArray.push({ id: doc.id, ...doc.data() });
      });
      setMessages(messagesArray);
    });

    return () => unsubscribe();
  }, [chatId]);

  // Handle selecting a user and creating or retrieving chat room
  const selectUser = async (user) => {
    setRecipient(user);

    // Create or get existing chat room (using both UIDs to form chat room ID)
    const chatRoomId = [auth.currentUser.uid, user.uid].sort().join('_');
    setChatId(chatRoomId);

    // Check if the chat room already exists
    const chatDocRef = doc(db, 'chats', chatRoomId);
    const chatDoc = await getDoc(chatDocRef);

    if (!chatDoc.exists()) {
      // If the chat room doesn't exist, create it
      await setDoc(chatDocRef, {
        users: [auth.currentUser.uid, user.uid],
        createdAt: new Date(),
      });
    }
  };

  // Send a message
  const sendMessage = async (e) => {
    e.preventDefault();

    if (!formValue.trim() || !chatId) return;

    const { uid, displayName, photoURL } = auth.currentUser;

    await addDoc(collection(db, `chats/${chatId}/messages`), {
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
      <header className="bg-white p-4 shadow-md flex items-center justify-between">
        <h1 className="text-2xl font-bold">Messages</h1>
        <button onClick={handleSignOut} className="bg-red-500 text-white py-2 px-4 rounded-full">
          Sign Out
        </button>
      </header>

      {/* User List */}
      <div className="p-4 bg-white shadow-md">
        <h2 className="font-bold mb-4">Users</h2>
        <div className="space-y-2">
          {users.map((user) => (
            <div
              key={user.uid}
              className={`p-2 bg-gray-100 rounded-lg flex items-center cursor-pointer ${recipient && recipient.uid === user.uid ? 'bg-blue-200' : ''}`}
              onClick={() => selectUser(user)}
            >
              <img src={user.photoURL || '/default-avatar.png'} alt="Avatar" className="w-10 h-10 rounded-full mr-2" />
              <span>{user.displayName}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {recipient && (
        <>
          <main className="flex-1 p-4 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Chat with {recipient.displayName}</h2>
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.uid === auth.currentUser.uid ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.uid !== auth.currentUser.uid && (
                    <img src={msg.photoURL} alt="Avatar" className="w-8 h-8 rounded-full mr-2" />
                  )}
                  <div
                    className={`rounded-lg p-3 max-w-xs ${msg.uid === auth.currentUser.uid ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    <p className="font-medium">{msg.displayName}</p>
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}
              <span ref={dummy}></span>
            </div>
          </main>

          {/* Message Input */}
          <form onSubmit={sendMessage} className="p-4 bg-white shadow-md flex items-center">
            <input
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none"
              placeholder={`Message ${recipient.displayName}...`}
            />
            <button
              type="submit"
              className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-full"
            >
              Send
            </button>
          </form>
        </>
      )}
    </div>
  );
}
