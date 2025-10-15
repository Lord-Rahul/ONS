import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import useToast from '../hooks/useToast.js';
import orderService from '../services/orderService.js';
import razorpayService from '../services/razorpayService.js';

const Checkout = () => {
  const { user } = useAuth();
  const { items, getCartSummary, clearCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.name || user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || user?.number || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'online',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cartSummary = getCartSummary();

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      addToast('Your cart is empty', 'warning');
      navigate('/products');
    }
  }, [items.length, navigate, addToast]);

  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      errors.state = 'State is required';
    }

    if (!formData.pincode.trim()) {
      errors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      errors.pincode = 'Please enter a valid 6-digit pincode';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      addToast('Please fix the errors in the form', 'error');
      return;
    }

    if (items.length === 0) {
      addToast('Your cart is empty', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order data
      const orderData = {
        items: items.map(item => ({
          product: item.product._id || item.product,
          quantity: item.quantity,
          price: item.product.price,
          size: item.size || null,
          color: item.color || null,
        })),
        shippingAddress: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address1: formData.address, // Changed from 'address' to 'address1'
          city: formData.city,
          state: formData.state,
          pincode: parseInt(formData.pincode), // Convert to number
        },
        paymentMethod: formData.paymentMethod === 'online' ? 'UPI' : 'COD', // Map to valid enum value
        totalAmount: cartSummary.finalTotal,
      };

      console.log(' Creating order:', orderData);
      
      // Add more detailed logging for debugging
      console.log(' Order items detail:', orderData.items.map(item => ({
        productId: item.product,
        quantity: item.quantity,
        price: item.price
      })));
      
      console.log(' Shipping address:', orderData.shippingAddress);
      console.log(' Payment method:', orderData.paymentMethod);
      console.log(' Total amount:', orderData.totalAmount);

      const orderResponse = await orderService.placeOrder(orderData);

      console.log(' Order response:', orderResponse);

      if (!orderResponse.success) {
        // Better error message display
        console.error(' Order creation failed:', orderResponse.error);
        throw new Error(orderResponse.message || orderResponse.error || 'Failed to create order');
      }

      const order = orderResponse.data;
      console.log(' Order created successfully:', order);

      if (formData.paymentMethod === 'online') {
        //  Handle Razorpay payment
        console.log(' Processing Razorpay payment for order:', order._id);
        addToast('Order created! Opening payment gateway...', 'info');
        
        try {
          // Process payment with Razorpay
          const paymentResult = await razorpayService.processPayment(order._id, {
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone
          });
          
          console.log(' Payment successful:', paymentResult);
          
          // Clear cart after successful payment
          await clearCart();
          
          // Redirect to payment success page
          addToast('Payment successful! ', 'success');
          navigate('/payment/success', {
            state: {
              orderId: order._id,
              orderNumber: order.orderNumber || order._id,
              paymentId: paymentResult.paymentId
            }
          });
          
        } catch (paymentError) {
          console.error(' Payment failed:', paymentError);
          
          // Payment failed but order is created
          addToast(
            paymentError.message || 'Payment failed. You can retry from your orders page.',
            'error'
          );
          
          // Redirect to orders page
          navigate(`/orders/${order._id}`);
        }
      } else {
        // COD Order
        console.log(' COD order placed');
        await clearCart();
        addToast('Order placed successfully! ', 'success');
        navigate(`/orders/${order._id}`, { 
          state: { 
            orderCreated: true 
          } 
        });
      }

    } catch (error) {
      console.error(' Order creation failed:', error);
      
      // Better error handling with more specific messages
      let errorMessage = 'Failed to place order. ';
      
      if (error.message?.includes('product not found')) {
        errorMessage = 'Some products in your cart are no longer available. Please refresh and try again.';
      } else if (error.message?.includes('insufficient stock')) {
        errorMessage = 'Some products don\'t have enough stock. Please update quantities and try again.';
      } else if (error.message?.includes('address')) {
        errorMessage = 'Please check your shipping address and try again.';
      } else if (error.message?.includes('payment')) {
        errorMessage = 'Please check your payment method and try again.';
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Please try again or contact support if the problem persists.';
      }
      
      addToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Information</h3>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
                        formErrors.fullName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your full name"
                    />
                    {formErrors.fullName && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.fullName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
                        formErrors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your email"
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
                      formErrors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter 10-digit phone number"
                  />
                  {formErrors.phone && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
                      formErrors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full address"
                  />
                  {formErrors.address && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
                        formErrors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="City"
                    />
                    {formErrors.city && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
                        formErrors.state ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="State"
                    />
                    {formErrors.state && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.state}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
                        formErrors.pincode ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="123456"
                    />
                    {formErrors.pincode && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.pincode}</p>
                    )}
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="online"
                        checked={formData.paymentMethod === 'online'}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">💳</span>
                        <div>
                          <div className="font-medium">Online Payment</div>
                          <div className="text-sm text-gray-600">Credit/Debit Card, UPI, Net Banking</div>
                          <div className="text-xs text-green-600 mt-1">✓ Secure & Fast</div>
                        </div>
                      </div>
                    </label>
                    
                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">💵</span>
                        <div>
                          <div className="font-medium">Cash on Delivery</div>
                          <div className="text-sm text-gray-600">Pay when you receive your order</div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 h-fit">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={`${item.product._id}-${item.size}-${item.color}`} className="flex items-center space-x-4">
                  <img
                    src={item.product.images?.[0] || '/placeholder-image.jpg'}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    {item.size && <p className="text-sm text-gray-600">Size: {item.size}</p>}
                    {item.color && <p className="text-sm text-gray-600">Color: {item.color}</p>}
                  </div>
                  <span className="font-medium text-gray-900">
                    ₹{(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-lg font-medium border-t border-gray-200 pt-3">
                <span className="text-black">Total</span>
                <span className="text-black">₹{cartSummary.finalTotal.toLocaleString()}</span>
              </div>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-black text-white py-4 mt-6 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Placing Order...
                </div>
              ) : (
                `Place Order • ₹${cartSummary.finalTotal.toLocaleString()}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
