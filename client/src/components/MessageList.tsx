import React, { useEffect, useRef } from 'react';
import Message, { MessageData } from './Message';
import TypingIndicator from './TypingIndicator';
import HamudiIsrael from '../assets/icons/hamudi_israel.png';
import './MessageList.css';

interface MessageListProps {
  messages: MessageData[];
  isLoading: boolean;
  onRetryMessage?: (messageId: string) => void;
  onSendMessage?: (message: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  isLoading, 
  onRetryMessage,
  onSendMessage 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'end'
    });
  };

  useEffect(() => {
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [messages, isLoading]);

  const handleRetry = (messageId: string) => {
    if (onRetryMessage) {
      onRetryMessage(messageId);
    }
  };

  return (
    <div className="message-list" ref={containerRef}>
      {messages.length === 0 && (
        <div className="welcome-message">
          <div className="welcome-avatar">
            <img src={HamudiIsrael} alt="חמודי ישראל" className="hamudi-icon" />
          </div>
          <h2>ברוכים הבאים לעומר, עוזר ה-AI החדש שלך למציאת שירותים בכללית</h2>
          <p>איך אוכל לעזור לך עם השאלות הרפואיות שלך היום?</p>
          <div className="suggestions">
            <button 
              className="suggestion-chip"
              onClick={() => onSendMessage?.('איך לקבוע תור לרופא?')}
            >
              איך לקבוע תור לרופא?
            </button>
            <button 
              className="suggestion-chip"
              onClick={() => onSendMessage?.('מה שעות הפעילות של הקופה?')}
            >
              מה שעות הפעילות של הקופה?
            </button>
            <button 
              className="suggestion-chip"
              onClick={() => onSendMessage?.('איך לחדש מרשם?')}
            >
              איך לחדש מרשם?
            </button>
          </div>
        </div>
      )}
      
      {messages.map((message) => (
        <div key={message.id} className="message-container">
          <Message message={message} />
          {message.status === 'error' && (
            <button 
              className="retry-button"
              onClick={() => handleRetry(message.id)}
              title="נסה שוב"
            >
              🔄 נסה שוב
            </button>
          )}
        </div>
      ))}
      
      {isLoading && <TypingIndicator />}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;