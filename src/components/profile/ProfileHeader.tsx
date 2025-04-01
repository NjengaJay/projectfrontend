import React, { useRef } from 'react';
import { useProfile } from '../../context/ProfileContext';

export default function ProfileHeader() {
  const { profile, uploadProfilePicture } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await uploadProfilePicture(file);
      } catch (error) {
        console.error('Failed to upload profile picture:', error);
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
        {/* Profile Picture */}
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-700">
            {profile?.profile_picture ? (
              <img
                src={profile.profile_picture}
                alt={`${profile.username}'s profile`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg
                  className="w-16 h-16"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            )}
          </div>
          
          {/* Upload Button */}
          <button
            onClick={handleUploadClick}
            className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 shadow-lg
                     hover:bg-blue-700 transition-colors duration-200"
            aria-label="Upload profile picture"
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            aria-label="Upload profile picture"
          />
        </div>

        {/* User Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-bold text-white">{profile?.username}</h1>
          <p className="text-gray-400">{profile?.email}</p>
          {profile?.bio && (
            <p className="mt-2 text-gray-300">{profile.bio}</p>
          )}
        </div>
      </div>
    </div>
  );
}
