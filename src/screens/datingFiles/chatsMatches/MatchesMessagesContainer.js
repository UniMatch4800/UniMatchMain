import React, { useState } from 'react';
import './MatchesMessagesContainer.css';
import MatchesComponent from './MatchesComponent';
import LikesComponent from './LikesComponent'; // Import the new component

const MatchesMessagesContainer = ({ onSelectUser }) => {
    const [selectedTab, setSelectedTab] = useState('Lynks');
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
            </div>
            <div className="content">
                {selectedTab === 'Lynks' && (<MatchesComponent onSelectUser={handleUserSelection} />)}
                {selectedTab === 'Likes' && (<LikesComponent onSelectUser={handleUserSelection} />)}
            </div>
        </div>
    );
};

export default MatchesMessagesContainer;
