import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { restaurantAPI, bookingAPI } from '../services/api';

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    guests: 2,
    customerName: '',
    customerPhone: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchRestaurant();
  }, [id]);

  const fetchRestaurant = async () => {
    try {
      const response = await restaurantAPI.getById(id);
      setRestaurant(response.data);
    } catch (error) {
      console.error('Error fetching restaurant:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    setBookingLoading(true);
    try {
      await bookingAPI.create({
        restaurantId: id,
        ...bookingData
      });
      setBookingSuccess(true);
      setBookingData({
        date: '',
        time: '',
        guests: 2,
        customerName: '',
        customerPhone: ''
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading restaurant details...</div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Restaurant not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Restaurant Banner */}
      <div className="relative h-96">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
          <div className="max-w-7xl mx-auto px-4 pb-8 text-white">
            <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
            <p className="text-xl mb-2">{restaurant.cuisine}</p>
            <p className="text-lg">{restaurant.location}</p>
          </div>
        </div>
        {restaurant.offers && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg">
            {restaurant.offers}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Restaurant Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-yellow-500 text-2xl">★</span>
                  <span className="text-xl font-semibold ml-2">{restaurant.rating}</span>
                  <span className="text-gray-600 ml-2">Rating</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{restaurant.price}</div>
                  <div className="text-gray-600">for two people</div>
                </div>
              </div>
              
              <h2 className="text-2xl font-semibold mb-4">About {restaurant.name}</h2>
              <p className="text-gray-700 leading-relaxed">{restaurant.description}</p>
            </div>

            {/* Menu Highlights */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Menu Highlights</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl mb-2">🍛</div>
                  <div className="font-medium">Biryani</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl mb-2">🍝</div>
                  <div className="font-medium">Pasta</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl mb-2">🍕</div>
                  <div className="font-medium">Pizza</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl mb-2">🥘</div>
                  <div className="font-medium">Curry</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl mb-2">🍜</div>
                  <div className="font-medium">Noodles</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl mb-2">🥗</div>
                  <div className="font-medium">Salads</div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-semibold mb-4">Book a Table</h3>
              
              {bookingSuccess ? (
                <div className="text-center py-8">
                  <div className="text-green-600 text-4xl mb-4">✓</div>
                  <h4 className="text-lg font-semibold mb-2">Booking Confirmed!</h4>
                  <p className="text-gray-600 mb-4">Your table has been booked successfully.</p>
                  <button
                    onClick={() => setBookingSuccess(false)}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Book Another Table
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={bookingData.date}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Time</label>
                    <select
                      name="time"
                      value={bookingData.time}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      required
                    >
                      <option value="">Select Time</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="12:30 PM">12:30 PM</option>
                      <option value="1:00 PM">1:00 PM</option>
                      <option value="1:30 PM">1:30 PM</option>
                      <option value="2:00 PM">2:00 PM</option>
                      <option value="7:00 PM">7:00 PM</option>
                      <option value="7:30 PM">7:30 PM</option>
                      <option value="8:00 PM">8:00 PM</option>
                      <option value="8:30 PM">8:30 PM</option>
                      <option value="9:00 PM">9:00 PM</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Number of Guests</label>
                    <select
                      name="guests"
                      value={bookingData.guests}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      required
                    >
                      {[...Array(20)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Customer Name</label>
                    <input
                      type="text"
                      name="customerName"
                      value={bookingData.customerName}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={bookingData.customerPhone}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="w-full bg-primary text-white py-3 rounded-lg hover:bg-red-600 disabled:opacity-50"
                  >
                    {bookingLoading ? 'Booking...' : 'Book Table'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;