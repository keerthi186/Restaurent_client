import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Menu = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState({});
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVeg, setFilterVeg] = useState('all');
  const [showNutrition, setShowNutrition] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [showReviews, setShowReviews] = useState({});
  
  const user = JSON.parse(localStorage.getItem('user'));

  // Enhanced menu data with creative features
  const enhancedMenu = {
    'Signature Dishes': [
      {
        _id: '1',
        name: 'Chef\'s Special Biryani',
        description: 'Aromatic basmati rice with tender chicken, saffron, and secret spices',
        price: 350,
        originalPrice: 420,
        image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=300&h=200&fit=crop',
        isVeg: false,
        rating: 4.8,
        reviewCount: 245,
        preparationTime: 25,
        spiceLevel: 'Medium',
        calories: 650,
        protein: '35g',
        carbs: '75g',
        fat: '18g',
        tags: ['Bestseller', 'Chef Special', 'Protein Rich'],
        allergens: ['Dairy', 'Nuts'],
        customizable: true,
        discount: 17,
        isPopular: true,
        reviews: [
          { user: 'Rahul K.', rating: 5, comment: 'Amazing taste! Best biryani in town.' },
          { user: 'Priya S.', rating: 4, comment: 'Loved the aroma and spices.' }
        ]
      },
      {
        _id: '2',
        name: 'Truffle Mushroom Pizza',
        description: 'Wood-fired pizza with truffle oil, wild mushrooms, and mozzarella',
        price: 480,
        originalPrice: 550,
        image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300&h=200&fit=crop',
        isVeg: true,
        rating: 4.6,
        reviewCount: 189,
        preparationTime: 18,
        calories: 520,
        protein: '22g',
        carbs: '45g',
        fat: '28g',
        tags: ['Gourmet', 'Wood Fired', 'Premium'],
        allergens: ['Gluten', 'Dairy'],
        customizable: true,
        discount: 13,
        isNew: true
      }
    ],
    'Healthy Options': [
      {
        _id: '3',
        name: 'Quinoa Buddha Bowl',
        description: 'Nutritious bowl with quinoa, avocado, roasted vegetables, and tahini dressing',
        price: 280,
        image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop',
        isVeg: true,
        rating: 4.4,
        reviewCount: 156,
        preparationTime: 15,
        calories: 420,
        protein: '18g',
        carbs: '52g',
        fat: '16g',
        tags: ['Healthy', 'Gluten Free', 'Vegan'],
        allergens: ['Sesame'],
        isHealthy: true
      },
      {
        _id: '4',
        name: 'Grilled Salmon Salad',
        description: 'Fresh Atlantic salmon with mixed greens, cherry tomatoes, and lemon vinaigrette',
        price: 420,
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300&h=200&fit=crop',
        isVeg: false,
        rating: 4.7,
        reviewCount: 98,
        preparationTime: 20,
        calories: 380,
        protein: '32g',
        carbs: '12g',
        fat: '24g',
        tags: ['High Protein', 'Omega-3', 'Low Carb'],
        allergens: ['Fish'],
        isHealthy: true
      }
    ],
    'Street Food': [
      {
        _id: '5',
        name: 'Mumbai Pav Bhaji',
        description: 'Spicy vegetable curry served with buttered bread rolls',
        price: 120,
        image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300&h=200&fit=crop',
        isVeg: true,
        rating: 4.3,
        reviewCount: 312,
        preparationTime: 12,
        spiceLevel: 'Spicy',
        calories: 450,
        protein: '12g',
        carbs: '68g',
        fat: '15g',
        tags: ['Street Food', 'Comfort Food', 'Spicy'],
        allergens: ['Gluten', 'Dairy'],
        isCombo: true
      }
    ],
    'Desserts': [
      {
        _id: '6',
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with molten center, served with vanilla ice cream',
        price: 180,
        image: 'https://images.unsplash.com/photo-1571167530149-c72f2b2c3f44?w=300&h=200&fit=crop',
        isVeg: true,
        rating: 4.9,
        reviewCount: 267,
        preparationTime: 8,
        calories: 520,
        protein: '8g',
        carbs: '65g',
        fat: '28g',
        tags: ['Dessert', 'Chocolate', 'Warm'],
        allergens: ['Eggs', 'Dairy', 'Gluten'],
        isSignature: true
      }
    ],
    'Beverages': [
      {
        _id: '7',
        name: 'Fresh Lime Mojito',
        description: 'Refreshing mint and lime drink with soda',
        price: 80,
        image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=300&h=200&fit=crop',
        isVeg: true,
        rating: 4.2,
        reviewCount: 89,
        preparationTime: 5,
        calories: 120,
        tags: ['Refreshing', 'Mint', 'Citrus'],
        isRefreshing: true
      }
    ]
  };

  useEffect(() => {
    fetchData();
    loadFavorites();
  }, [restaurantId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Simulate restaurant data
      const restaurantData = {
        _id: restaurantId,
        name: 'Gourmet Kitchen',
        cuisine: 'Multi-Cuisine',
        location: 'Coimbatore, Tamil Nadu',
        rating: 4.5,
        price: '₹500 for two',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
        deliveryTime: '25-35 mins',
        offers: ['20% OFF', 'Free Delivery'],
        isOpen: true,
        totalReviews: 1250
      };
      
      setRestaurant(restaurantData);
      setMenu(enhancedMenu);
      setActiveCategory('Signature Dishes');
      
      // Load cart from localStorage
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = () => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  };

  const toggleFavorite = (itemId) => {
    const newFavorites = favorites.includes(itemId)
      ? favorites.filter(id => id !== itemId)
      : [...favorites, itemId];
    
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const addToCart = (menuItem) => {
    if (!user) {
      navigate('/login');
      return;
    }

    const newItem = {
      _id: Date.now().toString(),
      menuItem: menuItem,
      quantity: 1,
      customizations: []
    };
    
    const existingItemIndex = cart.items.findIndex(item => item.menuItem._id === menuItem._id);
    
    let updatedItems;
    if (existingItemIndex >= 0) {
      updatedItems = [...cart.items];
      updatedItems[existingItemIndex].quantity += 1;
    } else {
      updatedItems = [...cart.items, newItem];
    }
    
    const newTotal = updatedItems.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0);
    const newCart = { items: updatedItems, totalAmount: newTotal };
    
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const updateCartItem = (itemId, quantity) => {
    const updatedItems = cart.items.map(item => 
      item._id === itemId ? { ...item, quantity } : item
    );
    const newTotal = updatedItems.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0);
    const newCart = { items: updatedItems, totalAmount: newTotal };
    
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const removeFromCart = (itemId) => {
    const updatedItems = cart.items.filter(item => item._id !== itemId);
    const newTotal = updatedItems.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0);
    const newCart = { items: updatedItems, totalAmount: newTotal };
    
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const getItemQuantityInCart = (menuItemId) => {
    const cartItem = cart.items?.find(item => item.menuItem._id === menuItemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const filteredMenuItems = () => {
    if (!menu[activeCategory]) return [];
    
    return menu[activeCategory].filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesVegFilter = filterVeg === 'all' || 
                              (filterVeg === 'veg' && item.isVeg) ||
                              (filterVeg === 'non-veg' && !item.isVeg);
      
      return matchesSearch && matchesVegFilter;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <div className="text-xl">Loading delicious menu...</div>
        </div>
      </div>
    );
  }

  const categories = Object.keys(menu);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Restaurant Header */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={restaurant?.image}
                alt={restaurant?.name}
                className="w-20 h-20 object-cover rounded-xl mr-6 shadow-lg"
              />
              <div>
                <h1 className="text-3xl font-bold mb-2">{restaurant?.name}</h1>
                <p className="text-red-100 mb-1">{restaurant?.cuisine}</p>
                <p className="text-red-100 mb-2">{restaurant?.location}</p>
                <div className="flex items-center space-x-4">
                  <span className="bg-white text-red-500 px-2 py-1 rounded-full text-sm font-semibold">
                    ★ {restaurant?.rating} ({restaurant?.totalReviews})
                  </span>
                  <span className="text-red-100">{restaurant?.deliveryTime}</span>
                  <span className="text-red-100">{restaurant?.price}</span>
                </div>
                <div className="flex space-x-2 mt-2">
                  {restaurant?.offers?.map((offer, index) => (
                    <span key={index} className="bg-green-500 text-white px-2 py-1 rounded text-xs">
                      {offer}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Enhanced Cart Button */}
            {user && cart.items?.length > 0 && (
              <button
                onClick={() => setShowCart(true)}
                className="bg-white text-red-500 px-6 py-3 rounded-xl hover:bg-red-50 flex items-center shadow-lg transform hover:scale-105 transition-all"
              >
                <span className="mr-2 text-xl">🛒</span>
                <div className="text-left">
                  <div className="font-semibold">{cart.items.length} items</div>
                  <div className="text-sm">₹{cart.totalAmount}</div>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Enhanced Search and Filters */}
        <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search for dishes, ingredients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-4 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
              />
              <span className="absolute left-4 top-4 text-gray-400">🔍</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterVeg('all')}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${filterVeg === 'all' ? 'bg-red-500 text-white shadow-lg' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilterVeg('veg')}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${filterVeg === 'veg' ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                🟢 Veg
              </button>
              <button
                onClick={() => setFilterVeg('non-veg')}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${filterVeg === 'non-veg' ? 'bg-red-500 text-white shadow-lg' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                🔴 Non-Veg
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Enhanced Category Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-6 text-gray-800">Menu Categories</h3>
              <div className="space-y-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`w-full text-left px-4 py-4 rounded-xl transition-all transform hover:scale-105 ${
                      activeCategory === category
                        ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                        : 'hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{category}</span>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        activeCategory === category ? 'bg-white text-red-500' : 'bg-gray-200'
                      }`}>
                        {menu[category]?.length || 0}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Menu Items */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">{activeCategory}</h2>
              <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {filteredMenuItems().length} items
              </span>
            </div>
            
            {filteredMenuItems().length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                <div className="text-6xl mb-4">🍽️</div>
                <div className="text-xl text-gray-500 mb-2">No items found</div>
                <p className="text-gray-400">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredMenuItems().map((item) => {
                  const quantityInCart = getItemQuantityInCart(item._id);
                  const isFavorite = favorites.includes(item._id);
                  
                  return (
                    <div key={item._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:scale-105">
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-48 object-cover"
                        />
                        
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col space-y-1">
                          {item.isPopular && (
                            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                              🔥 Popular
                            </span>
                          )}
                          {item.isNew && (
                            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                              ✨ New
                            </span>
                          )}
                          {item.isHealthy && (
                            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                              💚 Healthy
                            </span>
                          )}
                          {item.discount && (
                            <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                              {item.discount}% OFF
                            </span>
                          )}
                        </div>

                        {/* Favorite Button */}
                        <button
                          onClick={() => toggleFavorite(item._id)}
                          className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            isFavorite ? 'bg-red-500 text-white' : 'bg-white text-gray-400 hover:text-red-500'
                          }`}
                        >
                          {isFavorite ? '❤️' : '🤍'}
                        </button>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            item.isVeg ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                        
                        {/* Tags */}
                        {item.tags && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {item.tags.slice(0, 3).map((tag, index) => (
                              <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              {item.originalPrice && (
                                <span className="text-gray-400 line-through mr-2">₹{item.originalPrice}</span>
                              )}
                              <span className="text-2xl font-bold text-green-600">₹{item.price}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <span className="flex items-center">
                                <span className="text-yellow-500 mr-1">★</span>
                                {item.rating}
                              </span>
                              <span>•</span>
                              <span>{item.preparationTime} min</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Nutrition & Reviews Buttons */}
                        <div className="flex space-x-2 mb-4">
                          <button
                            onClick={() => setShowNutrition({...showNutrition, [item._id]: !showNutrition[item._id]})}
                            className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-200"
                          >
                            📊 Nutrition
                          </button>
                          <button
                            onClick={() => setShowReviews({...showReviews, [item._id]: !showReviews[item._id]})}
                            className="text-xs bg-purple-100 text-purple-600 px-3 py-1 rounded-full hover:bg-purple-200"
                          >
                            💬 Reviews ({item.reviewCount})
                          </button>
                        </div>

                        {/* Nutrition Info */}
                        {showNutrition[item._id] && (
                          <div className="bg-blue-50 p-3 rounded-lg mb-4">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>Calories: <span className="font-semibold">{item.calories}</span></div>
                              <div>Protein: <span className="font-semibold">{item.protein}</span></div>
                              <div>Carbs: <span className="font-semibold">{item.carbs}</span></div>
                              <div>Fat: <span className="font-semibold">{item.fat}</span></div>
                            </div>
                            {item.allergens && (
                              <div className="mt-2 text-xs text-red-600">
                                Allergens: {item.allergens.join(', ')}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Reviews */}
                        {showReviews[item._id] && item.reviews && (
                          <div className="bg-purple-50 p-3 rounded-lg mb-4 max-h-32 overflow-y-auto">
                            {item.reviews.map((review, index) => (
                              <div key={index} className="mb-2 last:mb-0">
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-sm">{review.user}</span>
                                  <span className="text-yellow-500 text-sm">{'★'.repeat(review.rating)}</span>
                                </div>
                                <p className="text-xs text-gray-600">{review.comment}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Add to Cart Controls */}
                        {quantityInCart === 0 ? (
                          <button
                            onClick={() => addToCart(item)}
                            className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 rounded-xl hover:from-red-600 hover:to-orange-600 transition-all transform hover:scale-105 font-semibold shadow-lg"
                          >
                            Add to Cart
                          </button>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => {
                                  const cartItem = cart.items.find(cartItem => cartItem.menuItem._id === item._id);
                                  if (cartItem) {
                                    if (quantityInCart === 1) {
                                      removeFromCart(cartItem._id);
                                    } else {
                                      updateCartItem(cartItem._id, quantityInCart - 1);
                                    }
                                  }
                                }}
                                className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-all transform hover:scale-110"
                              >
                                -
                              </button>
                              <span className="font-bold text-lg">{quantityInCart}</span>
                              <button
                                onClick={() => {
                                  const cartItem = cart.items.find(cartItem => cartItem.menuItem._id === item._id);
                                  if (cartItem) {
                                    updateCartItem(cartItem._id, quantityInCart + 1);
                                  }
                                }}
                                className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all transform hover:scale-110"
                              >
                                +
                              </button>
                            </div>
                            <span className="text-green-600 font-bold text-lg">
                              ₹{item.price * quantityInCart}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Your Cart 🛒</h3>
              <button
                onClick={() => setShowCart(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl transform hover:scale-110 transition-all"
              >
                ✕
              </button>
            </div>
            
            {cart.items?.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🛒</div>
                <div className="text-gray-500 text-lg">Your cart is empty</div>
                <p className="text-gray-400 text-sm">Add some delicious items!</p>
              </div>
            ) : (
              <div>
                <div className="space-y-4 mb-6">
                  {cart.items?.map((item) => (
                    <div key={item._id} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                      <div className="flex items-center flex-1">
                        <img
                          src={item.menuItem.image}
                          alt={item.menuItem.name}
                          className="w-12 h-12 object-cover rounded-lg mr-3"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{item.menuItem.name}</h4>
                          <p className="text-sm text-gray-600">₹{item.menuItem.price} each</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            if (item.quantity === 1) {
                              removeFromCart(item._id);
                            } else {
                              updateCartItem(item._id, item.quantity - 1);
                            }
                          }}
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm hover:bg-gray-300 transition-all"
                        >
                          -
                        </button>
                        <span className="font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateCartItem(item._id, item.quantity + 1)}
                          className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-all"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-bold text-gray-800">Total: ₹{cart.totalAmount}</span>
                  </div>
                  <button
                    onClick={() => {
                      setShowCart(false);
                      navigate('/checkout');
                    }}
                    className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 rounded-xl hover:from-red-600 hover:to-orange-600 transition-all transform hover:scale-105 font-semibold shadow-lg"
                  >
                    Proceed to Checkout 🚀
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;