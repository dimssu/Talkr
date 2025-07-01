import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatBotProps, MessageType, ChatBotPosition } from './types';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ChatSuggestions } from './ChatSuggestions';
import { ChatFeedback } from './ChatFeedback';
import { ChatFileUpload } from './ChatFileUpload';
import './ChatBot.css';
import { getLlmConfig } from '../llmConfigs';

export const ChatBot = ({
  backendUrl,
  directLlmConfig: directLlmConfigProp,
  llmProvider,
  apiKey,
  context,
  responseType = 'formal',
  position = 'bottom-right',
  welcomeMessage = 'Hello! How can I help you today?',
  styling = {},
  theme = 'light',
  placeholderText,
  headerTitle = 'Chat Assistant',
  showTimestamps = false,
  botAvatarUrl,
  chatButtonIcon,
  customChatButton,
  onBeforeSend,
  onAfterResponse,
  maxHeight = '500px',
  persistChat = false,
  chatId = 'default',
  className = '',
  enableFileUpload = false,
  enableFeedback = false,
  suggestedQuestions = [],
  onFeedbackSubmit,
  onFileUpload,
  allowedFileTypes,
  maxFileSizeMB,
}: ChatBotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [effectiveTheme, setEffectiveTheme] = useState(theme);
  
  const directLlmConfig = llmProvider && apiKey
    ? getLlmConfig(llmProvider, apiKey)
    : directLlmConfigProp;
  
  useEffect(() => {
    if (theme === 'system') {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setEffectiveTheme(isDarkMode ? 'dark' : 'light');
      
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        setEffectiveTheme(e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      setEffectiveTheme(theme);
    }
  }, [theme]);
  
  useEffect(() => {
    if (persistChat) {
      const storageKey = `chatbot_messages_${chatId}`;
      const savedMessages = localStorage.getItem(storageKey);
      if (savedMessages) {
        try {
          const parsedMessages = JSON.parse(savedMessages);
          const messagesWithDates = parsedMessages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(messagesWithDates);
        } catch (e) {
          console.error('Failed to parse saved messages:', e);
          initializeWithWelcome();
        }
      } else {
        initializeWithWelcome();
      }
    } else {
      initializeWithWelcome();
    }
  }, [welcomeMessage, persistChat, chatId]);
  
  useEffect(() => {
    if (persistChat && messages.length > 0) {
      const storageKey = `chatbot_messages_${chatId}`;
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, persistChat, chatId]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Scroll to bottom when chat is opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    }
  }, [isOpen]);
  
  const initializeWithWelcome = () => {
    if (welcomeMessage) {
      setMessages([
        {
          id: uuidv4(),
          content: welcomeMessage,
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
    } else {
      setMessages([]);
    }
  };
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  
  const handleSendMessage = async (content: string) => {
    if (onBeforeSend) {
      const processedMessage = onBeforeSend(content);
      if (processedMessage === false) return;
      if (typeof processedMessage === 'string') {
        content = processedMessage;
      }
    }
    
    const userMessage: MessageType = {
      id: uuidv4(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);
    
    try {
      let botResponse: string;
      
      if (directLlmConfig && !backendUrl) {
        botResponse = await callDirectLlm(content, directLlmConfig);
      } else if (backendUrl) {
        botResponse = await callBackendApi(content, backendUrl);
      } else {
        throw new Error('Either backendUrl or directLlmConfig must be provided');
      }
      
      if (onAfterResponse) {
        botResponse = onAfterResponse(botResponse);
      }
      
      const botMessage: MessageType = {
        id: uuidv4(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  const callDirectLlm = async (content: string, config: typeof directLlmConfig): Promise<string> => {
    if (!config) throw new Error('LLM configuration is missing');

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(config?.apiEndpoint?.includes('gemini') 
          ? {} 
          : { 'Authorization': `Bearer ${config.apiKey}` }),
        ...config.headers
      };

      const requestBody = config.formatMessages 
        ? config.formatMessages(messages, content, context)
        : {
            model: config.model || 'gpt-3.5-turbo',
            messages: [
              ...(context ? [{ role: 'system', content: context }] : []),
              ...messages.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.content
              })),
              { role: 'user', content }
            ],
            max_tokens: 1000
          };

      const apiUrl = config.model?.includes('gemini')
        ? `${config.apiEndpoint}?key=${config.apiKey}`
        : config.apiEndpoint;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`LLM API error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      
      return config.parseResponse 
        ? config.parseResponse(data)
        : data.choices?.[0]?.message?.content || 
          data.response || 
          'Sorry, I couldn\'t process your request.';
    } catch (error) {
      console.error('Error calling LLM API:', error);
      throw error;
    }
  };
  
  const callBackendApi = async (content: string, url: string): Promise<string> => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          context,
          responseType,
          history: messages.map(msg => ({
            role: msg.sender,
            content: msg.content
          }))
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Backend API error (${response.status}): ${errorText}`);
      }
      
      const data = await response.json();
      return data.response || 'Sorry, I couldn\'t process your request.';
    } catch (error) {
      console.error('Error calling backend API:', error);
      throw error;
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };
  
  const handleFileUpload = async (file: File) => {
    if (!onFileUpload) return;
    
    try {
      await onFileUpload(file);
      
      const fileMessage: MessageType = {
        id: uuidv4(),
        content: `Uploaded file: ${file.name}`,
        sender: 'user',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, fileMessage]);
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    }
  };
  
  const handleFeedbackSubmit = (messageId: string, rating: 'positive' | 'negative', comment?: string) => {
    if (onFeedbackSubmit) {
      onFeedbackSubmit(messageId, rating, comment);
    }
  };
  
  // Determine position class
  const positionClasses: Record<ChatBotPosition, string> = {
    'bottom-right': 'bottom-right',
    'bottom-left': 'bottom-left',
    'top-right': 'top-right',
    'top-left': 'top-left',
  };
  const positionClass = positionClasses[position] || 'bottom-right';

  const containerClassName = `chatbotContainer ${positionClass} ${className}`.trim();
  
  // Render custom chat button icon or default SVG
  const renderChatButtonIcon = () => {
    if (typeof chatButtonIcon === 'string') {
      // Check if it's a Lottie URL
      if (chatButtonIcon.includes('lottie.host')) {
        return (
          <iframe 
            src={chatButtonIcon}
            style={{ 
              width: '28px', 
              height: '28px', 
              border: 'none', 
              background: 'transparent', 
              pointerEvents: 'none',
              ...(styling.chatButtonIconStyle || {}) 
            }}
            title="Chat button animation"
          />
        );
      }
      // If it's a regular URL string, render as img
      return <img src={chatButtonIcon} alt="Chat" style={{ width: '28px', height: '28px', pointerEvents: 'none', ...(styling.chatButtonIconStyle || {}) }} />;
    } else if (chatButtonIcon) {
      // If it's a React component, render it directly
      return chatButtonIcon;
    } else {
      // Default SVG icon
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      );
    }
  };
  
  // Render custom chat button content
  const renderCustomChatButton = () => {
    if (typeof customChatButton === 'string') {
      // Check if it's a Lottie URL
      if (customChatButton.includes('lottie.host')) {
        return (
          <iframe 
            src={customChatButton}
            style={{ 
              width: '100%', 
              height: '100%', 
              border: 'none', 
              background: 'transparent', 
              pointerEvents: 'none'
            }}
            title="Custom chat button animation"
          />
        );
      }
      // If it's a regular URL string, render as img
      return (
        <img 
          src={customChatButton} 
          alt="Chat" 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            pointerEvents: 'none'
          }} 
        />
      );
    } else if (customChatButton) {
      // If it's a React component, render it directly
      return customChatButton;
    }
    return null;
  };
  
  return (
    <div 
      className={containerClassName}
      data-theme={effectiveTheme}
      style={styling.containerStyle}
    >
      {isOpen ? (
        <div 
          className="chatWindow"
          style={{ maxHeight, ...(styling.windowStyle || {}) }}
        >
          <header className="chatHeader" style={styling.headerStyle}>
            <h3>{headerTitle}</h3>
            <button 
              onClick={toggleChat}
              className="closeButton"
              aria-label="Close chat"
            >
              ×
            </button>
          </header>
          
          <main className="chatBody" style={styling.bodyStyle}>
            {messages.length === 0 && (
              <div className="emptyState">
                Start a conversation by typing a message below.
              </div>
            )}
            
            {messages.map(message => (
              <>
                <ChatMessage
                  key={message?.id}
                  message={message}
                  styling={styling}
                  showTimestamp={showTimestamps}
                  botAvatarUrl={botAvatarUrl}
                />
                {enableFeedback && message.sender === 'bot' && (
                  <ChatFeedback
                    messageId={message.id}
                    onFeedbackSubmit={handleFeedbackSubmit}
                    styling={styling}
                  />
                )}
              </>
            ))}
            
            {isLoading && (
              <div className="loadingIndicator" aria-label="Loading response">
                <span className="typingDot"></span>
                <span className="typingDot"></span>
                <span className="typingDot"></span>
              </div>
            )}
            
            {error && (
              <div className="errorMessage" role="alert">
                {error}
              </div>
            )}
            
            {suggestedQuestions.length > 0 && (
              <ChatSuggestions
                suggestions={suggestedQuestions}
                onSuggestionClick={handleSuggestionClick}
                styling={styling}
              />
            )}
            
            <div ref={messagesEndRef} />
          </main>
          
          <footer className="chatFooter">
            {enableFileUpload && onFileUpload && (
              <ChatFileUpload
                onFileUpload={handleFileUpload}
                allowedFileTypes={allowedFileTypes}
                maxFileSizeMB={maxFileSizeMB}
                styling={styling}
              />
            )}
            
            <ChatInput
              onSendMessage={handleSendMessage}
              placeholderText={placeholderText}
              styling={styling}
              disabled={isLoading}
            />
          </footer>
        </div>
      ) : (
        customChatButton ? (
          <div 
            className="customChatButtonWrapper"
            onClick={toggleChat} 
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleChat();
              }
            }}
            aria-label="Open chat"
            style={styling.customChatButtonStyle}
          >
            {renderCustomChatButton()}
          </div>
        ) : (
          <button
            className="chatButton"
            onClick={toggleChat}
            aria-label="Open chat"
            style={{
              backgroundColor: styling.widgetColor || '#4f46e5',
              color: styling.textColor || '#ffffff',
              ...(styling.buttonStyle || {})
            }}
          >
            {renderChatButtonIcon()}
          </button>
        )
      )}
    </div>
  );
};
