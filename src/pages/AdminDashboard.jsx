import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantAPI, bookingAPI, menuAPI, orderAPI } from '../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('restaurants');
  const [restaurants, setRestaurants] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('user'));

  const [restaurantForm, setRestaurantForm] = useState({
    name: '',
    image: '',
    cuisine: '',
    rating: '',
    location: '',
    price: '',
    offers: '',
    description: '',
    featured: false
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [restaurantsRes, bookingsRes, ordersRes, menuRes] = await Promise.all([
        restaurantAPI.getAll(),
        bookingAPI.getAll(),
        orderAPI.getAll(),
        menuAPI.getAll()
      ]);
      setRestaurants(restaurantsRes.data);
      setBookings(bookingsRes.data);
      setOrders(ordersRes.data);
      setMenuItems(menuRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurantSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRestaurant) {
        await restaurantAPI.update(editingRestaurant._id, restaurantForm);
      } else {
        await restaurantAPI.create(restaurantForm);
      }
      fetchData();
      resetForm();
    } catch (error) {
      console.error('Error saving restaurant:', error);
      alert('Failed to save restaurant');
    }
  };

  const handleDeleteRestaurant = async (id) => {
    if (window.confirm('Are you sure you want to delete this restaurant?')) {
      try {
        await restaurantAPI.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting restaurant:', error);
        alert('Failed to delete restaurant');
      }
    }
  };

  const handleEditRestaurant = (restaurant) => {
    setRestaurantForm(restaurant);
    setEditingRestaurant(restaurant);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setRestaurantForm({
      name: '',
      image: '',
      cuisine: '',
      rating: '',
      location: '',
      price: '',
      offers: '',
      description: '',
      featured: false
    });
    setEditingRestaurant(null);
    setShowAddForm(false);
  };

  const handleBookingStatusUpdate = async (bookingId, status) => {
    try {
      await bookingAPI.updateStatus(bookingId, status);
      fetchData();
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Failed to update booking status');
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        {/* Tabs */}
        <div className="flex flex-wrap space-x-1 mb-8">
          <button
            onClick={() => setActiveTab('restaurants')}
            className={`px-6 py-3 rounded-lg font-medium ${
              activeTab === 'restaurants'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Restaurants ({restaurants.length})
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-6 py-3 rounded-lg font-medium ${
              activeTab === 'menu'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Menu Items ({menuItems.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 rounded-lg font-medium ${
              activeTab === 'orders'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-3 rounded-lg font-medium ${
              activeTab === 'bookings'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Bookings ({bookings.length})
          </button>
        </div>

        {/* Restaurants Tab */}
        {activeTab === 'restaurants' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Manage Restaurants</h2>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-red-600"
              >
                Add Restaurant
              </button>
            </div>

            {/* Add/Edit Restaurant Form */}
            {showAddForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">
                  {editingRestaurant ? 'Edit Restaurant' : 'Add New Restaurant'}
                </h3>
                <form onSubmit={handleRestaurantSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Restaurant Name"
                    value={restaurantForm.name}
                    onChange={(e) => setRestaurantForm({...restaurantForm, name: e.target.value})}
                    className="p-2 border border-gray-300 rounded-lg"
                    required
                  />
                  <input
                    type="url"
                    placeholder="Image URL"
                    value={restaurantForm.image}
                    onChange={(e) => setRestaurantForm({...restaurantForm, image: e.target.value})}
                    className="p-2 border border-gray-300 rounded-lg"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Cuisine Type"
                    value={restaurantForm.cuisine}
                    onChange={(e) => setRestaurantForm({...restaurantForm, cuisine: e.target.value})}
                    className="p-2 border border-gray-300 rounded-lg"
                    required
                  />
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    placeholder="Rating (0-5)"
                    value={restaurantForm.rating}
                    onChange={(e) => setRestaurantForm({...restaurantForm, rating: e.target.value})}
                    className="p-2 border border-gray-300 rounded-lg"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={restaurantForm.location}
                    onChange={(e) => setRestaurantForm({...restaurantForm, location: e.target.value})}
                    className="p-2 border border-gray-300 rounded-lg"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Price (e.g., ₹500 for two)"
                    value={restaurantForm.price}
                    onChange={(e) => setRestaurantForm({...restaurantForm, price: e.target.value})}
                    className="p-2 border border-gray-300 rounded-lg"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Offers (optional)"
                    value={restaurantForm.offers}
                    onChange={(e) => setRestaurantForm({...restaurantForm, offers: e.target.value})}
                    className="p-2 border border-gray-300 rounded-lg"
                  />
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={restaurantForm.featured}
                      onChange={(e) => setRestaurantForm({...restaurantForm, featured: e.target.checked})}
                      className="mr-2"
                    />
                    <label htmlFor="featured">Featured Restaurant</label>
                  </div>
                  <textarea
                    placeholder="Description"
                    value={restaurantForm.description}
                    onChange={(e) => setRestaurantForm({...restaurantForm, description: e.target.value})}
                    className="p-2 border border-gray-300 rounded-lg md:col-span-2"
                    rows="3"
                    required
                  />
                  <div className="md:col-span-2 flex space-x-4">
                    <button
                      type="submit"
                      className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-red-600"
                    >
                      {editingRestaurant ? 'Update' : 'Add'} Restaurant
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Restaurants List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => (
                <div key={restaurant._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{restaurant.name}</h3>
                    <p className="text-gray-600 mb-2">{restaurant.cuisine}</p>
                    <p className="text-gray-500 text-sm mb-2">{restaurant.location}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-yellow-500">★ {restaurant.rating}</span>
                      <span className="text-green-600 font-semibold">{restaurant.price}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditRestaurant(restaurant)}
                        className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRestaurant(restaurant._id)}
                        className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Manage Bookings</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Restaurant</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guests</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <tr key={booking._id}>
                        <td className="px-6 py-4">
                          <div className="font-medium">{booking.restaurantId.name}</div>
                          <div className="text-sm text-gray-500">{booking.restaurantId.location}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium">{booking.customerName}</div>
                          <div className="text-sm text-gray-500">{booking.customerPhone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium">{new Date(booking.date).toLocaleDateString()}</div>
                          <div className="text-sm text-gray-500">{booking.time}</div>
                        </td>
                        <td className="px-6 py-4">{booking.guests}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleBookingStatusUpdate(booking._id, 'confirmed')}
                              className="text-green-600 hover:text-green-800 text-sm"
                              disabled={booking.status === 'confirmed'}
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => handleBookingStatusUpdate(booking._id, 'cancelled')}
                              className="text-red-600 hover:text-red-800 text-sm"
                              disabled={booking.status === 'cancelled'}
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;