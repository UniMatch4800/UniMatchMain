import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, onSnapshot, setDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../../firebase';
import './Messages.css';
import { FaRegArrowAltCircleLeft, FaInfoCircle } from "react-icons/fa";
import ProfileInfo from './ProfileInfo';

const Messages = ({ selectedUser, onSelectUser }) => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [currentUserUid, setCurrentUserUid] = useState(null);
  const [showProfileInfo, setShowProfileInfo] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);


  const chatMessagesRef = useRef(null);
  const lastMessageRef = useRef(null);

  // Extract the first name from the selectedUser's name
  const name = selectedUser ? `${selectedUser.name.split(' ')[0]} ${selectedUser.name.split(' ')[1].charAt(0)}.` : '';

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
    if (!selectedUser || !chatMessagesRef.current) {
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

  // Add this useEffect to scroll to the bottom when new messages are loaded
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

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

    const participants = [currentUserUid, selectedUser.uid];

    const message = {
      text: messageText,
      sender: currentUserUid,
      timestamp: new Date(),
    };

    const chatRoomRef = collection(db, 'chatRooms', chatRoomId, 'messages');

    try {
      // Create or update the chat room document with the participants field
      await setDoc(doc(db, 'chatRooms', chatRoomId), { participants }, { merge: true });

      // Add the message to the 'messages' subcollection
      await addDoc(chatRoomRef, message);

      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleBack = () => {
    if (showProfileInfo) {
      setShowProfileInfo(false);
    } else {
      onSelectUser(null);
      setShowProfileInfo(false);
    }
  };

  const handleInfoButtonClick = () => {
    setShowProfileInfo(!showProfileInfo);
  };

  return (
    <div className="messages-container">
      <div className="msgs-header">
        {selectedUser ? (
          <>
            <button onClick={handleBack} className='back-btn'><FaRegArrowAltCircleLeft /></button>
            <h2 className='msgs-name' onClick={handleInfoButtonClick}>{name}</h2>
            <button onClick={handleInfoButtonClick} className='info-btn'><FaInfoCircle /></button>
          </>
        ) : (
          <h2>Messages</h2>
        )}
      </div>
      {showProfileInfo ? (
        <ProfileInfo selectedUser={selectedUser} currentImageIndex={currentImageIndex} setCurrentImageIndex={setCurrentImageIndex} />
      ) : (
        <>
          <div className="chat-messages" ref={chatMessagesRef}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.sender === currentUserUid ? 'sent' : 'received'}`}
                ref={index === messages.length - 1 ? lastMessageRef : null}
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
        </>
      )}
    </div>
  );
};

export default Messages;
