import { useState, FormEvent, KeyboardEvent } from 'react';
import './ChatInput.css';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  placeholderText?: string;
  styling?: {
    widgetColor?: string;
    textColor?: string;
    sendButtonTextColor?: string;
  };
  disabled?: boolean;
}

export const ChatInput = ({
  onSendMessage,
  placeholderText = 'Type your message...',
  styling = {},
  disabled = false,
}: ChatInputProps) => {
  const [message, setMessage] = useState('');
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  const buttonStyle = {
    backgroundColor: styling.widgetColor || '#4f46e5',
    color: styling.sendButtonTextColor || '#ffffff',
  };
  
  return (
    <form className="inputContainer" onSubmit={handleSubmit}>
      <textarea
        className="textInput"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholderText}
        disabled={disabled}
        rows={1}
      />
      <button 
        type="submit" 
        className="sendButton" 
        style={buttonStyle}
        disabled={disabled || !message.trim()}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    </form>
  );
}; 