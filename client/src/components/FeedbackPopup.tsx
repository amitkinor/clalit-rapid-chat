import React, { useState, useRef, useEffect } from 'react';
import './FeedbackPopup.css';

interface FeedbackPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedbackText: string) => void;
}

const FeedbackPopup: React.FC<FeedbackPopupProps> = ({ isOpen, onClose, onSubmit }) => {
  const [feedbackText, setFeedbackText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (feedbackText.trim()) {
      onSubmit(feedbackText.trim());
      setFeedbackText('');
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="feedback-popup-overlay" onClick={onClose}>
      <div className="feedback-popup" onClick={(e) => e.stopPropagation()}>
        <div className="feedback-popup-header">
          <h3>מה לא היה טוב בתשובה?</h3>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
        
        <div className="feedback-popup-content">
          <textarea
            ref={textareaRef}
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="אנא כתבו מה לא היה טוב בתשובה כדי שנוכל לשפר..."
            className="feedback-textarea"
            rows={4}
            maxLength={500}
          />
          <div className="character-count">
            {feedbackText.length}/500
          </div>
        </div>

        <div className="feedback-popup-actions">
          <button 
            className="cancel-button" 
            onClick={onClose}
          >
            ביטול
          </button>
          <button 
            className="submit-button" 
            onClick={handleSubmit}
            disabled={!feedbackText.trim()}
          >
            שלח משוב
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPopup;