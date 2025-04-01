import React, { useState, useEffect } from 'react';
import ChatWindow from '../components/chat/ChatWindow';

const ChatPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Update the document's class when dark mode changes
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
            Travel Assistant Chat
          </h1>
          <div className="max-w-4xl mx-auto">
            <ChatWindow 
              isDarkMode={isDarkMode} 
              setIsDarkMode={setIsDarkMode}
              className="h-[calc(100vh-12rem)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
