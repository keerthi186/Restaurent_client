import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Restaurants = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    cuisine: searchParams.get('cuisine') || '',
    location: searchParams.get('location') || '',
    rating: '',
    priceRange: '',
    deliveryTime: '',
    offers: false,
    isVeg: false,
    sortBy: 'rating'
  });
  const [viewMode, setViewMode] = useState('grid');
  const [favorites, setFavorites] = useState([]);

  // Enhanced restaurant data with creative features
  const allRestaurants = [
    {
      _id: '1',
      name: 'Spice Symphony',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
      cuisine: 'Indian Fusion',
      rating: 4.8,
      reviewCount: 1250,
      deliveryTime: '25-35 mins',
      price: '₹500 for two',
      location: 'RS Puram, Coimbatore',
      distance: '2.1 km',
      offers: ['30% OFF', 'Free Delivery'],
      isOpen: true,
      isVeg: false,
      specialities: ['Biryani', 'Tandoor', 'Curries'],
      badges: ['Top Rated', 'Fast Delivery', 'Chef Special'],
      priceRange: 'mid',
      deliveryFee: 0,
      minOrder: 199,
      avgCost: 450,
      totalOrders: '15K+',
      description: 'Authentic Indian flavors with a modern twist',
      gallery: [
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=300&h=200&fit=crop'
      ]
    },
    {
      _id: '2',
      name: 'Urban Bites',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
      cuisine: 'Continental',
      rating: 4.6,
      reviewCount: 890,
      deliveryTime: '30-40 mins',
      price: '₹800 for two',
      location: 'Race Course, Coimbatore',
      distance: '1.8 km',
      offers: ['25% OFF'],
      isOpen: true,
      isVeg: false,
      specialities: ['Pizza', 'Pasta', 'Steaks'],
      badges: ['Premium', 'Wood Fired'],
      priceRange: 'high',
      deliveryFee: 50,
      minOrder: 299,
      avgCost: 750,
      totalOrders: '8K+',
      description: 'Fine dining continental cuisine'
    },
    {
      _id: '3',
      name: 'Green Garden',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
      cuisine: 'Healthy & Organic',
      rating: 4.7,
      reviewCount: 650,
      deliveryTime: '20-30 mins',
      price: '₹400 for two',
      location: 'Gandhipuram, Coimbatore',
      distance: '3.2 km',
      offers: ['20% OFF', 'Healthy Choice'],
      isOpen: true,
      isVeg: true,
      specialities: ['Salads', 'Smoothies', 'Quinoa Bowls'],
      badges: ['Healthy', 'Organic', 'Vegan Friendly'],
      priceRange: 'low',
      deliveryFee: 30,
      minOrder: 149,
      avgCost: 350,
      totalOrders: '5K+',
      description: 'Fresh, healthy, and organic meals'
    },
    {
      _id: '4',
      name: 'Street Food Junction',
      image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop',
      cuisine: 'Street Food',
      rating: 4.4,
      reviewCount: 2100,
      deliveryTime: '15-25 mins',
      price: '₹200 for two',
      location: 'Peelamedu, Coimbatore',
      distance: '4.5 km',
      offers: ['Buy 1 Get 1'],
      isOpen: true,
      isVeg: false,
      specialities: ['Chaat', 'Pav Bhaji', 'Dosa'],
      badges: ['Popular', 'Budget Friendly'],
      priceRange: 'low',
      deliveryFee: 25,
      minOrder: 99,
      avgCost: 180,
      totalOrders: '25K+',
      description: 'Authentic street food experience'
    },
    {
      _id: '5',
      name: 'Sushi Zen',
      image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop',
      cuisine: 'Japanese',
      rating: 4.9,
      reviewCount: 420,
      deliveryTime: '35-45 mins',
      price: '₹1200 for two',
      location: 'Saibaba Colony, Coimbatore',
      distance: '5.1 km',
      offers: ['Premium Experience'],
      isOpen: false,
      isVeg: false,
      specialities: ['Sushi', 'Ramen', 'Tempura'],
      badges: ['Premium', 'Authentic', 'Chef Special'],
      priceRange: 'high',
      deliveryFee: 80,
      minOrder: 499,
      avgCost: 1100,
      totalOrders: '2K+',
      description: 'Authentic Japanese cuisine experience'
    },
    {
      _id: '6',
      name: 'Dessert Paradise',
      image: 'https://images.unsplash.com/photo-1571167530149-c72f2b2c3f44?w=400&h=300&fit=crop',
      cuisine: 'Desserts & Bakery',
      rating: 4.5,
      reviewCount: 780,
      deliveryTime: '20-30 mins',
      price: '₹300 for two',
      location: 'Singanallur, Coimbatore',
      distance: '2.8 km',
      offers: ['Sweet Deals'],
      isOpen: true,
      isVeg: true,
      specialities: ['Cakes', 'Ice Cream', 'Pastries'],
      badges: ['Sweet Tooth', 'Fresh Baked'],
      priceRange: 'mid',
      deliveryFee: 40,
      minOrder: 149,
      avgCost: 280,
      totalOrders: '12K+',
      description: 'Heavenly desserts and fresh bakery items'
    }
  ];

  useEffect(() => {
    setRestaurants(allRestaurants);
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const savedFavorites = localStorage.getItem('restaurantFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  };

  const toggleFavorite = (restaurantId) => {
    const newFavorites = favorites.includes(restaurantId)
      ? favorites.filter(id => id !== restaurantId)
      : [...favorites, restaurantId];
    
    setFavorites(newFavorites);
    localStorage.setItem('restaurantFavorites', JSON.stringify(newFavorites));
  };

  const filteredRestaurants = () => {
    let filtered = allRestaurants.filter(restaurant => {
      const matchesSearch = restaurant.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                           restaurant.cuisine.toLowerCase().includes(filters.search.toLowerCase()) ||
                           restaurant.specialities.some(s => s.toLowerCase().includes(filters.search.toLowerCase()));
      
      const matchesCuisine = !filters.cuisine || restaurant.cuisine.toLowerCase().includes(filters.cuisine.toLowerCase());
      const matchesLocation = !filters.location || restaurant.location.toLowerCase().includes(filters.location.toLowerCase());
      const matchesRating = !filters.rating || restaurant.rating >= parseFloat(filters.rating);
      const matchesPriceRange = !filters.priceRange || restaurant.priceRange === filters.priceRange;
      const matchesDeliveryTime = !filters.deliveryTime || parseInt(restaurant.deliveryTime) <= parseInt(filters.deliveryTime);
      const matchesOffers = !filters.offers || restaurant.offers.length > 0;
      const matchesVeg = !filters.isVeg || restaurant.isVeg;

      return matchesSearch && matchesCuisine && matchesLocation && matchesRating && 
             matchesPriceRange && matchesDeliveryTime && matchesOffers && matchesVeg;
    });

    // Sort restaurants
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'deliveryTime':
          return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
        case 'price':
          return a.avgCost - b.avgCost;
        case 'distance':
          return parseFloat(a.distance) - parseFloat(b.distance);
        default:
          return b.rating - a.rating;
      }
    });

    return filtered;
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      cuisine: '',
      location: '',
      rating: '',
      priceRange: '',
      deliveryTime: '',
      offers: false,
      isVeg: false,
      sortBy: 'rating'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">🍽️ Discover Restaurants</h1>
          <p className="text-red-100">Find the perfect meal from {allRestaurants.length} amazing restaurants</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Advanced Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">🔍 Advanced Filters</h3>
            <button
              onClick={clearFilters}
              className="text-red-500 hover:text-red-600 font-medium"
            >
              Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Search */}
            <input
              type="text"
              placeholder="Search restaurants, cuisine..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-red-500"
            />

            {/* Cuisine Filter */}
            <select
              value={filters.cuisine}
              onChange={(e) => handleFilterChange('cuisine', e.target.value)}
              className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-red-500"
            >
              <option value="">All Cuisines</option>
              <option value="Indian">Indian</option>
              <option value="Continental">Continental</option>
              <option value="Healthy">Healthy & Organic</option>
              <option value="Street Food">Street Food</option>
              <option value="Japanese">Japanese</option>
              <option value="Desserts">Desserts & Bakery</option>
            </select>

            {/* Rating Filter */}
            <select
              value={filters.rating}
              onChange={(e) => handleFilterChange('rating', e.target.value)}
              className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-red-500"
            >
              <option value="">Any Rating</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.0">4.0+ Stars</option>
              <option value="3.5">3.5+ Stars</option>
            </select>

            {/* Price Range */}
            <select
              value={filters.priceRange}
              onChange={(e) => handleFilterChange('priceRange', e.target.value)}
              className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-red-500"
            >
              <option value="">Any Price</option>
              <option value="low">Budget Friendly</option>
              <option value="mid">Mid Range</option>
              <option value="high">Premium</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            {/* Toggle Filters */}
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.offers}
                onChange={(e) => handleFilterChange('offers', e.target.checked)}
                className="w-5 h-5 text-red-500 rounded focus:ring-red-500"
              />
              <span className="text-gray-700">🎯 Has Offers</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.isVeg}
                onChange={(e) => handleFilterChange('isVeg', e.target.checked)}
                className="w-5 h-5 text-green-500 rounded focus:ring-green-500"
              />
              <span className="text-gray-700">🟢 Pure Veg</span>
            </label>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">Sort by:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              >
                <option value="rating">⭐ Rating</option>
                <option value="deliveryTime">⚡ Delivery Time</option>
                <option value="price">💰 Price</option>
                <option value="distance">📍 Distance</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-gray-700">View:</span>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
              >
                ⊞
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
              >
                ☰
              </button>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Found {filteredRestaurants().length} restaurants
          </h2>
          <div className="text-gray-600">
            Showing results for your area
          </div>
        </div>

        {/* Restaurant Grid/List */}
        {filteredRestaurants().length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">🔍</div>
            <div className="text-xl text-gray-500 mb-2">No restaurants found</div>
            <p className="text-gray-400">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
            {filteredRestaurants().map((restaurant) => {
              const isFavorite = favorites.includes(restaurant._id);
              
              return (
                <div
                  key={restaurant._id}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                  onClick={() => navigate(`/menu/${restaurant._id}`)}
                >
                  <div className={`relative ${viewMode === 'list' ? 'w-64' : ''}`}>
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className={`object-cover ${viewMode === 'list' ? 'w-64 h-48' : 'w-full h-48'}`}
                    />
                    
                    {/* Status & Badges */}
                    <div className="absolute top-3 left-3 flex flex-col space-y-1">
                      {restaurant.offers.map((offer, index) => (
                        <span key={index} className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          {offer}
                        </span>
                      ))}
                    </div>

                    <div className="absolute top-3 right-3 flex flex-col space-y-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(restaurant._id);
                        }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          isFavorite ? 'bg-red-500 text-white' : 'bg-white text-gray-400 hover:text-red-500'
                        }`}
                      >
                        {isFavorite ? '❤️' : '🤍'}
                      </button>
                      
                      <div className={`w-4 h-4 rounded-full ${restaurant.isOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    </div>

                    {!restaurant.isOpen && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-bold">Currently Closed</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{restaurant.name}</h3>
                      <div className="flex items-center bg-green-100 px-2 py-1 rounded-full">
                        <span className="text-green-600 font-bold text-sm">★ {restaurant.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-2">{restaurant.cuisine}</p>
                    <p className="text-sm text-gray-500 mb-3">{restaurant.description}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {restaurant.specialities.slice(0, 3).map((speciality, index) => (
                        <span key={index} className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                          {speciality}
                        </span>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 mb-3">
                      <div>🕒 {restaurant.deliveryTime}</div>
                      <div>📍 {restaurant.distance}</div>
                      <div>💰 {restaurant.price}</div>
                      <div>📦 {restaurant.totalOrders}</div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-600">Min Order: ₹{restaurant.minOrder}</span>
                      <span className="text-sm text-gray-600">
                        Delivery: {restaurant.deliveryFee === 0 ? 'FREE' : `₹${restaurant.deliveryFee}`}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {restaurant.badges.map((badge, index) => (
                        <span key={index} className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs">
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurants;