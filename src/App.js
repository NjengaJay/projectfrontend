import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import Login from './components/auth/Login';
import SearchAndFilter from './components/search/SearchAndFilter';
import AccommodationList from './components/accommodation/AccommodationList';
import AccommodationDetail from './components/accommodation/AccommodationDetail';
import ChatPage from './pages/ChatPage';
import NavBar from './components/navigation/NavBar';
import { accommodationService } from './services/accommodationService';
import './App.css';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    min_price: 0,
    max_price: 500,
    accessibility: {},
    type: {}
  });

  // Use ref to track if this is initial mount
  const isInitialMount = useRef(true);

  const handleSearch = useCallback(async (searchTerm, searchFilters) => {
    if (loading) return;
    
    setLoading(true);
    setError(null);

    try {
      const data = await accommodationService.searchAccommodations({
        searchTerm,
        min_price: searchFilters.min_price || 0,
        max_price: searchFilters.max_price || 500,
        accessibility: searchFilters.accessibility || {},
        type: searchFilters.type || {},
        page: currentPage,
        per_page: 10
      });
      setSearchResults(data.accommodations || []);
      setTotalResults(data.total || 0);
    } catch (err) {
      setError(err.message);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, loading]);

  const handleFilter = useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
    handleSearch('', newFilters);
  }, [handleSearch]);

  // Combined effect for both initial load and page changes
  useEffect(() => {
    if (isInitialMount.current) {
      // Initial load
      handleSearch('', filters);
      isInitialMount.current = false;
    } else {
      // Subsequent page changes
      const timeoutId = setTimeout(() => {
        handleSearch('', filters);
      }, 100); // Add small debounce
      return () => clearTimeout(timeoutId);
    }
  }, [currentPage, filters]); // Remove handleSearch from dependencies

  return (
    <Router>
      <AuthProvider>
        <ProfileProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <NavBar />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/accommodation/:id" element={<AccommodationDetail />} />
              <Route
                path="/"
                element={
                  <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
                      Find Your Perfect Stay
                    </h1>
                    <SearchAndFilter 
                      onSearch={handleSearch}
                      onFilter={handleFilter}
                      loading={loading}
                    />
                    {error && (
                      <div className="text-red-500 mb-4">{error}</div>
                    )}
                    <AccommodationList 
                      accommodations={searchResults}
                      loading={loading}
                      total={totalResults}
                      currentPage={currentPage}
                      onPageChange={setCurrentPage}
                    />
                    {totalResults > 0 && (
                      <div className="text-center text-gray-600 dark:text-gray-400 mt-4">
                        Showing {searchResults.length} of {totalResults} results
                      </div>
                    )}
                  </div>
                }
              />
            </Routes>
          </div>
        </ProfileProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
