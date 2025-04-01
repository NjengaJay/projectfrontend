import React from 'react';
import { Link } from 'react-router-dom';
import { Accessibility, Banknote } from 'lucide-react';
import FavoriteButton from '../common/FavoriteButton';
import { useProfile } from '../../context/ProfileContext';

const AccommodationList = ({ accommodations, loading, total, currentPage, onPageChange }) => {
  const { checkIsFavorite } = useProfile();

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!accommodations || accommodations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600 dark:text-gray-400">
        No accommodations found
      </div>
    );
  }

  const renderAccessibilityFeatures = (accessibility) => {
    if (!accessibility) return null;

    return Object.entries(accessibility)
      .filter(([_, value]) => value)
      .map(([key]) => (
        <span
          key={key}
          className="inline-flex items-center px-2 py-1 mr-2 text-xs font-medium text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-100 rounded-full"
        >
          <Accessibility className="w-3 h-3 mr-1" />
          {key.replace(/_/g, ' ')}
        </span>
      ));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accommodations.map((accommodation) => (
          <div
            key={accommodation.id}
            className="block bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="relative">
              <img
                src={accommodation.image_url || 'https://placehold.co/400x300?text=No+Image'}
                alt={accommodation.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <h3 className="text-xl font-semibold text-white">
                  {accommodation.name}
                </h3>
              </div>
              <div className="absolute top-2 right-2">
                <FavoriteButton
                  accommodationId={accommodation.id}
                  initialIsFavorite={checkIsFavorite(accommodation.id, 'accommodation')}
                  className="bg-white/10 backdrop-blur-sm p-2 rounded-full hover:bg-white/20 transition-colors"
                />
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Banknote className="w-5 h-5 mr-2" />
                <span>€{accommodation.price_range?.min || 'N/A'} per night</span>
              </div>

              <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                {accommodation.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {renderAccessibilityFeatures(accommodation.accessibility)}
              </div>

              <Link
                to={`/accommodation/${accommodation.id}`}
                className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {total > accommodations.length && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-2 text-gray-600 dark:text-gray-400">
              Page {currentPage}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={accommodations.length < 10}
              className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default AccommodationList;
