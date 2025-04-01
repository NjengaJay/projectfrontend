import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';

interface FavoriteButtonProps {
  accommodationId: number;
  initialIsFavorite: boolean;
  onFavoriteChange?: (isFavorite: boolean) => void;
  className?: string;
}

export default function FavoriteButton({
  accommodationId,
  initialIsFavorite,
  onFavoriteChange,
  className = ''
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);
  const { addFavorite, removeFavorite } = useProfile();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent event bubbling if button is inside a link
    e.stopPropagation();
    
    if (isLoading) return;
    
    setIsLoading(true);
    const newState = !isFavorite;
    
    try {
      // Optimistic update
      setIsFavorite(newState);
      onFavoriteChange?.(newState);
      
      if (newState) {
        await addFavorite(accommodationId);
      } else {
        await removeFavorite(accommodationId);
      }
      
      // Show success toast
      // You can integrate your preferred toast library here
      
    } catch (error) {
      // Revert on error
      setIsFavorite(!newState);
      onFavoriteChange?.(!newState);
      
      // Show error toast
      console.error('Failed to update favorite status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`relative ${className}`}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-20 rounded-full"
          />
        )}
      </AnimatePresence>
      
      <motion.div
        whileTap={{ scale: 0.8 }}
        animate={isFavorite ? { scale: [1, 1.2, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Heart
          className={`w-6 h-6 transition-colors ${
            isFavorite
              ? 'fill-red-500 stroke-red-500'
              : 'stroke-current hover:stroke-red-500'
          }`}
        />
      </motion.div>
    </button>
  );
}
