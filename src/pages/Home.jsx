import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [searchLocation, setSearchLocation] = useState('');
  const [searchCuisine, setSearchCuisine] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [weatherInfo, setWeatherInfo] = useState({ temp: 28, condition: 'sunny' });
  const [timeOfDay, setTimeOfDay] = useState('');

  // Creative featured restaurants with enhanced data
  const featuredRestaurants = [
    {
      _id: '1',
      name: 'Spice Symphony',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
      cuisine: 'Indian Fusion',
      rating: 4.8,
      deliveryTime: '25-35 mins',
      price: '₹500 for two',
      offers: ['30% OFF', 'Free Delivery'],
      speciality: 'Signature Biryani',
      isOpen: true,
      distance: '2.1 km',
      totalOrders: '10K+',
      badges: ['Top Rated', 'Fast Delivery']
    },
    {
      _id: '2',
      name: 'Urban Bites',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
      cuisine: 'Continental',
      rating: 4.6,
      deliveryTime: '30-40 mins',
      price: '₹800 for two',
      offers: ['25% OFF'],
      speciality: 'Wood-fired Pizza',
      isOpen: true,
      distance: '1.8 km',
      totalOrders: '8K+',
      badges: ['Premium', 'Chef Special']
    },
    {
      _id: '3',
      name: 'Green Garden',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
      cuisine: 'Healthy & Organic',
      rating: 4.7,
      deliveryTime: '20-30 mins',
      price: '₹400 for two',
      offers: ['20% OFF', 'Healthy Choice'],
      speciality: 'Quinoa Bowls',
      isOpen: true,
      distance: '3.2 km',
      totalOrders: '5K+',
      badges: ['Healthy', 'Organic']
    }
  ];

  // Hero carousel data
  const heroSlides = [
    {
      title: 'Craving Something Delicious?',
      subtitle: 'Order from 1000+ restaurants',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=400&fit=crop',
      cta: 'Order Now',
      offer: 'Get 40% OFF on first order'
    },
    {
      title: 'Fresh & Fast Delivery',
      subtitle: 'Hot food delivered in 30 minutes',
      image: 'https://images.unsplash.com/photo-1571167530149-c72f2b2c3f44?w=800&h=400&fit=crop',
      cta: 'Explore Menu',
      offer: 'Free delivery on orders above ₹299'
    },
    {
      title: 'Weekend Special Treats',
      subtitle: 'Exclusive weekend offers',
      image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=400&fit=crop',
      cta: 'View Offers',
      offer: 'Up to 50% OFF on selected items'
    }
  ];

  // Cuisine categories with creative icons
  const cuisineCategories = [
    { name: 'Indian', icon: '🍛', color: 'from-orange-400 to-red-500', count: '250+' },
    { name: 'Chinese', icon: '🥢', color: 'from-red-400 to-pink-500', count: '180+' },
    { name: 'Italian', icon: '🍕', color: 'from-green-400 to-blue-500', count: '120+' },
    { name: 'Mexican', icon: '🌮', color: 'from-yellow-400 to-orange-500', count: '90+' },
    { name: 'Thai', icon: '🍜', color: 'from-purple-400 to-pink-500', count: '75+' },
    { name: 'Desserts', icon: '🍰', color: 'from-pink-400 to-purple-500', count: '200+' },
    { name: 'Beverages', icon: '🥤', color: 'from-blue-400 to-cyan-500', count: '150+' },
    { name: 'Healthy', icon: '🥗', color: 'from-green-400 to-teal-500', count: '100+' }
  ];

  useEffect(() => {
    // Auto-slide carousel
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    // Set time of day
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('morning');
    else if (hour < 17) setTimeOfDay('afternoon');
    else setTimeOfDay('evening');

    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchLocation) params.append('location', searchLocation);
    if (searchCuisine) params.append('cuisine', searchCuisine);
    navigate(`/restaurants?${params.toString()}`);
  };

  const getGreeting = () => {
    const greetings = {
      morning: '🌅 Good Morning!',
      afternoon: '☀️ Good Afternoon!',
      evening: '🌆 Good Evening!'
    };
    return greetings[timeOfDay] || '👋 Hello!';
  };

  const getWeatherRecommendation = () => {
    if (weatherInfo.temp > 30) return { text: 'Perfect weather for cold beverages!', icon: '🥤' };
    if (weatherInfo.temp < 20) return { text: 'Warm soup sounds perfect today!', icon: '🍲' };
    return { text: 'Great day for any cuisine!', icon: '🍽️' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Enhanced Hero Section with Carousel */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-transform duration-1000 ease-in-out ${
              index === currentSlide ? 'translate-x-0' : 'translate-x-full'
            }`}
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="flex items-center justify-center h-full text-white text-center px-4">
              <div className="max-w-4xl">
                <div className="mb-4">
                  <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold animate-pulse">
                    {slide.offer}
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">{slide.title}</h1>
                <p className="text-xl md:text-2xl mb-8 opacity-90">{slide.subtitle}</p>
                <button
                  onClick={() => navigate('/restaurants')}
                  className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-red-600 hover:to-orange-600 transform hover:scale-105 transition-all shadow-2xl"
                >
                  {slide.cta} 🚀
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Weather & Greeting Section */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{getGreeting()}</h2>
              <p className="text-gray-600">What would you like to eat today?</p>
            </div>
            <div className="text-right">
              <div className="text-3xl mb-1">{weatherInfo.condition === 'sunny' ? '☀️' : '🌤️'}</div>
              <div className="text-lg font-semibold">{weatherInfo.temp}°C</div>
              <div className="text-sm text-gray-600 flex items-center">
                <span className="mr-1">{getWeatherRecommendation().icon}</span>
                {getWeatherRecommendation().text}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search Section */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
            🔍 Find Your Perfect Meal
          </h3>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="📍 Enter your location (e.g., Coimbatore)"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all"
              />
            </div>
            <div className="flex-1 relative">
              <select
                value={searchCuisine}
                onChange={(e) => setSearchCuisine(e.target.value)}
                className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all"
              >
                <option value="">🍽️ All Cuisines</option>
                <option value="Indian">🍛 Indian</option>
                <option value="Chinese">🥢 Chinese</option>
                <option value="Italian">🍕 Italian</option>
                <option value="Mexican">🌮 Mexican</option>
                <option value="Thai">🍜 Thai</option>
              </select>
            </div>
            <button
              onClick={handleSearch}
              className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-xl hover:from-red-600 hover:to-orange-600 font-bold text-lg transform hover:scale-105 transition-all shadow-lg"
            >
              Search Restaurants 🚀
            </button>
          </div>
        </div>
      </div>

      {/* Cuisine Categories */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <h3 className="text-3xl font-bold text-center mb-8 text-gray-800">
          🍴 Explore by Cuisine
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {cuisineCategories.map((cuisine, index) => (
            <button
              key={index}
              onClick={() => navigate(`/restaurants?cuisine=${cuisine.name}`)}
              className={`bg-gradient-to-br ${cuisine.color} text-white p-6 rounded-2xl hover:shadow-xl transform hover:scale-110 transition-all duration-300 text-center group`}
            >
              <div className="text-4xl mb-2 group-hover:animate-bounce">{cuisine.icon}</div>
              <div className="font-bold text-sm">{cuisine.name}</div>
              <div className="text-xs opacity-90">{cuisine.count}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Restaurants */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-3xl font-bold text-gray-800">⭐ Featured Restaurants</h3>
          <Link
            to="/restaurants"
            className="text-red-500 hover:text-red-600 font-semibold flex items-center"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredRestaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
              onClick={() => navigate(`/menu/${restaurant._id}`)}
            >
              <div className="relative">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3 flex flex-col space-y-1">
                  {restaurant.offers.map((offer, index) => (
                    <span key={index} className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      {offer}
                    </span>
                  ))}
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`w-3 h-3 rounded-full ${restaurant.isOpen ? 'bg-green-500' : 'bg-red-500'}`}></span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-xl font-bold text-gray-800">{restaurant.name}</h4>
                  <div className="flex items-center bg-green-100 px-2 py-1 rounded-full">
                    <span className="text-green-600 font-bold text-sm">★ {restaurant.rating}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-3">{restaurant.cuisine}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span>🕒 {restaurant.deliveryTime}</span>
                  <span>📍 {restaurant.distance}</span>
                  <span>📦 {restaurant.totalOrders}</span>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600">{restaurant.price}</span>
                  <span className="text-red-500 font-semibold">Speciality: {restaurant.speciality}</span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {restaurant.badges.map((badge, index) => (
                    <span key={index} className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Special Offers Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-white">
            🎉 Special Offers & Deals
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center transform hover:scale-105 transition-all">
              <div className="text-6xl mb-4">🎯</div>
              <h4 className="text-2xl font-bold mb-4 text-gray-800">First Order Special</h4>
              <p className="text-gray-600 mb-4">Get 50% off on your first order above ₹299</p>
              <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold">
                Use code: FIRST50
              </span>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center transform hover:scale-105 transition-all">
              <div className="text-6xl mb-4">⚡</div>
              <h4 className="text-2xl font-bold mb-4 text-gray-800">Lightning Deals</h4>
              <p className="text-gray-600 mb-4">Flash sales every hour with up to 60% off</p>
              <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold">
                Limited Time
              </span>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center transform hover:scale-105 transition-all">
              <div className="text-6xl mb-4">👥</div>
              <h4 className="text-2xl font-bold mb-4 text-gray-800">Group Orders</h4>
              <p className="text-gray-600 mb-4">Order for 4+ people and get 25% off + free delivery</p>
              <span className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-full font-bold">
                Use code: GROUP25
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* App Download Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white text-center">
          <h3 className="text-4xl font-bold mb-4">📱 Get the EazyDiner App</h3>
          <p className="text-xl mb-8 opacity-90">
            Order faster, track in real-time, and get exclusive app-only deals!
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-black text-white px-6 py-3 rounded-xl flex items-center space-x-2 hover:bg-gray-800 transition-all">
              <span>📱</span>
              <span>Download for iOS</span>
            </button>
            <button className="bg-black text-white px-6 py-3 rounded-xl flex items-center space-x-2 hover:bg-gray-800 transition-all">
              <span>🤖</span>
              <span>Download for Android</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;