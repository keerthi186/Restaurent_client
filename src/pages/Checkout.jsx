import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [orderData, setOrderData] = useState({
    orderType: 'delivery',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    paymentMethod: 'cash',
    deliveryAddress: {
      street: '',
      landmark: '',
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      zipCode: '',
      phone: ''
    },
    specialInstructions: '',
    deliverySlot: '',
    promoCode: '',
    tipAmount: 0
  });
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState('');
  
  const user = JSON.parse(localStorage.getItem('user'));

  // Sample promo codes
  const promoCodes = {
    'FIRST50': { discount: 50, type: 'percentage', minOrder: 299, description: '50% off on first order' },
    'SAVE100': { discount: 100, type: 'fixed', minOrder: 500, description: '₹100 off on orders above ₹500' },
    'WEEKEND25': { discount: 25, type: 'percentage', minOrder: 200, description: '25% off weekend special' }
  };

  // Delivery time slots
  const deliverySlots = [
    'ASAP (25-35 mins)',
    '12:00 PM - 1:00 PM',
    '1:00 PM - 2:00 PM',
    '2:00 PM - 3:00 PM',
    '7:00 PM - 8:00 PM',
    '8:00 PM - 9:00 PM',
    '9:00 PM - 10:00 PM'
  ];

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      // Sample cart for demo
      setCart({
        items: [
          {
            _id: '1',
            menuItem: {
              _id: '1',
              name: 'Chef\'s Special Biryani',
              price: 350,
              image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=300&h=200&fit=crop',
              restaurant: 'Spice Symphony'
            },
            quantity: 2,
            customizations: ['Extra Spicy', 'No Onions']
          },
          {
            _id: '2',
            menuItem: {
              _id: '2',
              name: 'Chocolate Lava Cake',
              price: 180,
              image: 'https://images.unsplash.com/photo-1571167530149-c72f2b2c3f44?w=300&h=200&fit=crop',
              restaurant: 'Spice Symphony'
            },
            quantity: 1,
            customizations: []
          }
        ],
        totalAmount: 880
      });
    }
    
    // Pre-fill customer data
    setOrderData(prev => ({
      ...prev,
      customerName: user.name || 'John Doe',
      customerEmail: user.email || 'john@example.com',
      customerPhone: '9876543210'
    }));

    // Set estimated delivery time
    const now = new Date();
    now.setMinutes(now.getMinutes() + 35);
    setEstimatedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setOrderData(prev => ({
        ...prev,
        deliveryAddress: {
          ...prev.deliveryAddress,
          [addressField]: value
        }
      }));
    } else {
      setOrderData(prev => ({ ...prev, [name]: value }));
    }
  };

  const applyPromoCode = () => {
    const promo = promoCodes[orderData.promoCode.toUpperCase()];
    if (promo && cart.totalAmount >= promo.minOrder) {
      const discountAmount = promo.type === 'percentage' 
        ? (cart.totalAmount * promo.discount) / 100
        : promo.discount;
      setDiscount(discountAmount);
      setPromoApplied(true);
    } else {
      alert('Invalid promo code or minimum order not met');
    }
  };

  const removePromoCode = () => {
    setDiscount(0);
    setPromoApplied(false);
    setOrderData(prev => ({ ...prev, promoCode: '' }));
  };

  const calculateTotals = () => {
    const subtotal = cart.totalAmount || 0;
    const deliveryFee = orderData.orderType === 'delivery' ? 50 : 0;
    const tax = (subtotal - discount) * 0.18;
    const tip = orderData.tipAmount || 0;
    const total = subtotal + deliveryFee + tax + tip - discount;
    
    return { subtotal, deliveryFee, tax, tip, discount, total };
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate order placement with delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const orderId = Date.now().toString();
      
      // Clear cart
      localStorage.removeItem('cart');
      
      // Store order details for confirmation page
      localStorage.setItem('lastOrder', JSON.stringify({
        orderId,
        ...orderData,
        items: cart.items,
        totals: calculateTotals(),
        estimatedTime
      }));
      
      // Redirect to order confirmation
      navigate(`/order-confirmation/${orderId}`);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-12 rounded-2xl shadow-lg">
          <div className="text-6xl mb-4">🛒</div>
          <div className="text-2xl font-bold mb-4 text-gray-800">Your cart is empty</div>
          <p className="text-gray-600 mb-6">Add some delicious items to get started!</p>
          <button
            onClick={() => navigate('/restaurants')}
            className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-3 rounded-xl hover:from-red-600 hover:to-orange-600 font-semibold transform hover:scale-105 transition-all"
          >
            Browse Restaurants 🍽️
          </button>
        </div>
      </div>
    );
  }

  const { subtotal, deliveryFee, tax, tip, total } = calculateTotals();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🛒 Checkout</h1>
          <p className="text-gray-600">Complete your order in just a few steps</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= stepNum ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-16 h-1 mx-2 ${step > stepNum ? 'bg-red-500' : 'bg-gray-200'}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              {/* Step 1: Order Details */}
              {step === 1 && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                    📋 Order Details
                  </h2>
                  
                  {/* Order Type */}
                  <div className="mb-6">
                    <label className="block text-lg font-semibold mb-4 text-gray-700">Order Type</label>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { value: 'delivery', icon: '🚚', label: 'Delivery', desc: 'Get it delivered' },
                        { value: 'pickup', icon: '🏃', label: 'Pickup', desc: 'Collect yourself' },
                        { value: 'dine-in', icon: '🍽️', label: 'Dine-in', desc: 'Eat at restaurant' }
                      ].map((option) => (
                        <label key={option.value} className="cursor-pointer">
                          <input
                            type="radio"
                            name="orderType"
                            value={option.value}
                            checked={orderData.orderType === option.value}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <div className={`p-4 rounded-xl border-2 text-center transition-all ${
                            orderData.orderType === option.value
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}>
                            <div className="text-3xl mb-2">{option.icon}</div>
                            <div className="font-semibold">{option.label}</div>
                            <div className="text-sm text-gray-500">{option.desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">👤 Customer Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="customerName"
                        placeholder="Full Name"
                        value={orderData.customerName}
                        onChange={handleInputChange}
                        className="p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                        required
                      />
                      <input
                        type="tel"
                        name="customerPhone"
                        placeholder="Phone Number"
                        value={orderData.customerPhone}
                        onChange={handleInputChange}
                        className="p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                        required
                      />
                      <input
                        type="email"
                        name="customerEmail"
                        placeholder="Email Address"
                        value={orderData.customerEmail}
                        onChange={handleInputChange}
                        className="p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 md:col-span-2"
                        required
                      />
                    </div>
                  </div>

                  {/* Delivery Time Slot */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">⏰ Delivery Time</h3>
                    <select
                      name="deliverySlot"
                      value={orderData.deliverySlot}
                      onChange={handleInputChange}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                    >
                      <option value="">Select delivery time</option>
                      {deliverySlots.map((slot, index) => (
                        <option key={index} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 rounded-xl hover:from-red-600 hover:to-orange-600 font-semibold text-lg transform hover:scale-105 transition-all"
                  >
                    Continue to Address 📍
                  </button>
                </div>
              )}

              {/* Step 2: Address & Special Instructions */}
              {step === 2 && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                    📍 Delivery Address
                  </h2>

                  {orderData.orderType === 'delivery' && (
                    <div className="mb-6">
                      <div className="space-y-4">
                        <input
                          type="text"
                          name="address.street"
                          placeholder="Street Address"
                          value={orderData.deliveryAddress.street}
                          onChange={handleInputChange}
                          className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                          required
                        />
                        <input
                          type="text"
                          name="address.landmark"
                          placeholder="Landmark (Optional)"
                          value={orderData.deliveryAddress.landmark}
                          onChange={handleInputChange}
                          className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <input
                            type="text"
                            name="address.city"
                            placeholder="City"
                            value={orderData.deliveryAddress.city}
                            onChange={handleInputChange}
                            className="p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                            required
                          />
                          <input
                            type="text"
                            name="address.state"
                            placeholder="State"
                            value={orderData.deliveryAddress.state}
                            onChange={handleInputChange}
                            className="p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                            required
                          />
                          <input
                            type="text"
                            name="address.zipCode"
                            placeholder="ZIP Code"
                            value={orderData.deliveryAddress.zipCode}
                            onChange={handleInputChange}
                            className="p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Special Instructions */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">📝 Special Instructions</h3>
                    <textarea
                      name="specialInstructions"
                      placeholder="Any special instructions for the restaurant or delivery partner..."
                      value={orderData.specialInstructions}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl hover:bg-gray-300 font-semibold"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 rounded-xl hover:from-red-600 hover:to-orange-600 font-semibold"
                    >
                      Continue to Payment 💳
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment & Final Review */}
              {step === 3 && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                    💳 Payment & Review
                  </h2>

                  {/* Payment Method */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Payment Method</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { value: 'cash', icon: '💵', label: 'Cash on Delivery' },
                        { value: 'card', icon: '💳', label: 'Credit/Debit Card' },
                        { value: 'upi', icon: '📱', label: 'UPI' },
                        { value: 'wallet', icon: '👛', label: 'Digital Wallet' }
                      ].map((method) => (
                        <label key={method.value} className="cursor-pointer">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.value}
                            checked={orderData.paymentMethod === method.value}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <div className={`p-4 rounded-xl border-2 text-center transition-all ${
                            orderData.paymentMethod === method.value
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}>
                            <div className="text-2xl mb-2">{method.icon}</div>
                            <div className="text-sm font-medium">{method.label}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Tip Section */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">💝 Add Tip for Delivery Partner</h3>
                    <div className="flex space-x-3">
                      {[0, 20, 30, 50].map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => setOrderData(prev => ({ ...prev, tipAmount: amount }))}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            orderData.tipAmount === amount
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          {amount === 0 ? 'No Tip' : `₹${amount}`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl hover:bg-gray-300 font-semibold"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-xl hover:from-green-600 hover:to-blue-600 font-semibold disabled:opacity-50 transform hover:scale-105 transition-all"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                          Placing Order...
                        </div>
                      ) : (
                        `Place Order - ₹${total.toFixed(2)} 🚀`
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-6 text-gray-800">📋 Order Summary</h3>
              
              {/* Restaurant Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-800">🏪 {cart.items[0]?.menuItem?.restaurant || 'Restaurant'}</h4>
                <p className="text-sm text-gray-600">Estimated delivery: {estimatedTime}</p>
              </div>
              
              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {cart.items.map((item) => (
                  <div key={item._id} className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <img
                        src={item.menuItem.image}
                        alt={item.menuItem.name}
                        className="w-12 h-12 object-cover rounded-lg mr-3"
                      />
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-800">{item.menuItem.name}</h5>
                        <p className="text-sm text-gray-600">₹{item.menuItem.price} × {item.quantity}</p>
                        {item.customizations.length > 0 && (
                          <p className="text-xs text-blue-600">{item.customizations.join(', ')}</p>
                        )}
                      </div>
                    </div>
                    <span className="font-semibold text-gray-800">₹{item.menuItem.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Promo Code */}
              <div className="mb-6">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    name="promoCode"
                    placeholder="Enter promo code"
                    value={orderData.promoCode}
                    onChange={handleInputChange}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                    disabled={promoApplied}
                  />
                  {!promoApplied ? (
                    <button
                      type="button"
                      onClick={applyPromoCode}
                      className="bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 font-medium"
                    >
                      Apply
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={removePromoCode}
                      className="bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600 font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>
                {promoApplied && (
                  <p className="text-green-600 text-sm mt-2">✅ Promo code applied successfully!</p>
                )}
              </div>
              
              {/* Bill Details */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                {deliveryFee > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>₹{deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Tax (18% GST)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                {tip > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Tip</span>
                    <span>₹{tip.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-xl text-gray-800 border-t pt-3">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Savings Display */}
              {discount > 0 && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-green-700 font-medium text-center">
                    🎉 You saved ₹{discount.toFixed(2)} on this order!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;