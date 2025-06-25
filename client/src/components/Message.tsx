import React, { useState } from 'react';
import BotAvatar from '../assets/logos/white_lips.png';
import './Message.css';

export interface MessageData {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
  feedback?: 'up' | 'down' | null;
}

interface MessageProps {
  message: MessageData;
  onFeedback?: (messageId: string, feedback: 'up' | 'down') => void;
}

const Message: React.FC<MessageProps> = ({ message, onFeedback }) => {
  const [localFeedback, setLocalFeedback] = useState<'up' | 'down' | null>(message.feedback || null);

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleFeedback = (feedback: 'up' | 'down') => {
    setLocalFeedback(feedback);
    if (onFeedback) {
      onFeedback(message.id, feedback);
    }
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
            <button 
              className={`feedback-button thumbs-up ${localFeedback === 'up' ? 'selected' : ''}`}
              title="תגובה חיובית"
              onClick={() => handleFeedback('up')}
            >
              👍
            </button>
            <button 
              className={`feedback-button thumbs-down ${localFeedback === 'down' ? 'selected' : ''}`}
              title="תגובה שלילית"
              onClick={() => handleFeedback('down')}
            >
              👎
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;