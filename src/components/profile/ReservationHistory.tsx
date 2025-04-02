import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { Calendar, MapPin, Users, AlertCircle } from 'lucide-react';

interface Accommodation {
  id: number;
  name: string;
  location: string;
  image_url: string;
  price_range: {
    min: number;
    max: number;
  } | number;
}

interface Reservation {
  id: number;
  accommodation_id: number;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  status: string;
  created_at: string;
  accommodation: Accommodation;
}

interface PaginatedResponse {
  items: Reservation[];
  total: number;
  pages: number;
  current_page: number;
}

const ReservationHistory: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchReservations(currentPage);
  }, [currentPage]);

  const fetchReservations = async (page: number) => {
    try {
      setLoading(true);
      const response = await axios.get<PaginatedResponse>(`${API_BASE_URL}/reservations?page=${page}`);
      setReservations(response.data.items);
      setTotalPages(response.data.pages);
      setError(null);
    } catch (err) {
      setError('Failed to fetch reservations');
    } finally {
      setLoading(false);
    }
  };

  const cancelReservation = async (id: number) => {
    try {
      await axios.post(`${API_BASE_URL}/reservations/${id}/cancel`);
      setReservations(prevReservations =>
        prevReservations.map(res =>
          res.id === id ? { ...res, status: 'cancelled' } : res
        )
      );
      setError(null);
    } catch (err) {
      setError('Failed to cancel reservation');
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-800 rounded-lg p-4 h-48" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => fetchReservations(currentPage)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Reservations Yet</h3>
        <p className="text-gray-400">
          When you reserve accommodations, they will appear here.
        </p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {reservations.map(reservation => (
        <div
          key={reservation.id}
          className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
        >
          <div className="md:flex">
            <div className="md:w-1/3">
              <img
                src={reservation.accommodation.image_url || 'https://placehold.co/400x300?text=No+Image'}
                alt={reservation.accommodation.name}
                className="w-full h-48 md:h-full object-cover"
              />
            </div>
            <div className="p-6 md:w-2/3">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-white">
                  {reservation.accommodation.name}
                </h3>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  reservation.status === 'active' 
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                </span>
              </div>

              <div className="space-y-3 text-gray-300 mb-6">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{reservation.accommodation.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>
                    {formatDate(reservation.check_in)} - {formatDate(reservation.check_out)}
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  <span>{reservation.guests} guests</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-white">
                  <span className="text-gray-400">Total Price:</span>
                  <span className="ml-2 text-xl font-semibold">€{reservation.total_price}</span>
                </div>
                {reservation.status === 'active' && (
                  <button
                    onClick={() => cancelReservation(reservation.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                  >
                    Cancel Reservation
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservationHistory;
