import { Bot, User } from 'lucide-react';
import './ChatMessage.css';

function safeText(value) {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return String(value);
  }

  if (typeof value === 'object') {
    if (typeof value.answer === 'string') {
      return value.answer;
    }

    if (typeof value.message === 'string') {
      return value.message;
    }

    if (typeof value.text === 'string') {
      return value.text;
    }

    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return 'Unable to display this response.';
    }
  }

  return String(value);
}

export default function ChatMessage({ message }) {
  const isBot = message?.sender === 'bot';
  const text = safeText(message?.text);

  return (
    <div
      className={`chat-message ${
        isBot
          ? 'chat-message-bot'
          : 'chat-message-user'
      }`}
    >
      <div className="chat-avatar">
        {isBot ? (
          <Bot size={18} />
        ) : (
          <User size={18} />
        )}
      </div>

      <div className="chat-bubble">
        <p className="chat-text">{text}</p>

        {Array.isArray(message?.suggestions) &&
          message.suggestions.length > 0 && (
            <div className="chat-suggestions">
              {message.suggestions.map((suggestion, index) => (
                <a
                  key={index}
                  href={suggestion?.url || '#'}
                  className="chat-suggestion-link"
                >
                  {safeText(suggestion?.label)}
                </a>
              ))}
            </div>
          )}
      </div>
    </div>
  );
}