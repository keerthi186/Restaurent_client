import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-secondary text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">EazyDiner</h3>
            <p className="text-gray-300 mb-4">
              Discover and book the best restaurants in your city. 
              Experience fine dining with just a few clicks.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">📘</a>
              <a href="#" className="text-gray-300 hover:text-white">🐦</a>
              <a href="#" className="text-gray-300 hover:text-white">📷</a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link to="/restaurants" className="text-gray-300 hover:text-white">Restaurants</Link></li>
              <li><a href="#" className="text-gray-300 hover:text-white">About Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Cities</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Coimbatore</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Chennai</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Bangalore</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Mumbai</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Help Center</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Careers</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-600 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            &copy; 2024 EazyDiner. All rights reserved. Made with ❤️ for food lovers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;