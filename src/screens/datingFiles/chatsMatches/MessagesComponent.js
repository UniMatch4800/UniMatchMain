import React, { useState, useEffect } from 'react';

const MessagesComponent = () => {
  const [messages, setMessages] = useState([]);

  // Simulated data for chat messages (you should fetch this data from your backend)
  const chatMessages = [
    { id: 1, sender: 'User 1', message: 'Hello there!' },
    { id: 2, sender: 'User 2', message: 'Hi! How are you?' },
    // Add more chat messages here
  ];

  useEffect(() => {
    // Simulated fetching of chat messages (replace with actual data fetching)
    setMessages(chatMessages);
  }, []);

  return (
    <div className="messages-component">
      <h2>Messages</h2>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>
            <div className="message-sender">
              <p>{message.sender}:</p>
            </div>
            <div className="message-text">
              <p>{message.message}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessagesComponent;
