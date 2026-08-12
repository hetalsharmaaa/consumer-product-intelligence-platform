import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minus } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { getBotResponse, getInitialMessage } from '../../services/mockChatService';
import './ChatWidget.css';

export default function ChatWidget() {
  // Use sessionStorage for persistence across full page reloads
  const [isOpen, setIsOpen] = useState(() => {
    const saved = sessionStorage.getItem('chat_isOpen');
    return saved === 'true';
  });
  const [isMinimized, setIsMinimized] = useState(() => {
    const saved = sessionStorage.getItem('chat_isMinimized');
    return saved === 'true';
  });
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem('chat_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [getInitialMessage()];
      }
    }
    return [getInitialMessage()];
  });
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Persist state changes
  useEffect(() => {
    sessionStorage.setItem('chat_isOpen', isOpen);
  }, [isOpen]);

  useEffect(() => {
    sessionStorage.setItem('chat_isMinimized', isMinimized);
  }, [isMinimized]);

  useEffect(() => {
    sessionStorage.setItem('chat_messages', JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen, isMinimized]);

  const toggleChat = () => {
    if (isMinimized) {
      setIsMinimized(false);
      setIsOpen(true);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handleMinimize = (e) => {
    e.stopPropagation();
    setIsMinimized(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue.trim(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Get bot response
    const botResponse = await getBotResponse(userMsg.text);
    
    setIsTyping(false);
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      sender: 'bot',
      ...botResponse
    }]);
  };

  return (
    <div className={`chat-widget-container ${isOpen ? 'chat-open' : ''} ${isMinimized ? 'chat-minimized' : ''}`}>
      {!isOpen && !isMinimized && (
        <button className="chat-fab slide-up" onClick={toggleChat} aria-label="Open AI Assistant">
          <MessageCircle size={24} />
        </button>
      )}

      {(isOpen || isMinimized) && (
        <div className={`chat-window ${isMinimized ? 'minimized' : ''} slide-up`}>
          <div className="chat-header" onClick={isMinimized ? toggleChat : undefined}>
            <div className="chat-header-info">
              <div className="chat-header-avatar">
                <MessageCircle size={16} />
              </div>
              <div>
                <h3 className="chat-header-title">AI Assistant</h3>
                {!isMinimized && <p className="chat-header-status">Online</p>}
              </div>
            </div>
            <div className="chat-header-actions">
              {!isMinimized && (
                <button className="chat-action-btn" onClick={handleMinimize} aria-label="Minimize chat">
                  <Minus size={18} />
                </button>
              )}
              <button 
                className="chat-action-btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                  setIsMinimized(false);
                }} 
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="chat-messages-container">
                {messages.map(msg => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}
                {isTyping && (
                  <div className="chat-typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form className="chat-input-container" onSubmit={handleSubmit}>
                <input
                  type="text"
                  className="chat-input"
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="chat-send-btn" 
                  disabled={!inputValue.trim() || isTyping}
                  aria-label="Send message"
                >
                  <Send size={18} />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}
