import React, { useState } from 'react';
import MatchesMessagesContainer from './MatchesMessagesContainer';
import ProfileInfo from './ProfileInfo';
import Messages from "./Messages";
import "./ChatsMatches.css";

const ChatsMatches = () => {
    const [selectedUserData, setSelectedUserData] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleUserSelection = (userData) => {
        setSelectedUserData(userData);
        setCurrentImageIndex(0);
      };

    return (
        <div className="chats-matches-container">
            <div className="matches-column">
                <MatchesMessagesContainer onSelectUser={handleUserSelection} />
            </div>
            <div className='messaging-column'>
                <Messages selectedUser={selectedUserData}/>
            </div>
            <div className='info-column'>
                <ProfileInfo selectedUser={selectedUserData} currentImageIndex={currentImageIndex} setCurrentImageIndex={setCurrentImageIndex} />
            </div>
        </div>
    );
};

export default ChatsMatches;