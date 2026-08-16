import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minus } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { aiService } from '../../services/api/aiService';
import './ChatWidget.css';

function normalizeText(value) {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  // Prevent React from crashing if the backend ever returns an object.
  if (typeof value === 'object') {
    if (typeof value.answer === 'string') return value.answer;
    if (typeof value.message === 'string') return value.message;
    if (typeof value.text === 'string') return value.text;

    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return 'The AI returned an unreadable response.';
    }
  }

  return String(value);
}

export default function ChatWidget({ productId = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Hi! Ask me about products, ingredients, materials, or comparisons.',
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }, [messages, isTyping]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const question = inputValue.trim();

    if (!question || isTyping) {
      return;
    }

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: question,
    };

    // Immediately show the user's message.
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const history = messages
        .filter(
          (message) =>
            message.sender === 'user' || message.sender === 'bot'
        )
        .map((message) => ({
          role: message.sender === 'bot' ? 'assistant' : 'user',
          content: normalizeText(message.text),
        }))
        .filter((message) => message.content)
        .slice(-10);

      const data = await aiService.chatWithAI(
        question,
        productId,
        history
      );

      console.log('AI response:', data);

      let answer = '';

      if (data) {
        if (typeof data.answer === 'string') {
          answer = data.answer;
        } else if (typeof data.message === 'string') {
          answer = data.message;
        } else if (typeof data.text === 'string') {
          answer = data.text;
        } else if (data.answer !== undefined) {
          answer = normalizeText(data.answer);
        }
      }

      if (!answer.trim()) {
        answer =
          'The AI returned an empty response. Please try asking the question again.';
      }

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: answer,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error('AI chat error:', error);

      let errorMessage =
        'AI is currently unavailable. Please try again.';

      if (error?.response?.data?.message) {
        errorMessage = normalizeText(error.response.data.message);
      } else if (error?.response?.data?.error) {
        errorMessage = normalizeText(error.response.data.error);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          sender: 'bot',
          text: errorMessage,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div
      className={`chat-widget-container ${
        isOpen ? 'chat-open' : ''
      } ${isMinimized ? 'chat-minimized' : ''}`}
    >
      {!isOpen && (
        <button
          className="chat-fab slide-up"
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Assistant"
          type="button"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {isOpen && (
        <div
          className={`chat-window ${
            isMinimized ? 'minimized' : ''
          } slide-up`}
        >
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-header-avatar">
                <MessageCircle size={16} />
              </div>

              <div>
                <h3 className="chat-header-title">
                  AI Assistant
                </h3>

                {!isMinimized && (
                  <p className="chat-header-status">
                    Online
                  </p>
                )}
              </div>
            </div>

            <div className="chat-header-actions">
              {!isMinimized && (
                <button
                  className="chat-action-btn"
                  onClick={() => setIsMinimized(true)}
                  aria-label="Minimize"
                  type="button"
                >
                  <Minus size={18} />
                </button>
              )}

              <button
                className="chat-action-btn"
                onClick={() => {
                  setIsOpen(false);
                  setIsMinimized(false);
                }}
                aria-label="Close"
                type="button"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="chat-messages-container">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={{
                      ...message,
                      text: normalizeText(message.text),
                    }}
                  />
                ))}

                {isTyping && (
                  <div className="chat-typing-indicator">
                    <span />
                    <span />
                    <span />
                  </div>
                )}

                <div ref={endRef} />
              </div>

              <form
                className="chat-input-container"
                onSubmit={handleSubmit}
              >
                <input
                  className="chat-input"
                  value={inputValue}
                  onChange={(e) =>
                    setInputValue(e.target.value)
                  }
                  placeholder="Ask about this product..."
                  disabled={isTyping}
                />

                <button
                  className="chat-send-btn"
                  type="submit"
                  disabled={
                    !inputValue.trim() || isTyping
                  }
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