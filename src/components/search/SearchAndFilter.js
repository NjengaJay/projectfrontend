import React, { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import { Search, Filter } from 'lucide-react';

const SearchAndFilter = ({ onSearch, onFilter, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    min_price: '',
    max_price: '',
    accessibility: {
      wheelchair_accessible: false,
      elevator_access: false,
      ground_floor: false,
      step_free_access: false
    },
    type: {
      hotel: false,
      apartment: false,
      hostel: false,
      guesthouse: false
    }
  });

  // Debounce the search to avoid too many API calls
  const debouncedSearch = useCallback(
    debounce((term, filters) => {
      onSearch(term, filters);
    }, 500),
    [onSearch]
  );

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    debouncedSearch(searchTerm, filters);
  }, [searchTerm, filters, debouncedSearch]);

  const handleFilterChange = useCallback((category, key) => {
    setFilters(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key]
      }
    }));
  }, []);

  const handlePriceChange = useCallback((type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
  }, []);

  const handleSearchChange = useCallback((e) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSearch(term, filters);
  }, [filters, debouncedSearch]);

  return (
    <div className="mb-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search accommodations..."
            className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-white dark:bg-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
            <div className="flex items-center mb-4">
              <Filter className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Filters</h3>
            </div>

            {/* Price Range */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price Range (€)</h4>
              <div className="flex space-x-4">
                <input
                  type="number"
                  value={filters.min_price}
                  onChange={(e) => handlePriceChange('min_price', e.target.value)}
                  placeholder="Min"
                  className="w-24 px-2 py-1 text-gray-700 bg-white dark:bg-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="number"
                  value={filters.max_price}
                  onChange={(e) => handlePriceChange('max_price', e.target.value)}
                  placeholder="Max"
                  className="w-24 px-2 py-1 text-gray-700 bg-white dark:bg-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Accessibility Features */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Accessibility</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(filters.accessibility).map(([key, value]) => (
                  <label key={key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={() => handleFilterChange('accessibility', key)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {key.replace(/_/g, ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Accommodation Types */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(filters.type).map(([key, value]) => (
                  <label key={key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={() => handleFilterChange('type', key)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Apply Filters'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchAndFilter;
