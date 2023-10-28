import React, { useState } from 'react';
import './MatchesMessagesContainer.css';
import MatchesComponent from './MatchesComponent';
import MessagesComponent from './MessagesComponent';

const MatchesMessagesContainer = ({ onSelectUser }) => {
  const [selectedTab, setSelectedTab] = useState('Matches');
  const [selectedUser, setSelectedUser] = useState(0);

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const handleUserSelection = (clickedProfile) => {
    onSelectUser(clickedProfile);
  };

  return (
    <div className="matches-messages-container">
      <div className="tabs">
        <div
          className={`tab ${selectedTab === 'Matches' ? 'active' : ''}`}
          onClick={() => handleTabChange('Matches')}
        >
          Matches
        </div>
        <div
          className={`tab ${selectedTab === 'Messages' ? 'active' : ''}`}
          onClick={() => handleTabChange('Messages')}
        >
          Messages
        </div>
      </div>
      <div className="content">
        {/* Render the content based on the selected tab */
        selectedTab === 'Matches' && (
          <MatchesComponent onSelectUser={handleUserSelection} />
        )}
        {selectedTab === 'Messages' && <MessagesComponent selectedUser={selectedUser} />}
      </div>
    </div>
  );
};

export default MatchesMessagesContainer;
