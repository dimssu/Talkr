import { useState, useEffect } from 'react';
import './ChatMessage.css';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    sender: 'user' | 'bot';
    timestamp: Date;
  };
  styling?: {
    userMessageBackground?: string;
    botMessageBackground?: string;
    textColor?: string;
  };
  showTimestamp?: boolean;
  botAvatarUrl?: string;
}

export const ChatMessage = ({
  message,
  styling = {},
  showTimestamp = false,
  botAvatarUrl,
}: ChatMessageProps) => {
  const [timeAgo, setTimeAgo] = useState<string>('');
  
  useEffect(() => {
    const updateTimeAgo = () => {
      const now = new Date();
      const diff = now.getTime() - message.timestamp.getTime();
      
      if (diff < 60000) {
        setTimeAgo('just now');
      } else if (diff < 3600000) {
        setTimeAgo(`${Math.floor(diff / 60000)}m ago`);
      } else if (diff < 86400000) {
        setTimeAgo(`${Math.floor(diff / 3600000)}h ago`);
      } else {
        setTimeAgo(`${Math.floor(diff / 86400000)}d ago`);
      }
    };
    
    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 60000);
    return () => clearInterval(interval);
  }, [message.timestamp]);
  
  const messageStyle = {
    backgroundColor: message.sender === 'user' 
      ? styling.userMessageBackground || '#4f46e5' 
      : styling.botMessageBackground || '#9692e4',
    color: message.sender === 'user' 
      ? '#ffffff' 
      : styling.textColor || '#2e4057',
  };

  const containerClass = `messageContainer ${message.sender === 'user' ? 'userMessage' : 'botMessage'}`;

  // Markdown rendering
  const htmlContent = DOMPurify.sanitize((marked as any).parseSync ? (marked as any).parseSync(message.content) : marked(message.content));
  
  return (
    <div className={containerClass}>
      {message.sender === 'bot' && botAvatarUrl && (
        <div className="avatar">
          <img src={botAvatarUrl} alt="Bot" />
        </div>
      )}
      <div className="messageContent" style={messageStyle}>
        <div className="messageText" dangerouslySetInnerHTML={{ __html: htmlContent }} />
        {showTimestamp && (
          <div className="timestamp">{timeAgo}</div>
        )}
      </div>
    </div>
  );
}; 