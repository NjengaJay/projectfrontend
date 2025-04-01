import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface AccessibilityPreferences {
  wheelchair_access: boolean;
  screen_reader: boolean;
  high_contrast: boolean;
}

interface Profile {
  id: number;
  username: string;
  email: string;
  profile_picture?: string;
  bio?: string;
  accessibility?: AccessibilityPreferences;
}

interface FavoriteAccommodation {
  id: number;
  accommodation_id: number;
  created_at: string;
}

interface ProfileContextType {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  updateAccessibility: (prefs: Partial<AccessibilityPreferences>) => Promise<void>;
  uploadProfilePicture: (file: File) => Promise<void>;
  addFavorite: (accommodationId: number) => Promise<void>;
  removeFavorite: (accommodationId: number) => Promise<void>;
  getFavoriteStatus: (accommodationId: number) => Promise<boolean>;
  favorites: Set<number>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchProfile();
    fetchFavorites();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/profile');
      setProfile(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await axios.get<{ items: FavoriteAccommodation[] }>('/api/profile/favorites');
      const favoriteIds = new Set(response.data.items.map(fav => fav.accommodation_id));
      setFavorites(favoriteIds);
    } catch (err) {
      console.error('Failed to fetch favorites:', err);
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    try {
      const response = await axios.put('/api/profile', data);
      setProfile(prev => ({ ...prev!, ...response.data }));
      setError(null);
    } catch (err) {
      setError('Failed to update profile');
      throw err;
    }
  };

  const updateAccessibility = async (prefs: Partial<AccessibilityPreferences>) => {
    try {
      const response = await axios.put('/api/profile/accessibility', prefs);
      setProfile(prev => ({
        ...prev!,
        accessibility: { ...prev!.accessibility!, ...response.data }
      }));
      setError(null);
    } catch (err) {
      setError('Failed to update accessibility preferences');
      throw err;
    }
  };

  const uploadProfilePicture = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/profile/picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setProfile(prev => ({ ...prev!, profile_picture: response.data.path }));
      setError(null);
    } catch (err) {
      setError('Failed to upload profile picture');
      throw err;
    }
  };

  const addFavorite = async (accommodationId: number) => {
    try {
      await axios.post(`/api/profile/favorites/${accommodationId}`);
      setFavorites(prev => new Set([...prev, accommodationId]));
    } catch (err) {
      throw new Error('Failed to add favorite');
    }
  };

  const removeFavorite = async (accommodationId: number) => {
    try {
      await axios.delete(`/api/profile/favorites/${accommodationId}`);
      setFavorites(prev => {
        const newSet = new Set(prev);
        newSet.delete(accommodationId);
        return newSet;
      });
    } catch (err) {
      throw new Error('Failed to remove favorite');
    }
  };

  const getFavoriteStatus = async (accommodationId: number): Promise<boolean> => {
    return favorites.has(accommodationId);
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        error,
        updateProfile,
        updateAccessibility,
        uploadProfilePicture,
        addFavorite,
        removeFavorite,
        getFavoriteStatus,
        favorites,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
