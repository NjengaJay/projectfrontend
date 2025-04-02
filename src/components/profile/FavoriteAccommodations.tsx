import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

interface Favorite {
  id: number;
  accommodation_id: number;
  created_at: string;
  accommodation: {
    name: string;
    location: string;
    image_url: string;
    price_range: string;
  };
}

interface PaginatedResponse {
  items: Favorite[];
  total: number;
  pages: number;
  current_page: number;
}

export default function FavoriteAccommodations() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchFavorites(currentPage);
  }, [currentPage]);

  const fetchFavorites = async (page: number) => {
    try {
      setLoading(true);
      const response = await axios.get<PaginatedResponse>(`${API_BASE_URL}/profile/favorites?page=${page}`);
      setFavorites(response.data.items);
      setTotalPages(response.data.pages);
      setError(null);
    } catch (err) {
      setError('Failed to fetch favorites');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (id: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/profile/favorites/${id}`);
      setFavorites(prevFavorites => prevFavorites.filter(favorite => favorite.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to remove favorite');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-200">No favorites</h3>
        <p className="mt-1 text-sm text-gray-400">
          Start exploring accommodations to add them to your favorites.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map(favorite => (
          <div
            key={favorite.id}
            className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-105"
          >
            <div className="relative h-48">
              <img
                src={favorite.accommodation.image_url}
                alt={favorite.accommodation.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => removeFavorite(favorite.accommodation_id)}
                className="absolute top-2 right-2 p-2 rounded-full bg-gray-900 bg-opacity-50 
                           hover:bg-opacity-75 transition-colors"
                aria-label="Remove from favorites"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-white">
                {favorite.accommodation.name}
              </h3>
              <p className="mt-1 text-sm text-gray-400">
                {favorite.accommodation.location}
              </p>
              <p className="mt-2 text-sm font-medium text-blue-400">
                {favorite.accommodation.price_range}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md
                     disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md
                     disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
