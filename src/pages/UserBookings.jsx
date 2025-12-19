import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingAPI } from '../services/api';

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [user, navigate]);

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getUserBookings(user._id);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading your bookings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
        
        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-500 text-lg mb-4">No bookings found</div>
            <button
              onClick={() => navigate('/restaurants')}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-red-600"
            >
              Browse Restaurants
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <img
                        src={booking.restaurantId.image}
                        alt={booking.restaurantId.name}
                        className="w-16 h-16 object-cover rounded-lg mr-4"
                      />
                      <div>
                        <h3 className="text-xl font-semibold">{booking.restaurantId.name}</h3>
                        <p className="text-gray-600">{booking.restaurantId.location}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <div className="text-sm text-gray-500">Date</div>
                        <div className="font-medium">{formatDate(booking.date)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Time</div>
                        <div className="font-medium">{booking.time}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Guests</div>
                        <div className="font-medium">{booking.guests}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Customer</div>
                        <div className="font-medium">{booking.customerName}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 md:ml-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                    <div className="text-sm text-gray-500 mt-2">
                      Booked on {new Date(booking.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBookings;