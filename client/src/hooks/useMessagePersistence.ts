import { useState, useEffect, useCallback } from 'react';
import { MessageData } from '../components/Message';

const STORAGE_KEY = 'clalit-chat-messages';
const MAX_STORED_MESSAGES = 100;

export const useMessagePersistence = () => {
  const [messages, setMessages] = useState<MessageData[]>([]);

  // Load messages from localStorage on mount
  useEffect(() => {
    try {
      const storedMessages = localStorage.getItem(STORAGE_KEY);
      if (storedMessages) {
        const parsedMessages: MessageData[] = JSON.parse(storedMessages);
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsedMessages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
      }
    } catch (error) {
      console.error('Failed to load messages from localStorage:', error);
    }
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    try {
      // Keep only the most recent messages to avoid storage bloat
      const messagesToStore = messages.slice(-MAX_STORED_MESSAGES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messagesToStore));
    } catch (error) {
      console.error('Failed to save messages to localStorage:', error);
      // If storage is full, try to clear old data and save again
      try {
        localStorage.removeItem(STORAGE_KEY);
        const recentMessages = messages.slice(-50); // Keep only 50 most recent
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recentMessages));
      } catch (secondError) {
        console.error('Failed to save messages after cleanup:', secondError);
      }
    }
  }, [messages]);

  const addMessage = useCallback((message: MessageData) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const updateMessage = useCallback((messageId: string, updates: Partial<MessageData>) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, ...updates } : msg
    ));
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear messages from localStorage:', error);
    }
  }, []);

  const getMessageById = useCallback((messageId: string) => {
    return messages.find(msg => msg.id === messageId);
  }, [messages]);

  return {
    messages,
    setMessages,
    addMessage,
    updateMessage,
    clearMessages,
    getMessageById
  };
};