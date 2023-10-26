import React from 'react';
import './Messages.css';

const Messages = () => {
    return (
        <div className="messages-container">
            <h2>Messages</h2>
            <div className="chat-messages">
                {/* Will have code here for rendering past messages */}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    placeholder="Type a message..."
                />
                <button>
                    Send
                </button>
            </div>
        </div>
    );
};

export default Messages;
