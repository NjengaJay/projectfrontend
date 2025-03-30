import React, { useState, useRef, useEffect } from 'react';
import { Send, Settings } from 'lucide-react';

const ChatInput = ({ onSendMessage, quickReplies, onPreferencesChange }) => {
  const [message, setMessage] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isComposing) {
      onSendMessage(message.trim());
      setMessage('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t dark:border-gray-700 bg-white dark:bg-gray-800">
      {/* Quick Replies */}
      {quickReplies?.length > 0 && (
        <div className="p-2 flex flex-wrap gap-2 border-b dark:border-gray-700">
          {quickReplies.map((reply, index) => (
            <button
              key={index}
              onClick={() => onSendMessage(reply)}
              className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Preferences Panel */}
      {showPreferences && (
        <div className="p-4 border-b dark:border-gray-700 space-y-3">
          <h4 className="font-medium text-gray-900 dark:text-white">Travel Preferences</h4>
          <div className="space-y-2">
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300">Route Preference</label>
              <select
                onChange={(e) => onPreferencesChange('routePreference', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm"
              >
                <option value="time">Fastest Route</option>
                <option value="cost">Cheapest Route</option>
                <option value="scenic">Scenic Route</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="accessibility"
                onChange={(e) => onPreferencesChange('accessibilityRequired', e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600"
              />
              <label htmlFor="accessibility" className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                Require Accessibility Features
              </label>
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300">
                Scenic Priority (0-10)
              </label>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                onChange={(e) => onPreferencesChange('scenicPriority', parseFloat(e.target.value) / 10)}
                className="mt-1 block w-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4">
        <div className="relative flex items-end space-x-2">
          <button
            type="button"
            onClick={() => setShowPreferences(!showPreferences)}
            className="p-3 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Toggle preferences"
          >
            <Settings size={20} />
          </button>
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            placeholder="Type your message..."
            className="flex-1 resize-none max-h-32 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            rows={1}
            aria-label="Chat message input"
          />
          <button
            type="submit"
            disabled={!message.trim() || isComposing}
            className={`p-3 rounded-lg transition-colors ${
              message.trim() && !isComposing
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
            aria-label="Send message"
          >
            <Send size={20} />
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Press Enter to send, Shift + Enter for new line
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
