import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config';

const FavoriteButton = ({ itemId, itemType, initialIsFavorite = false, onFavoriteChange, className = '' }) => {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const { token } = useAuth();

  useEffect(() => {
    setIsFavorite(initialIsFavorite);
  }, [initialIsFavorite]);

  const toggleFavorite = async () => {
    if (!token) {
      // Handle unauthenticated user - maybe show login dialog
      return;
    }

    try {
      if (!isFavorite) {
        // Add to favorites
        const response = await fetch(`${API_BASE_URL}/favorites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            type: itemType,
            [`${itemType}_id`]: itemId
          })
        });

        if (response.ok) {
          setIsFavorite(true);
          if (onFavoriteChange) onFavoriteChange(true);
        }
      } else {
        // First get the favorite ID
        const response = await fetch(`${API_BASE_URL}/favorites?type=${itemType}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const favorites = await response.json();
          const favorite = favorites.find(f => f[`${itemType}_id`] === itemId);
          
          if (favorite) {
            // Remove from favorites
            const deleteResponse = await fetch(`${API_BASE_URL}/favorites/${favorite.id}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });

            if (deleteResponse.ok) {
              setIsFavorite(false);
              if (onFavoriteChange) onFavoriteChange(false);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`p-2 rounded-full transition-colors ${className}`}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        className={`w-6 h-6 ${isFavorite ? 'fill-current text-red-500' : 'text-gray-300 hover:text-red-500'}`}
      />
    </button>
  );
};

export default FavoriteButton;
