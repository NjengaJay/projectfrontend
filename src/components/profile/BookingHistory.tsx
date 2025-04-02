import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { API_BASE_URL } from '../../config';

interface Booking {
  id: number;
  accommodation_id: number;
  check_in_date: string;
  check_out_date: string;
  status: 'confirmed' | 'canceled' | 'completed';
  accommodation: {
    name: string;
    location: string;
    image_url: string;
  };
}

interface PaginatedResponse {
  items: Booking[];
  total: number;
  pages: number;
  current_page: number;
}

export default function BookingHistory() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBookings(currentPage);
  }, [currentPage]);

  const fetchBookings = async (page: number) => {
    try {
      setLoading(true);
      const response = await axios.get<PaginatedResponse>(`${API_BASE_URL}/profile/bookings?page=${page}`);
      setBookings(response.data.items);
      setTotalPages(response.data.pages);
      setError(null);
    } catch (err) {
      setError('Failed to fetch booking history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'canceled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
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

  if (bookings.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 text-center">
        <Calendar className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-200">No bookings yet</h3>
        <p className="mt-1 text-sm text-gray-400">
          Start exploring accommodations to make your first booking.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="bg-gray-800 rounded-xl overflow-hidden shadow-lg"
        >
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <img
                className="h-48 w-full object-cover md:h-full md:w-48"
                src={booking.accommodation.image_url || 'https://placehold.co/200x200?text=No+Image'}
                alt={booking.accommodation.name}
              />
            </div>
            <div className="p-6 flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {booking.accommodation.name}
                  </h3>
                  <p className="mt-1 flex items-center text-gray-400">
                    <MapPin className="h-4 w-4 mr-1" />
                    {booking.accommodation.location}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(
                    booking.status
                  )}`}
                >
                  {booking.status}
                </span>
              </div>
              
              <div className="mt-4 flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Check-in: {new Date(booking.check_in_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Check-out: {new Date(booking.check_out_date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

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
