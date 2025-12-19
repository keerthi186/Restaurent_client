import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getUserOrders(user._id);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'ready':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl mb-4">Please login to view your orders</div>
          <Link
            to="/login"
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <div className="text-xl">Loading your orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Orders</h1>
          <Link
            to="/restaurants"
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
          >
            Order Again
          </Link>
        </div>

        {/* Filter Buttons */}
        <div className="mb-6 flex flex-wrap gap-2">
          {['all', 'pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg capitalize ${
                filter === status
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {status === 'all' ? 'All Orders' : status}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <div className="text-gray-500 text-lg mb-4">
              {filter === 'all' ? 'No orders found' : `No ${filter} orders found`}
            </div>
            <p className="text-gray-400 mb-6">Start ordering from your favorite restaurants!</p>
            <Link
              to="/restaurants"
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
            >
              Browse Restaurants
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{order.restaurantId?.name}</h3>
                      <p className="text-gray-600">{order.restaurantId?.location}</p>
                      <p className="text-sm text-gray-500">
                        Order placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <p className="text-lg font-bold mt-2">₹{order.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Order Type and Delivery Info */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span className="capitalize">Order Type: {order.orderType}</span>
                    <span>Payment: {order.paymentMethod}</span>
                    {order.estimatedDeliveryTime && (
                      <span>
                        Estimated: {new Date(order.estimatedDeliveryTime).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <h4 className="font-medium mb-3">Order Items ({order.items.length})</h4>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img
                            src={item.menuItem?.image}
                            alt={item.menuItem?.name}
                            className="w-12 h-12 object-cover rounded-lg mr-3"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop';
                            }}
                          />
                          <div>
                            <h5 className="font-medium">{item.menuItem?.name}</h5>
                            <p className="text-sm text-gray-600">₹{item.price} × {item.quantity}</p>
                            {item.specialInstructions && (
                              <p className="text-sm text-blue-600">Note: {item.specialInstructions}</p>
                            )}
                          </div>
                        </div>
                        <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Address */}
                  {order.orderType === 'delivery' && order.deliveryAddress && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <h5 className="font-medium mb-1">Delivery Address</h5>
                      <p className="text-sm text-gray-600">
                        {order.deliveryAddress.street}, {order.deliveryAddress.city},{' '}
                        {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-4">
                    <Link
                      to={`/order-confirmation/${order._id}`}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm"
                    >
                      View Details
                    </Link>
                    {order.status === 'delivered' && (
                      <Link
                        to={`/menu/${order.restaurantId._id}`}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm"
                      >
                        Reorder
                      </Link>
                    )}
                    {(order.status === 'pending' || order.status === 'confirmed') && (
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to cancel this order?')) {
                            // Add cancel order functionality here
                            console.log('Cancel order:', order._id);
                          }
                        }}
                        className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 text-sm"
                      >
                        Cancel Order
                      </button>
                    )}
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

export default Orders;