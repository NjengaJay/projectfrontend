import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { accommodationService } from '../../services/accommodationService';
import { useProfile } from '../../context/ProfileContext';
import FavoriteButton from '../common/FavoriteButton';
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

const PriceInfo = ({ priceRange, roomTypes, bookingConditions }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guests, setGuests] = useState(1);
  
  console.log('Price Range:', priceRange); // Debug log
  console.log('Room Types:', roomTypes); // Debug log
  
  // Default to the minimum price from price_range, or first room type price, or 0
  const basePrice = priceRange?.min || 
                   (roomTypes && roomTypes[0]?.price) || 
                   (typeof priceRange === 'number' ? priceRange : 0);
  
  const nights = startDate && endDate 
    ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
    : 0;
  const subtotal = basePrice * nights;
  const tax = subtotal * 0.21; // 21% VAT
  const total = subtotal + tax;

  // Early return with debug message if no price data
  if (!priceRange && (!roomTypes || roomTypes.length === 0)) {
    console.log('No price data available');
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
              <span className="text-2xl font-bold text-green-500">€{basePrice}</span>
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
            />
          </div>
        </div>

        {/* Guest Selection */}
        <div>
          <label className="block text-gray-300 mb-2">Guests</label>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setGuests(Math.max(1, guests - 1))}
              className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
            >-</button>
            <span className="text-white px-4">{guests}</span>
            <button
              onClick={() => setGuests(Math.min(10, guests + 1))}
              className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
            >+</button>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-2 border-t border-gray-800 pt-4 mt-4">
          <div className="flex justify-between text-gray-300">
            <span>€{basePrice} × {nights} nights</span>
            <span>€{subtotal}</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>VAT (21%)</span>
            <span>€{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-white font-bold pt-2 border-t border-gray-800">
            <span>Total</span>
            <span>€{total.toFixed(2)}</span>
          </div>
        </div>

        <button
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors mt-4"
          disabled={!startDate || !endDate}
        >
          Reserve Now
        </button>

        {/* Room Types */}
        {roomTypes && roomTypes.length > 0 && (
          <div className="mt-6 border-t border-gray-800 pt-4">
            <h4 className="text-lg font-medium text-white mb-3">Available Room Types</h4>
            <div className="space-y-2">
              {roomTypes.map((room, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-300">{room.type}</span>
                  <span className="text-white font-medium">€{room.price}/night</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Booking Conditions */}
        {bookingConditions && bookingConditions.length > 0 && (
          <div className="mt-6 border-t border-gray-800 pt-4">
            <h4 className="text-lg font-medium text-white mb-3">Booking Conditions</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              {bookingConditions.map((condition, index) => (
                <li key={index} className="flex items-start">
                  <Info className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{condition}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
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
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccommodationDetail;
