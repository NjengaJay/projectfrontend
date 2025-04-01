import React, { useState } from 'react';
import { useProfile } from '../../context/ProfileContext';
import ProfileHeader from './ProfileHeader';
import AccessibilityPreferences from './AccessibilityPreferences';
import FavoriteAccommodations from './FavoriteAccommodations';
import BookingHistory from './BookingHistory';

const tabs = [
  { id: 'preferences', label: 'Accessibility' },
  { id: 'favorites', label: 'Favorites' },
  { id: 'history', label: 'Booking History' }
] as const;

type TabType = typeof tabs[number]['id'];

export default function ProfilePage() {
  const { profile, loading, error } = useProfile();
  const [activeTab, setActiveTab] = useState<TabType>('preferences');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-red-500 flex items-center justify-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <ProfileHeader />
        
        {/* Tab Navigation */}
        <nav className="flex space-x-1 rounded-xl bg-gray-800 p-1 mt-8" role="tablist">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              role="tab"
              aria-selected={activeTab === id}
              aria-controls={`${id}-panel`}
              className={`
                w-full rounded-lg py-2.5 text-sm font-medium leading-5
                ${activeTab === id
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }
                transition-all duration-200 ease-in-out
              `}
              onClick={() => setActiveTab(id)}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Tab Panels */}
        <div className="mt-8" role="tabpanel" aria-labelledby={`${activeTab}-tab`}>
          {activeTab === 'preferences' && <AccessibilityPreferences />}
          {activeTab === 'favorites' && <FavoriteAccommodations />}
          {activeTab === 'history' && <BookingHistory />}
        </div>
      </div>
    </div>
  );
}
