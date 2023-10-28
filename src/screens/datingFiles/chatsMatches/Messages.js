import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../../firebase';
import './Messages.css';

const Messages = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [currentUserUid, setCurrentUserUid] = useState(null);

  // Extract the first name from the selectedUser's name
  const firstName = selectedUser ? selectedUser.name.split(' ')[0] : '';

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // User is logged in
        const userId = firebaseUser.uid;
        setCurrentUserUid(userId);

        // Start listening for messages
        startListeningForMessages(userId);
      } else {
        // User is not logged in, handle as needed
        setCurrentUserUid(null);
      }
    });
    return () => unsubscribe();
  }, [selectedUser]);

  const startListeningForMessages = (userId) => {
    if (!selectedUser) {
      return;
    }

    const chatRoomId = generateChatRoomId(userId, selectedUser.uid);

    const chatRoomRef = collection(db, 'chatRooms', chatRoomId, 'messages');

    onSnapshot(chatRoomRef, (snapshot) => {
      const messagesData = [];
      snapshot.forEach((doc) => {
        const message = doc.data();
        messagesData.push(message);
      });

    // Sort messages by timestamp in descending order (most recent first)
    messagesData.sort((a, b) => {
      const timestampA = a.timestamp.toDate();
      const timestampB = b.timestamp.toDate();
      return timestampA - timestampB;
    });
      setMessages(messagesData);
    });
  };

  const generateChatRoomId = (user1Id, user2Id) => {
    if (user1Id < user2Id) {
      return `${user1Id}_${user2Id}`;
    } else {
      return `${user2Id}_${user1Id}`;
    }
  };

  const handleSendMessage = async () => {
    if (messageText.trim() === '') {
      return;
    }

    const chatRoomId = generateChatRoomId(currentUserUid, selectedUser.uid);

    const message = {
      text: messageText,
      sender: currentUserUid,
      timestamp: new Date(),
    };

    const chatRoomRef = collection(db, 'chatRooms', chatRoomId, 'messages');

    try {
      await addDoc(chatRoomRef, message);
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="messages-container">
      {selectedUser ? (
        <h2>Messages with {firstName}</h2>
      ) : (
        <h2>Messages</h2>
      )}
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === currentUserUid ? 'sent' : 'received'}`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Messages;
