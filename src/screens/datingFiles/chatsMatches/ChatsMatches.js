import React from 'react';
import MatchesMessagesContainer from './MatchesMessagesContainer';
import Messages from "./Messages";
import "./ChatsMatches.css";

const ChatsMatches = () => {
    return (
        <div className="chats-matches-container">
            <div className="matches-column">
                <MatchesMessagesContainer />
            </div>
            <div className='messaging-column'>
                <Messages />
            </div>
        </div>
    );
};

export default ChatsMatches;
