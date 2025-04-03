import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import AuthLayout from './components/auth/AuthLayout';
import AuthGuard from './components/auth/AuthGuard';
import SearchAndFilter from './components/search/SearchAndFilter';
import AccommodationList from './components/accommodation/AccommodationList';
import AccommodationDetail from './components/accommodation/AccommodationDetail';
import ChatPage from './pages/ChatPage';
import NavBar from './components/navigation/NavBar';
import ProfilePage from './components/profile/ProfilePageWrapper';
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

  const loadingRef = useRef(false);
  
  // Memoize filters to prevent unnecessary re-renders
  const memoizedFilters = useRef(filters);
  
  // Update memoized filters when they change
  useEffect(() => {
    memoizedFilters.current = filters;
  }, [filters]);

  const handleSearch = useCallback(async (searchTerm, searchFilters) => {
    if (loadingRef.current) return;
    
    loadingRef.current = true;
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
      setSearchResults(data.items || []); 
      setTotalResults(data.total || 0);
    } catch (err) {
      setError(err.message);
      setSearchResults([]);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [currentPage]); 

  const handleFilter = useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); 
  }, []); 

  // Effect for initial load and filter changes
  useEffect(() => {
    if (!loadingRef.current) {
      handleSearch('', filters);
    }
  }, [filters, handleSearch]);

  return (
    <Router>
      <AuthProvider>
        <ProfileProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <NavBar />
            <Routes>
              <Route path="/login" element={<AuthLayout />} />
              <Route path="/register" element={<AuthLayout isRegister />} />
              
              {/* Protected Routes */}
              <Route element={<AuthGuard />}>
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/profile" element={<ProfilePage />} />
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
                        filters={filters}
                        loading={loading}
                      />
                      <AccommodationList
                        accommodations={searchResults}
                        loading={loading}
                        error={error}
                        totalResults={totalResults}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                      />
                    </div>
                  }
                />
              </Route>

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </ProfileProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
