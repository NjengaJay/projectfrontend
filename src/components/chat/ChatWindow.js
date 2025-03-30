import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { Sun, Moon, Maximize2, Minimize2 } from 'lucide-react';

const ChatWindow = ({ isDarkMode, setIsDarkMode, className = '' }) => {
  const { token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [preferences, setPreferences] = useState({
    routePreference: 'time',
    accessibilityRequired: false,
    scenicPriority: 0.5
  });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: text,
          preferences
        })
      });

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        ...data.response,
        sender: 'bot',
        timestamp: data.timestamp
      }]);

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date().toISOString()
      }]);
    }
  };

  const handlePreferencesChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getQuickReplies = () => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.sender === 'bot' && lastMessage?.quickReplies) {
      return lastMessage.quickReplies;
    }
    return [];
  };

  return (
    <div 
      className={`${className} fixed bottom-4 right-4 w-96 ${isExpanded ? 'h-[80vh]' : 'h-[500px]'} bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${isDarkMode ? 'dark' : ''}`}
    >
      {/* Header */}
      <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Chat with Travel Assistant</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            aria-label={isExpanded ? 'Minimize chat' : 'Expand chat'}
          >
            {isExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className={`flex-1 p-4 overflow-y-auto ${isExpanded ? 'h-[calc(100vh-16rem)]' : ''}`}>
        {messages.map(message => (
          <ChatMessage
            key={message.id}
            message={message}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        quickReplies={getQuickReplies()}
        onPreferencesChange={handlePreferencesChange}
      />
    </div>
  );
};

export default ChatWindow;
