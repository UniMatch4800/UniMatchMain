import React, { useState, useEffect } from 'react';
import MatchesMessagesContainer from './MatchesMessagesContainer';
import ProfileInfo from './ProfileInfo';
import Messages from "./Messages";
import "./ChatsMatches.css";

const ChatsMatches = () => {
    const [selectedUserData, setSelectedUserData] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    const handleUserSelection = (userData) => {
        setSelectedUserData(userData);
        setCurrentImageIndex(0);
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

    return (
        <div className="chats-matches-container">
            <div className="matches-column">
                <MatchesMessagesContainer onSelectUser={handleUserSelection} />
            </div>
            {isMobile ? null : (
                <>
                    <div className='messaging-column'>
                        <Messages selectedUser={selectedUserData} />
                    </div>
                    <div className='info-column'>
                        <ProfileInfo selectedUser={selectedUserData} currentImageIndex={currentImageIndex} setCurrentImageIndex={setCurrentImageIndex} />
                    </div>
                </>
            )}
        </div>
    );
};

export default ChatsMatches;
