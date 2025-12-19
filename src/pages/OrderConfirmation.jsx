import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [trackingSteps, setTrackingSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState('');

  useEffect(() => {
    // Load order from localStorage or create sample data
    const savedOrder = localStorage.getItem('lastOrder');
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    } else {
      // Sample order data
      setOrder({
        orderId,
        customerName: 'John Doe',
        customerPhone: '9876543210',
        orderType: 'delivery',
        paymentMethod: 'cash',
        deliveryAddress: {
          street: '123 Main Street',
          city: 'Coimbatore',
          state: 'Tamil Nadu',
          zipCode: '641001'
        },
        items: [
          {
            _id: '1',
            menuItem: {
              name: 'Chef\'s Special Biryani',
              price: 350,
              image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=300&h=200&fit=crop',
              restaurant: 'Spice Symphony'
            },
            quantity: 2,
            customizations: ['Extra Spicy', 'No Onions']
          }
        ],
        totals: {
          subtotal: 700,
          deliveryFee: 50,
          tax: 126,
          tip: 30,
          discount: 0,
          total: 906
        },
        estimatedTime: '7:30 PM'
      });
    }

    // Initialize tracking steps
    const steps = [
      { title: 'Order Confirmed', description: 'Your order has been placed successfully', icon: '✅', completed: true },
      { title: 'Preparing', description: 'Restaurant is preparing your food', icon: '👨‍🍳', completed: false },
      { title: 'Ready for Pickup', description: 'Food is ready, delivery partner assigned', icon: '📦', completed: false },
      { title: 'On the Way', description: 'Your order is on its way to you', icon: '🚚', completed: false },
      { title: 'Delivered', description: 'Order delivered successfully', icon: '🎉', completed: false }
    ];
    
    setTrackingSteps(steps);
    
    // Simulate order progress
    simulateOrderProgress(steps);
    
    // Set estimated delivery time
    const now = new Date();
    now.setMinutes(now.getMinutes() + 35);
    setEstimatedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, [orderId]);

  const simulateOrderProgress = (steps) => {
    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length - 1) {
        stepIndex++;
        setCurrentStep(stepIndex);
        setTrackingSteps(prev => prev.map((step, index) => ({
          ...step,
          completed: index <= stepIndex
        })));
      } else {
        clearInterval(interval);
      }
    }, 10000); // Progress every 10 seconds for demo
  };

  const shareOrder = (platform) => {
    const message = `Just ordered delicious food from ${order?.items[0]?.menuItem?.restaurant}! Order ID: ${orderId}`;
    const url = window.location.href;
    
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(message + ' ' + url)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      default:
        navigator.clipboard.writeText(url);
        alert('Order link copied to clipboard!');
    }
    setShowShareModal(false);
  };

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <div className="text-xl">Loading order details...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 opacity-10"></div>
          <div className="relative z-10">
            <div className="text-8xl mb-4 animate-bounce">🎉</div>
            <h1 className="text-4xl font-bold mb-4 text-gray-800">Order Confirmed!</h1>
            <p className="text-xl text-gray-600 mb-6">
              Thank you for your order! We're preparing something delicious for you.
            </p>
            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl p-4 inline-block">
              <div className="text-sm opacity-90">Order ID</div>
              <div className="font-mono font-bold text-xl">{orderId}</div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={() => setShowShareModal(true)}
                className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 font-semibold flex items-center space-x-2 transform hover:scale-105 transition-all"
              >
                <span>📤</span>
                <span>Share Order</span>
              </button>
              <button
                onClick={() => window.print()}
                className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 font-semibold flex items-center space-x-2 transform hover:scale-105 transition-all"
              >
                <span>🖨️</span>
                <span>Print Receipt</span>
              </button>
            </div>
          </div>
        </div>

        {/* Order Tracking */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">📍 Track Your Order</h2>
            <div className="text-right">
              <div className="text-sm text-gray-600">Estimated Delivery</div>
              <div className="text-xl font-bold text-green-600">{estimatedTime}</div>
            </div>
          </div>
          
          <div className="relative">
            {trackingSteps.map((step, index) => (
              <div key={index} className="flex items-center mb-8 last:mb-0">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold transition-all ${
                  step.completed 
                    ? 'bg-green-500 text-white shadow-lg transform scale-110' 
                    : index === currentStep 
                      ? 'bg-yellow-400 text-white animate-pulse shadow-lg' 
                      : 'bg-gray-200 text-gray-400'
                }`}>
                  {step.icon}
                </div>
                
                <div className="ml-6 flex-1">
                  <h3 className={`text-lg font-semibold ${
                    step.completed ? 'text-green-600' : index === currentStep ? 'text-yellow-600' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                  {step.completed && (
                    <p className="text-sm text-green-500 font-medium">✓ Completed</p>
                  )}
                </div>
                
                {index < trackingSteps.length - 1 && (
                  <div className={`absolute left-8 w-0.5 h-16 mt-16 ${
                    step.completed ? 'bg-green-500' : 'bg-gray-200'
                  }`} style={{ top: `${index * 112 + 64}px` }}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
              🛒 Order Details
            </h2>
            
            {/* Restaurant Info */}
            <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl">
              <h3 className="font-bold text-lg text-gray-800">🏪 {order.items[0]?.menuItem?.restaurant}</h3>
              <p className="text-gray-600">Order Type: <span className="capitalize font-medium">{order.orderType}</span></p>
              <p className="text-gray-600">Payment: <span className="capitalize font-medium">{order.paymentMethod}</span></p>
            </div>
            
            {/* Order Items */}
            <div className="space-y-4 mb-6">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center flex-1">
                    <img
                      src={item.menuItem.image}
                      alt={item.menuItem.name}
                      className="w-16 h-16 object-cover rounded-xl mr-4"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{item.menuItem.name}</h4>
                      <p className="text-sm text-gray-600">₹{item.menuItem.price} × {item.quantity}</p>
                      {item.customizations && item.customizations.length > 0 && (
                        <p className="text-xs text-blue-600 mt-1">
                          🔧 {item.customizations.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="font-bold text-lg text-gray-800">₹{item.menuItem.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Customer Info */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-800 mb-3">👤 Customer Information</h3>
              <div className="space-y-2 text-gray-600">
                <p><span className="font-medium">Name:</span> {order.customerName}</p>
                <p><span className="font-medium">Phone:</span> {order.customerPhone}</p>
              </div>
            </div>
          </div>

          {/* Delivery Address & Bill */}
          <div className="space-y-8">
            {/* Delivery Address */}
            {order.orderType === 'delivery' && order.deliveryAddress && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                  🏠 Delivery Address
                </h2>
                <div className="bg-blue-50 p-4 rounded-xl">
                  <p className="text-gray-800 font-medium">{order.deliveryAddress.street}</p>
                  <p className="text-gray-600">
                    {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                  </p>
                  {order.deliveryAddress.landmark && (
                    <p className="text-sm text-gray-500 mt-1">
                      📍 Near: {order.deliveryAddress.landmark}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Bill Details */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                💰 Bill Details
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{order.totals.subtotal.toFixed(2)}</span>
                </div>
                {order.totals.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{order.totals.discount.toFixed(2)}</span>
                  </div>
                )}
                {order.totals.deliveryFee > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>₹{order.totals.deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Tax (18% GST)</span>
                  <span>₹{order.totals.tax.toFixed(2)}</span>
                </div>
                {order.totals.tip > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Tip</span>
                    <span>₹{order.totals.tip.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-xl text-gray-800 border-t pt-3">
                  <span>Total Paid</span>
                  <span>₹{order.totals.total.toFixed(2)}</span>
                </div>
              </div>

              {order.totals.discount > 0 && (
                <div className="mt-4 p-3 bg-green-50 rounded-xl">
                  <p className="text-green-700 font-medium text-center">
                    🎉 You saved ₹{order.totals.discount.toFixed(2)} on this order!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link
            to="/orders"
            className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 px-6 rounded-xl hover:from-red-600 hover:to-orange-600 text-center font-semibold transform hover:scale-105 transition-all"
          >
            📋 View All Orders
          </Link>
          <Link
            to="/restaurants"
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 px-6 rounded-xl hover:from-blue-600 hover:to-purple-600 text-center font-semibold transform hover:scale-105 transition-all"
          >
            🍽️ Order Again
          </Link>
          <button
            onClick={() => window.location.href = `tel:${order.customerPhone}`}
            className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 text-white py-4 px-6 rounded-xl hover:from-green-600 hover:to-teal-600 font-semibold transform hover:scale-105 transition-all"
          >
            📞 Call Support
          </button>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">📤 Share Your Order</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => shareOrder('whatsapp')}
                  className="bg-green-500 text-white p-4 rounded-xl hover:bg-green-600 font-semibold flex items-center justify-center space-x-2"
                >
                  <span>📱</span>
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={() => shareOrder('twitter')}
                  className="bg-blue-400 text-white p-4 rounded-xl hover:bg-blue-500 font-semibold flex items-center justify-center space-x-2"
                >
                  <span>🐦</span>
                  <span>Twitter</span>
                </button>
                <button
                  onClick={() => shareOrder('facebook')}
                  className="bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700 font-semibold flex items-center justify-center space-x-2"
                >
                  <span>📘</span>
                  <span>Facebook</span>
                </button>
                <button
                  onClick={() => shareOrder('copy')}
                  className="bg-gray-500 text-white p-4 rounded-xl hover:bg-gray-600 font-semibold flex items-center justify-center space-x-2"
                >
                  <span>📋</span>
                  <span>Copy Link</span>
                </button>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="w-full mt-4 bg-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-300 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderConfirmation;