import React, { useState, useRef, useCallback, useEffect } from 'react';
import './MessageInput.css';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  disabled = false,
  placeholder = "הקלד את ההודעה שלך כאן..."
}) => {
  const [inputText, setInputText] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 120);
      textarea.style.height = `${newHeight}px`;
    }
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputText, adjustTextareaHeight]);

  const handleSend = useCallback(() => {
    const trimmedText = inputText.trim();
    if (trimmedText && !disabled) {
      onSendMessage(trimmedText);
      setInputText('');
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
      }, 0);
    }
  }, [inputText, disabled, onSendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const canSend = inputText.trim().length > 0 && !disabled;

  return (
    <div className="message-input-container">
      <div className="input-wrapper">
        <div className="textarea-container">
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder={placeholder}
            disabled={disabled}
            className="message-textarea"
            rows={1}
            maxLength={1000}
          />
          <div className="character-counter">
            <span className={inputText.length > 800 ? 'warning' : ''}>
              {inputText.length}/1000
            </span>
          </div>
        </div>
        
        <div className="input-actions">
          {inputText.length > 0 && (
            <button
              type="button"
              onClick={() => setInputText('')}
              className="clear-button"
              title="נקה טקסט"
            >
              ✕
            </button>
          )}
          
          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            className={`send-button ${canSend ? 'active' : ''}`}
            title="שלח הודעה (Enter)"
          >
            <span className="send-icon">➤</span>
            <span className="send-text">שלח</span>
          </button>
        </div>
      </div>
      
      <div className="input-shortcuts">
        <span className="shortcut-hint">
          <kbd>Enter</kbd> לשליחה • <kbd>Shift+Enter</kbd> לשורה חדשה
        </span>
      </div>
    </div>
  );
};

export default MessageInput;