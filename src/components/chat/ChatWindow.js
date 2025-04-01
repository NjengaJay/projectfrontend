import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

const API_URL = 'http://localhost:8000';

const ChatWindow = ({ isDarkMode, setIsDarkMode, className = '' }) => {
  const { token } = useAuth();
  const [messages, setMessages] = useState([]);
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
      const response = await fetch(`${API_URL}/api/chat`, {
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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
      className={`${className} fixed bottom-1/2 right-1/2 transform translate-x-1/2 translate-y-1/2 w-[80vw] max-w-[1200px] h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${isDarkMode ? 'dark' : ''}`}
    >
      {/* Header */}
      <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Chat with Travel Assistant</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
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