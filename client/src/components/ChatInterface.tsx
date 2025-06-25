import React, { useState, useCallback } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { MessageData } from './Message';
import { useMessagePersistence } from '../hooks/useMessagePersistence';
import './ChatInterface.css';


const ChatInterface: React.FC = () => {
  const { messages, addMessage, updateMessage, clearMessages, getMessageById } = useMessagePersistence();
  const [isLoading, setIsLoading] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState<Map<string, number>>(new Map());


  const sendMessage = useCallback(async (messageText: string, isRetry = false, originalMessageId?: string) => {
    if (!messageText.trim() || isLoading) return;

    let userMessage: MessageData;
    
    if (isRetry && originalMessageId) {
      // Update existing message status
      updateMessage(originalMessageId, { status: 'sending' });
    } else {
      // Create new user message
      userMessage = {
        id: Date.now().toString(),
        text: messageText.trim(),
        isUser: true,
        timestamp: new Date(),
        status: 'sending',
      };
      addMessage(userMessage);
    }

    setIsLoading(true);

    try {
      // Prepare conversation history including the new message
      const conversationHistory = isRetry 
        ? messages.map(msg => ({
            text: msg.text,
            isUser: msg.isUser,
            timestamp: msg.timestamp.toISOString()
          }))
        : [...messages, userMessage!].map(msg => ({
            text: msg.text,
            isUser: msg.isUser,
            timestamp: msg.timestamp.toISOString()
          }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: messageText,
          conversation: conversationHistory 
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Update user message status to sent
      if (!isRetry) {
        updateMessage(userMessage!.id, { status: 'sent' });
      }

      // Add bot response
      const botMessage: MessageData = {
        id: (Date.now() + Math.random()).toString(),
        text: data.response || 'מצטער, לא קיבלתי תגובה מהשרת.',
        isUser: false,
        timestamp: new Date(),
        status: 'sent',
      };

      setTimeout(() => {
        addMessage(botMessage);
      }, 500);

      // Reset retry attempts for this message
      if (originalMessageId) {
        setRetryAttempts(prev => {
          const newMap = new Map(prev);
          newMap.delete(originalMessageId);
          return newMap;
        });
      }

    } catch (error) {
      console.error('Failed to send message:', error);
      
      const messageId = isRetry ? originalMessageId! : userMessage!.id;
      const currentRetries = retryAttempts.get(messageId) || 0;
      
      if (currentRetries < 3) {
        // Update message status to error
        updateMessage(messageId, { status: 'error' });
        
        setRetryAttempts(prev => {
          const newMap = new Map(prev);
          newMap.set(messageId, currentRetries + 1);
          return newMap;
        });
      } else {
        // Max retries reached, show final error
        const errorMessage: MessageData = {
          id: (Date.now() + Math.random()).toString(),
          text: 'מצטער, לא הצלחתי לשלוח את ההודעה לאחר מספר ניסיונות. אנא בדוק את החיבור לאינטרנט ונסה שוב.',
          isUser: false,
          timestamp: new Date(),
          status: 'sent',
        };
        addMessage(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, retryAttempts]);

  const handleRetryMessage = useCallback((messageId: string) => {
    const message = getMessageById(messageId);
    if (message && message.isUser) {
      sendMessage(message.text, true, messageId);
    }
  }, [getMessageById, sendMessage]);

  const handleSendMessage = useCallback((messageText: string) => {
    sendMessage(messageText);
  }, [sendMessage]);

  const handleFeedback = useCallback((messageId: string, feedback: 'up' | 'down') => {
    updateMessage(messageId, { feedback });
  }, [updateMessage]);

  const handleClearChat = useCallback(() => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את כל ההיסטוריה?')) {
      clearMessages();
    }
  }, [clearMessages]);

  return (
    <div className="chat-interface">
      <MessageList 
        messages={messages}
        isLoading={isLoading}
        onRetryMessage={handleRetryMessage}
        onSendMessage={handleSendMessage}
        onFeedback={handleFeedback}
      />
      <MessageInput 
        onSendMessage={handleSendMessage}
        disabled={isLoading}
      />
      {messages.length > 0 && (
        <button 
          className="clear-chat-button"
          onClick={handleClearChat}
          title="מחק היסטוריה"
        >
          🗑️ מחק שיחה
        </button>
      )}
    </div>
  );
};

export default ChatInterface;