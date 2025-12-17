'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShirt, faUser, faSpinner, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { flowiseService, ChatMessage } from '@/services/flowiseService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Array<{
    pageContent: string;
    metadata: { [key: string]: any };
  }>;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Build history from previous messages
      const history: Array<{ question: string; answer: string }> = [];
      for (let i = 0; i < messages.length; i += 2) {
        if (messages[i].role === 'user' && messages[i + 1]?.role === 'assistant') {
          history.push({
            question: messages[i].content,
            answer: messages[i + 1].content,
          });
        }
      }

      const response = await flowiseService.sendMessage(userMessage.content, history);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text,
        timestamp: new Date(),
        sources: response.sourceDocuments,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setError(err.message || 'Failed to get response. Please check your Flowise configuration.');
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${err.message || 'Failed to get response. Please check your Flowise configuration.'}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-container">
      {/* Messages Area */}
      <div className="messages-area">
        {messages.length === 0 && (
          <div className="empty-state">
            <FontAwesomeIcon icon={faShirt} className="empty-state-icon" />
            <h2 className="empty-state-title">Welcome to KIAN2 Clothing</h2>
            <p className="empty-state-text">
              Ask me anything about our clothing store! I can help you with product information, 
              sizing, pricing, store hours, and more. Powered by Flowise with RAG capabilities.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`message-container ${
              message.role === 'user' ? 'message-user' : 'message-assistant'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="message-avatar message-avatar-bot">
                <FontAwesomeIcon icon={faShirt} className="message-avatar-icon" />
              </div>
            )}

            <div
              className={`message-bubble ${
                message.role === 'user'
                  ? 'message-bubble-user'
                  : 'message-bubble-assistant'
              }`}
            >
              <p className="message-content">{message.content}</p>
              
              {message.sources && message.sources.length > 0 && (
                <div className="message-sources">
                  <p className="message-sources-title">Sources:</p>
                  <div className="message-sources-list">
                    {message.sources.slice(0, 3).map((source, idx) => (
                      <div key={idx} className="message-source-item">
                        <p className="message-source-text">{source.pageContent.substring(0, 100)}...</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="message-timestamp">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>

            {message.role === 'user' && (
              <div className="message-avatar message-avatar-user">
                <FontAwesomeIcon icon={faUser} className="message-avatar-icon message-avatar-icon-user" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="loading-container">
            <div className="message-avatar message-avatar-bot">
              <FontAwesomeIcon icon={faShirt} className="message-avatar-icon" />
            </div>
            <div className="loading-bubble">
              <FontAwesomeIcon icon={faSpinner} className="loading-spinner" spin />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-container">
          <p className="error-text">{error}</p>
        </div>
      )}

      {/* Input Area */}
      <div className="input-area">
        <div className="input-wrapper">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isLoading}
            className="chat-input"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="send-button"
          >
            {isLoading ? (
              <FontAwesomeIcon icon={faSpinner} className="send-button-icon loading-spinner" spin />
            ) : (
              <>
                <FontAwesomeIcon icon={faPaperPlane} className="send-button-icon" />
                <span className="send-button-text">Send</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

