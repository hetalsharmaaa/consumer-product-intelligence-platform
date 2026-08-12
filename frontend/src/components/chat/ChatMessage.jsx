import { Bot, User } from 'lucide-react';
import './ChatMessage.css';

export default function ChatMessage({ message }) {
  const isBot = message.sender === 'bot';

  return (
    <div className={`chat-message ${isBot ? 'chat-message-bot' : 'chat-message-user'}`}>
      <div className="chat-avatar">
        {isBot ? <Bot size={18} /> : <User size={18} />}
      </div>
      <div className="chat-bubble">
        {/* Support simple markdown-like formatting if needed, but for now just text */}
        <p className="chat-text">{message.text}</p>
        
        {/* If there are suggested products or links, render them */}
        {message.suggestions && message.suggestions.length > 0 && (
          <div className="chat-suggestions">
            {message.suggestions.map((sug, i) => (
              <a key={i} href={sug.url} className="chat-suggestion-link">
                {sug.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
