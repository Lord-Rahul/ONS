import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useToast from '../hooks/useToast.js';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToast } = useToast();

  useEffect(() => {
    // Show success message
    addToast('Payment successful! 🎉', 'success');
    
    // Redirect to orders page after 3 seconds
    const timer = setTimeout(() => {
      navigate('/orders');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, addToast]);

  const orderId = searchParams.get('orderId');
  const paymentId = searchParams.get('paymentId');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg 
            className="w-10 h-10 text-green-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Your order has been placed successfully and payment has been confirmed.
        </p>
        
        {/* Payment Details */}
        {(orderId || paymentId) && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-2">Transaction Details</h3>
            {orderId && (
              <p className="text-sm text-gray-600">
                Order ID: <span className="font-mono">{orderId}</span>
              </p>
            )}
            {paymentId && (
              <p className="text-sm text-gray-600">
                Payment ID: <span className="font-mono">{paymentId}</span>
              </p>
            )}
          </div>
        )}
        
        {/* Auto redirect message */}
        <p className="text-sm text-gray-500 mb-6">
          You will be redirected to your orders page in a few seconds...
        </p>
        
        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/orders')}
            className="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
          >
            View My Orders
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Continue Shopping
          </button>
        </div>
        
        {/* Support Message */}
        <p className="text-xs text-gray-500 mt-6">
          Need help? Contact our support team for assistance.
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;