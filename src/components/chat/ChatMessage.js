import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Banknote, Accessibility, Camera } from 'lucide-react';

const ChatMessage = ({ message, fontSize }) => {
  const isBot = message.sender === 'bot';

  // Animation variants
  const variants = {
    hidden: { 
      opacity: 0,
      x: isBot ? -20 : 20,
      y: 10
    },
    visible: { 
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  // Render route information
  const renderRoute = (route) => {
    if (!route) return null;

    return (
      <div className="mt-3 bg-white dark:bg-gray-700 rounded-lg p-3 space-y-2">
        <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
          <MapPin className="mr-2" size={16} />
          Route Details
        </h4>
        {route.steps?.map((step, index) => (
          <div key={index} className="text-sm space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">
                {step.from_location} → {step.to_location}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {step.mode}
              </span>
            </div>
            <div className="flex space-x-4 text-xs">
              <span className="flex items-center">
                <Clock className="mr-1" size={12} />
                {Math.round(step.duration)} min
              </span>
              <span className="flex items-center">
                <Banknote className="mr-1" size={12} />
                {step.cost.toFixed(2)}
              </span>
              {step.accessibility_features?.length > 0 && (
                <span className="flex items-center">
                  <Accessibility className="mr-1" size={12} />
                  {step.accessibility_features.join(', ')}
                </span>
              )}
            </div>
            {step.scenic_rating > 7 && (
              <div className="text-xs text-green-600 dark:text-green-400">
                Scenic route with beautiful views!
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Render attractions
  const renderAttractions = (attractions) => {
    if (!attractions?.length) return null;

    return (
      <div className="mt-3 space-y-2">
        <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
          <Camera className="mr-2" size={16} />
          Nearby Attractions
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {attractions.map((attraction, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-700 rounded-lg p-2 text-sm"
            >
              <h5 className="font-medium text-gray-900 dark:text-white">
                {attraction.name}
              </h5>
              {attraction.description && (
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                  {attraction.description}
                </p>
              )}
              {attraction.accessibility && (
                <div className="flex items-center mt-1 text-xs text-blue-600 dark:text-blue-400">
                  <Accessibility className="mr-1" size={12} />
                  {attraction.accessibility}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
          isBot
            ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-tl-none'
            : 'bg-blue-500 text-white rounded-tr-none'
        }`}
        style={{ fontSize: fontSize === 'large' ? '1.1rem' : '1rem' }}
      >
        {/* Regular text message */}
        <p className="whitespace-pre-wrap break-words">{message.text}</p>

        {/* Route information */}
        {isBot && message.route && renderRoute(message.route)}

        {/* Attractions */}
        {isBot && message.attractions && renderAttractions(message.attractions)}

        {/* Sentiment indicator for reviews */}
        {isBot && message.sentiment && (
          <div className={`mt-2 text-sm ${
            message.sentiment === 'positive' 
              ? 'text-green-600 dark:text-green-400'
              : message.sentiment === 'negative'
              ? 'text-red-600 dark:text-red-400'
              : 'text-gray-600 dark:text-gray-400'
          }`}>
            Sentiment: {message.sentiment}
          </div>
        )}

        {/* Timestamp */}
        <div
          className={`text-xs mt-1 ${
            isBot ? 'text-gray-500 dark:text-gray-400' : 'text-blue-100'
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
