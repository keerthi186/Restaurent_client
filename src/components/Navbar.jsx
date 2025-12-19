import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-primary">
            EazyDiner
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary">Home</Link>
            <Link to="/restaurants" className="text-gray-700 hover:text-primary">Restaurants</Link>
            {user && (
              <Link to="/orders" className="text-gray-700 hover:text-primary">My Orders</Link>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-gray-700 hover:text-primary">Admin</Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Hello, {user.name}</span>
                {user.role === 'user' && (
                  <Link to="/bookings" className="text-gray-700 hover:text-primary">
                    My Bookings
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className="border border-primary text-primary px-4 py-2 rounded hover:bg-primary hover:text-white"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;