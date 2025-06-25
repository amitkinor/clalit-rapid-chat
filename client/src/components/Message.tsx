import React from 'react';
import BotAvatar from '../assets/logos/white_lips.png';
import './Message.css';

export interface MessageData {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

interface MessageProps {
  message: MessageData;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}>
      {!message.isUser && (
        <img src={BotAvatar} alt="עומר - עוזר AI" className="bot-avatar" />
      )}
      <div className="message-bubble">
        <div className={`message-content ${message.status === 'error' ? 'error' : ''}`}>
          {message.text}
          {message.status === 'sending' && (
            <span className="sending-indicator">...</span>
          )}
        </div>
        <div className="message-time">
          {formatTime(message.timestamp)}
          {message.isUser && message.status === 'sent' && (
            <span className="sent-indicator">✓</span>
          )}
          {message.isUser && message.status === 'error' && (
            <span className="error-indicator">!</span>
          )}
        </div>
        {!message.isUser && (
          <div className="feedback-buttons">
            <button className="feedback-button thumbs-up" title="תגובה חיובית">
              👍
            </button>
            <button className="feedback-button thumbs-down" title="תגובה שלילית">
              👎
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;