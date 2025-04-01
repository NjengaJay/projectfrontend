import React from 'react';
import { useProfile } from '../../context/ProfileContext';

interface AccessibilityPreferences {
  wheelchair_access?: boolean;
  screen_reader?: boolean;
  high_contrast?: boolean;
}

interface Profile {
  accessibility: AccessibilityPreferences;
}

export default function AccessibilityPreferences() {
  const { profile, updateAccessibility } = useProfile();

  const handleToggle = async (key: keyof AccessibilityPreferences) => {
    if (!profile) return;
    
    try {
      await updateAccessibility({
        [key]: !profile.accessibility?.[key]
      });
    } catch (error) {
      console.error('Failed to update accessibility preference:', error);
    }
  };

  const preferences = [
    {
      id: 'wheelchair_access',
      label: 'Wheelchair Access',
      description: 'Show wheelchair-accessible accommodations and routes',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M19 13v-2c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v2" />
          <circle cx="12" cy="8" r="2" />
          <path d="M12 10v12" />
        </svg>
      ),
    },
    {
      id: 'screen_reader',
      label: 'Screen Reader Support',
      description: 'Enable enhanced screen reader compatibility',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
    {
      id: 'high_contrast',
      label: 'High Contrast Mode',
      description: 'Increase contrast for better visibility',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
        </svg>
      ),
    },
  ] as const;

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Accessibility Preferences
        </h2>
        <div className="space-y-4">
          {preferences.map((pref) => (
            <div
              key={pref.id}
              className="flex items-start space-x-4 p-4 bg-gray-700 rounded-lg transition-colors
                         hover:bg-gray-600"
            >
              <div className="flex-shrink-0 text-blue-500">{pref.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor={pref.id}
                    className="text-lg font-medium text-white cursor-pointer"
                  >
                    {pref.label}
                  </label>
                  <button
                    role="switch"
                    aria-checked={profile.accessibility?.[pref.id as keyof AccessibilityPreferences] ?? false}
                    id={pref.id}
                    onClick={() => handleToggle(pref.id as keyof AccessibilityPreferences)}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full
                      transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
                      focus:ring-offset-2 focus:ring-offset-gray-800
                      ${profile.accessibility?.[pref.id as keyof AccessibilityPreferences] ? 'bg-blue-600' : 'bg-gray-500'}
                    `}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${profile.accessibility?.[pref.id as keyof AccessibilityPreferences] ? 'translate-x-6' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-400">{pref.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
