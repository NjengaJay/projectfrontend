import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Accessibility,
  Volume2,
  Eye,
  ArrowUpDown,
  FileText,
  GripHorizontal,
  Bell,
  Heart,
  Bath,
  Lightbulb,
  Phone,
  AlertCircle
} from 'lucide-react';

// Accessibility features configuration with categories, icons, and descriptions
const accessibilityConfig = {
  mobility: {
    color: 'green',
    features: {
      wheelchairAccessible: {
        icon: Accessibility,
        name: 'Wheelchair Accessible',
        description: 'Full wheelchair accessibility throughout the property including ramps and wide doorways'
      },
      elevator: {
        icon: ArrowUpDown,
        name: 'Elevator Access',
        description: 'Accessible elevators with Braille buttons and audio announcements'
      },
      grabBars: {
        icon: GripHorizontal,
        name: 'Grab Bars',
        description: 'Bathroom equipped with grab bars and raised toilet seats'
      }
    }
  },
  visual: {
    color: 'yellow',
    features: {
      brailleSignage: {
        icon: FileText,
        name: 'Braille Signage',
        description: 'Braille signage throughout the property for easy navigation'
      },
      audioGuides: {
        icon: Volume2,
        name: 'Audio Guides',
        description: 'Audio descriptions and guides available for property navigation'
      },
      visualAids: {
        icon: Eye,
        name: 'Visual Aids',
        description: 'High contrast signage and tactile floor indicators'
      }
    }
  },
  hearing: {
    color: 'blue',
    features: {
      visualAlerts: {
        icon: Bell,
        name: 'Visual Alerts',
        description: 'Visual fire alarms and doorbell notifications'
      },
      hearingLoop: {
        icon: Heart,
        name: 'Hearing Loop',
        description: 'Hearing loop system available in common areas'
      }
    }
  },
  general: {
    color: 'purple',
    features: {
      emergencySystem: {
        icon: AlertCircle,
        name: 'Emergency System',
        description: '24/7 emergency response system with multiple ways to call for help'
      },
      accessibleBathroom: {
        icon: Bath,
        name: 'Accessible Bathroom',
        description: 'Roll-in shower, lowered sink, and emergency pull cords'
      },
      adaptiveLighting: {
        icon: Lightbulb,
        name: 'Adaptive Lighting',
        description: 'Adjustable lighting levels and motion-sensor lights'
      },
      assistanceCall: {
        icon: Phone,
        name: 'Assistance Call',
        description: '24/7 staff available to assist with accessibility needs'
      }
    }
  }
};

// Tooltip component with animation
const Tooltip = ({ children, content, isVisible }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg w-48"
      >
        {content}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900" />
      </motion.div>
    )}
  </AnimatePresence>
);

const AccessibilityFeatures = ({ features }) => {
  const [activeTooltip, setActiveTooltip] = useState(null);

  // Get category color class
  const getCategoryColorClass = (category, isBackground = true) => {
    const colors = {
      mobility: isBackground ? 'bg-green-100 dark:bg-green-900/20' : 'text-green-600 dark:text-green-400',
      visual: isBackground ? 'bg-yellow-100 dark:bg-yellow-900/20' : 'text-yellow-600 dark:text-yellow-400',
      hearing: isBackground ? 'bg-blue-100 dark:bg-blue-900/20' : 'text-blue-600 dark:text-blue-400',
      general: isBackground ? 'bg-purple-100 dark:bg-purple-900/20' : 'text-purple-600 dark:text-purple-400'
    };
    return colors[category] || colors.general;
  };

  return (
    <div className="space-y-6">
      {Object.entries(accessibilityConfig).map(([category, categoryData]) => {
        const categoryFeatures = features[category] || [];
        if (categoryFeatures.length === 0) return null;

        return (
          <div key={category} className="space-y-4">
            <h3 className="text-xl font-semibold capitalize">
              {category} Accessibility
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryFeatures.map(feature => {
                const featureConfig = categoryData.features[feature.id];
                if (!featureConfig) return null;

                const IconComponent = featureConfig.icon;
                return (
                  <div
                    key={feature.id}
                    className="relative"
                    onMouseEnter={() => setActiveTooltip(feature.id)}
                    onMouseLeave={() => setActiveTooltip(null)}
                    onFocus={() => setActiveTooltip(feature.id)}
                    onBlur={() => setActiveTooltip(null)}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`flex items-start gap-3 p-4 ${getCategoryColorClass(category)} rounded-lg cursor-help`}
                    >
                      <div className={`p-2 ${getCategoryColorClass(category, false)} rounded-full`}>
                        <IconComponent size={24} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {feature.name}
                        </h4>
                      </div>
                      <Tooltip
                        content={featureConfig.description}
                        isVisible={activeTooltip === feature.id}
                      />
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AccessibilityFeatures;
