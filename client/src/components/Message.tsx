import React, { useState } from 'react';
import BotAvatar from '../assets/logos/white_lips.png';
import FeedbackPopup from './FeedbackPopup';
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
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const sendFeedbackToServer = async (feedbackType: 'up' | 'down', feedbackText?: string) => {
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageId: message.id,
          messageText: message.text,
          feedbackType,
          feedbackText: feedbackText || null
        }),
      });
    } catch (error) {
      console.error('Failed to send feedback:', error);
    }
  };

  const handleFeedback = (feedback: 'up' | 'down') => {
    if (feedback === 'up') {
      setLocalFeedback(feedback);
      if (onFeedback) {
        onFeedback(message.id, feedback);
      }
      sendFeedbackToServer('up');
    } else {
      setShowFeedbackPopup(true);
    }
  };

  const handleThumbsDownSubmit = (feedbackText: string) => {
    setLocalFeedback('down');
    if (onFeedback) {
      onFeedback(message.id, 'down');
    }
    sendFeedbackToServer('down', feedbackText);
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
      
      <FeedbackPopup
        isOpen={showFeedbackPopup}
        onClose={() => setShowFeedbackPopup(false)}
        onSubmit={handleThumbsDownSubmit}
      />
    </div>
  );
};

export default Message;