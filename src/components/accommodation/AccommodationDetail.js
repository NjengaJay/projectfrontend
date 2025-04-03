import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { accommodationService } from '../../services/accommodationService';
import { useProfile } from '../../context/ProfileContext';
import FavoriteButton from '../common/FavoriteButton';
import { API_BASE_URL } from '../../config';
import { 
  Accessibility, 
  MapPin, 
  Star, 
  Calendar, 
  Users, 
  Wifi, 
  Car, 
  Coffee, 
  Bath, 
  Tv, 
  RefreshCw,
  Phone,
  Mail,
  Building,
  Info
} from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';

const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-96 bg-gray-700 rounded-xl mb-8" />
    <div className="space-y-4">
      <div className="h-8 bg-gray-700 rounded w-3/4" />
      <div className="h-4 bg-gray-700 rounded w-1/2" />
      <div className="h-4 bg-gray-700 rounded w-2/3" />
    </div>
  </div>
);

const ErrorDisplay = ({ error, onRetry }) => (
  <div className="text-center py-8">
    <div className="text-red-500 mb-4">{error}</div>
    <button
      onClick={onRetry}
      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
    >
      <RefreshCw className="w-4 h-4 mr-2" />
      Try Again
    </button>
  </div>
);

const PriceInfo = ({ priceRange, roomTypes, bookingConditions, accommodationId }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Reset success and error when dates, guests, or room type change
  useEffect(() => {
    setSuccess(false);
    setError(null);
  }, [startDate, endDate, guests, selectedRoomType]);

  // Safely parse room types and ensure they have required properties
  const safeRoomTypes = React.useMemo(() => {
    try {
      if (!roomTypes) return [];
      const parsed = Array.isArray(roomTypes) ? roomTypes : JSON.parse(roomTypes);
      return parsed.filter(room => 
        room && 
        typeof room.type === 'string' && 
        typeof room.price === 'number' && 
        typeof room.capacity === 'number'
      );
    } catch (e) {
      console.error('Error parsing room types:', e);
      return [];
    }
  }, [roomTypes]);

  // Calculate price with room type consideration
  const calculatePrice = React.useCallback(() => {
    const nights = startDate && endDate 
      ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
      : 0;

    // If no room type is selected or no valid room types, use default pricing
    if (!selectedRoomType && safeRoomTypes.length === 0) {
      const basePrice = priceRange?.min || 
                       (typeof priceRange === 'number' ? priceRange : 0);
      const subtotal = basePrice * nights;
      const tax = subtotal * 0.21;
      return {
        basePrice,
        guestSurcharge: 0,
        subtotal,
        tax,
        total: subtotal + tax,
        nights
      };
    }

    // Use selected room type or first available room type
    const roomType = selectedRoomType || safeRoomTypes[0];
    const basePrice = roomType.price;
    const guestSurcharge = guests > roomType.capacity 
      ? (guests - roomType.capacity) * (basePrice * 0.25)
      : 0;
    const subtotal = (basePrice + guestSurcharge) * nights;
    const tax = subtotal * 0.21;

    return {
      basePrice,
      guestSurcharge,
      subtotal,
      tax,
      total: subtotal + tax,
      nights
    };
  }, [startDate, endDate, guests, selectedRoomType, safeRoomTypes, priceRange]);

  const priceDetails = calculatePrice();

  const handleReserve = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Validate room selection if room types are available
      if (safeRoomTypes.length > 0 && !selectedRoomType) {
        setError('Please select a room type');
        return;
      }

      const reservationData = {
        accommodation_id: accommodationId,
        check_in: startDate.toISOString().split('T')[0],
        check_out: endDate.toISOString().split('T')[0],
        guests: guests,
        total_price: priceDetails.total,
        room_type: selectedRoomType?.type
      };

      await axios.post(`${API_BASE_URL}/reservations`, reservationData);
      setSuccess(true);
      
      // Reset form
      setStartDate(null);
      setEndDate(null);
      setGuests(1);
      setSelectedRoomType(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create reservation');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!priceRange && (!roomTypes || roomTypes.length === 0)) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 sticky top-6">
        <h3 className="text-xl font-semibold text-white mb-4">Price Information Unavailable</h3>
        <p className="text-gray-300">Please contact us for pricing details.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 sticky top-6">
      <h3 className="text-xl font-semibold text-white mb-4">Book Your Stay</h3>
      
      {/* Success Message */}
      {success && (
        <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
          <p className="text-green-400">
            Reservation successful! View it in your profile's reservations tab.
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}
      
      {/* Price Range Display */}
      <div className="mb-6 p-4 bg-gray-800 rounded-lg">
        <h4 className="text-lg font-medium text-white mb-2">Price Range</h4>
        <div className="space-y-2">
          {typeof priceRange === 'object' ? (
            <>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Starting from</span>
                <span className="text-2xl font-bold text-green-500">€{priceRange.min}</span>
              </div>
              {priceRange.max && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Up to</span>
                  <span className="text-xl text-gray-400">€{priceRange.max}</span>
                </div>
              )}
            </>
          ) : (
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Price</span>
              <span className="text-2xl font-bold text-green-500">€{priceRange}</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* Date Selection */}
        <div>
          <label className="block text-gray-300 mb-2">Check-in / Check-out</label>
          <div className="grid grid-cols-2 gap-2">
            <DatePicker
              selected={startDate}
              onChange={date => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              minDate={new Date()}
              placeholderText="Check-in"
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-2"
              disabled={isSubmitting}
            />
            <DatePicker
              selected={endDate}
              onChange={date => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              placeholderText="Check-out"
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-2"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Room Type Selection */}
        {safeRoomTypes.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Room Type
            </label>
            <select
              value={selectedRoomType?.type || ''}
              onChange={(e) => {
                const selected = safeRoomTypes.find(room => room.type === e.target.value);
                setSelectedRoomType(selected || null);
              }}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a room type</option>
              {safeRoomTypes.map((room) => (
                <option 
                  key={room.type} 
                  value={room.type}
                  disabled={guests > room.capacity * 2} // Allow up to double capacity with surcharge
                >
                  {room.type} (Max {room.capacity} guests) - €{room.price}/night
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Guest Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Number of Guests
          </label>
          <input
            type="number"
            min="1"
            max={selectedRoomType ? selectedRoomType.capacity * 2 : 10}
            value={guests}
            onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {selectedRoomType && guests > selectedRoomType.capacity && (
            <p className="text-yellow-500 text-sm mt-1">
              Additional guest fee applies above {selectedRoomType.capacity} guests
            </p>
          )}
        </div>

        {/* Price Breakdown */}
        {priceDetails.nights > 0 && (
          <div className="space-y-2 border-t border-gray-700 pt-4">
            <div className="flex justify-between text-gray-300">
              <span>Base Price (per night)</span>
              <span>€{priceDetails.basePrice.toFixed(2)}</span>
            </div>
            {priceDetails.guestSurcharge > 0 && (
              <div className="flex justify-between text-gray-300">
                <span>Additional Guest Fee</span>
                <span>€{priceDetails.guestSurcharge.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-300">
              <span>Subtotal ({priceDetails.nights} nights)</span>
              <span>€{priceDetails.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>VAT (21%)</span>
              <span>€{priceDetails.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-white font-semibold text-lg">
              <span>Total</span>
              <span>€{priceDetails.total.toFixed(2)}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        
        {success && (
          <div className="text-green-500 text-sm">Reservation successful!</div>
        )}

        <button
          onClick={handleReserve}
          disabled={!startDate || !endDate || isSubmitting || (safeRoomTypes.length > 0 && !selectedRoomType)}
          className={`w-full py-3 rounded-lg font-semibold ${
            (!startDate || !endDate || isSubmitting || (safeRoomTypes.length > 0 && !selectedRoomType))
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white transition-colors`}
        >
          {isSubmitting ? 'Processing...' : 'Reserve Now'}
        </button>
      </div>
    </div>
  );
};

const AccommodationDetail = () => {
  const { id } = useParams();
  const [accommodation, setAccommodation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { checkIsFavorite } = useProfile();

  const fetchAccommodationData = async () => {
    try {
      setLoading(true);
      const data = await accommodationService.getAccommodation(id);
      console.log('Accommodation Data:', data); // Debug log
      setAccommodation(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching accommodation:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccommodationData();
  }, [id]);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorDisplay error={error} onRetry={fetchAccommodationData} />;
  if (!accommodation) return <div className="text-center py-8">Accommodation not found</div>;

  const amenityIcons = {
    wifi: <Wifi className="w-5 h-5" />,
    parking: <Car className="w-5 h-5" />,
    breakfast: <Coffee className="w-5 h-5" />,
    bathroom: <Bath className="w-5 h-5" />,
    tv: <Tv className="w-5 h-5" />,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="relative">
          <img
            src={accommodation.image_url || 'https://placehold.co/800x400?text=No+Image'}
            alt={accommodation.name}
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-white">{accommodation.name}</h1>
              <FavoriteButton
                accommodationId={accommodation.id}
                initialIsFavorite={checkIsFavorite(accommodation.id, 'accommodation')}
                className="bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Main Info */}
            <div className="flex-grow space-y-8">
              {/* Location & Rating */}
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-300">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{accommodation.city}, Netherlands</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 mr-1" />
                  <span className="text-white">{accommodation.star_rating}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-3">About this place</h2>
                <p className="text-gray-300">{accommodation.description}</p>
              </div>

              {/* Amenities */}
              {accommodation.amenities && accommodation.amenities.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {accommodation.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center p-3 bg-gray-900 rounded-lg">
                        {amenityIcons[amenity.toLowerCase()] || <Info className="w-5 h-5" />}
                        <span className="ml-3 text-gray-300">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Accessibility Features */}
              {accommodation.accessibility_features && Object.keys(accommodation.accessibility_features).length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Accessibility</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(accommodation.accessibility_features).map(([feature, available]) => (
                      available && (
                        <div key={feature} className="flex items-center p-3 bg-gray-900 rounded-lg">
                          <Accessibility className="w-5 h-5 text-green-500" />
                          <span className="ml-3 text-gray-300">
                            {feature.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Contact Information</h2>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-300">
                    <Phone className="w-5 h-5 mr-3" />
                    <span>+31 (0) XX XXX XXXX</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Mail className="w-5 h-5 mr-3" />
                    <span>contact@{accommodation.name.toLowerCase().replace(/\s+/g, '')}.nl</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Building className="w-5 h-5 mr-3" />
                    <span>{accommodation.type}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Booking Sidebar */}
            <div className="lg:w-1/3">
              <PriceInfo 
                priceRange={accommodation.price_range}
                roomTypes={accommodation.room_types}
                bookingConditions={accommodation.booking_conditions}
                accommodationId={accommodation.id}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccommodationDetail;
