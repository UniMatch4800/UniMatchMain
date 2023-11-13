import React, { useState, useEffect } from 'react';
import './MatchesMessagesContainer.css';
import MatchesComponent from './MatchesComponent';
import LikesComponent from './LikesComponent';
import MessagesComponent from './MessagesComponent';
import Messages from './Messages';

const MatchesMessagesContainer = ({ onSelectUser }) => {
  const [selectedTab, setSelectedTab] = useState('Lynks');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setSelectedUser(null);
    console.log(selectedUser)
  };

  const handleUserSelection = (clickedProfile) => {
    onSelectUser(clickedProfile);
    setSelectedUser(clickedProfile);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // Set selectedUser to null when onSelectUser is called externally
    setSelectedUser(selectedUser);
  }, [selectedUser]);

  return (
    <div className="matches-messages-container">
      <div className="tabs">
        <div
          className={`tab ${selectedTab === 'Lynks' ? 'active' : ''}`}
          onClick={() => handleTabChange('Lynks')}
        >
          Lynks
        </div>
        <div
          className={`tab ${selectedTab === 'Likes' ? 'active' : ''}`}
          onClick={() => handleTabChange('Likes')}
        >
          Likes
        </div>
        <div
          className={`tab ${selectedTab === 'Messages' ? 'active' : ''}`}
          onClick={() => handleTabChange('Messages')}
        >
          Messages
        </div>
      </div>
      <div className="content">
        {((selectedTab === 'Lynks' || selectedTab === 'Messages') && selectedUser && isMobile) ? (
          <Messages selectedUser={selectedUser} onSelectUser={setSelectedUser} />
        ) : (
          <>
            {selectedTab === 'Lynks' && <MatchesComponent onSelectUser={handleUserSelection} />}
            {selectedTab === 'Likes' && <LikesComponent onSelectUser={handleUserSelection} />}
            {selectedTab === 'Messages' && (
              <MessagesComponent onSelectUser={handleUserSelection} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MatchesMessagesContainer;
