import React from 'react';
import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-48 object-cover"
        />
        {restaurant.offers && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-sm">
            {restaurant.offers}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{restaurant.name}</h3>
        <p className="text-gray-600 mb-2">{restaurant.cuisine}</p>
        <p className="text-gray-500 text-sm mb-2">{restaurant.location}</p>
        
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <span className="text-yellow-500">★</span>
            <span className="ml-1 text-sm">{restaurant.rating}</span>
          </div>
          <span className="text-green-600 font-semibold">{restaurant.price}</span>
        </div>
        
        <div className="flex space-x-2">
          <Link
            to={`/restaurant/${restaurant._id}`}
            className="flex-1 bg-primary text-white py-2 px-4 rounded hover:bg-red-600 transition-colors text-center"
          >
            Book Table
          </Link>
          <Link
            to={`/menu/${restaurant._id}`}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors text-center"
          >
            Order Food
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
