import React from 'react';
import BotAvatar from '../assets/icons/001_NoHat.png';
import './TypingIndicator.css';

const TypingIndicator: React.FC = () => {
  return (
    <div className="message bot-message typing-message">
      <img src={BotAvatar} alt="עומר - עוזר AI" className="bot-avatar" />
      <div className="message-bubble">
        <div className="message-content typing-content">
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span className="typing-text">עומר כותב...</span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;