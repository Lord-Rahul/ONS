import React from 'react';

const ShippingInfo = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative min-h-80 flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-white">
        <div className="relative max-w-4xl mx-auto px-6 text-center py-16">
          <div className="mb-6">
            <div className="w-24 h-px bg-black mx-auto mb-4"></div>
            <span className="inline-block px-6 py-2 border border-gray-300 text-gray-800 rounded-full text-sm font-light tracking-[0.15em] uppercase">
              Shipping
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-light text-black mb-4 leading-tight">
            Shipping Information
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="space-y-12">
          {/* Shipping Rates */}
          <div>
            <h2 className="text-3xl font-light text-black mb-6">Shipping Rates & Delivery Times</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 p-6">
                <h3 className="text-xl font-light text-black mb-3">Standard Shipping</h3>
                <div className="space-y-2 text-gray-700 font-light">
                  <p><strong>Delivery Time:</strong> 5-7 business days</p>
                  <p><strong>Cost:</strong> Free on orders above ₹999</p>
                  <p><strong>Cost:</strong> ₹99 on orders below ₹999</p>
                </div>
              </div>

              <div className="border border-black p-6 bg-gray-50">
                <h3 className="text-xl font-light text-black mb-3">Express Shipping</h3>
                <div className="space-y-2 text-gray-700 font-light">
                  <p><strong>Delivery Time:</strong> 2-3 business days</p>
                  <p><strong>Cost:</strong> ₹299 (All orders)</p>
                  <p><strong>Available in:</strong> Metro cities</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Partners */}
          <div>
            <h2 className="text-3xl font-light text-black mb-6">Our Shipping Partners</h2>
            <p className="text-gray-700 font-light mb-6">
              We partner with India's most reliable courier services to ensure your orders are delivered safely and on time.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['DHL Express', 'FedEx India', 'Blue Dart'].map((partner) => (
                <div key={partner} className="border border-gray-200 p-6 text-center">
                  <div className="h-24 bg-gray-100 rounded mb-4 flex items-center justify-center">
                    <span className="text-gray-600 font-light text-sm">{partner}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Tracking */}
          <div>
            <h2 className="text-3xl font-light text-black mb-6">Tracking Your Order</h2>
            <div className="bg-gray-50 p-8 rounded-lg space-y-4">
              <p className="text-gray-700 font-light">
                Once your order ships, you'll receive an email with your tracking number. You can:
              </p>
              <ul className="list-none space-y-3 pl-0">
                <li className="flex gap-3">
                  <span className="text-black font-light">•</span>
                  <span className="text-gray-700 font-light">Track your shipment in real-time from your account</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-black font-light">•</span>
                  <span className="text-gray-700 font-light">Receive SMS updates at each delivery milestone</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-black font-light">•</span>
                  <span className="text-gray-700 font-light">Contact courier support directly for any queries</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-black font-light">•</span>
                  <span className="text-gray-700 font-light">Request signature confirmation or leave-at-door option</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Packaging */}
          <div>
            <h2 className="text-3xl font-light text-black mb-6">Our Packaging</h2>
            <p className="text-gray-700 font-light mb-6">
              We take great care in packaging your orders to ensure they arrive in perfect condition. Our packaging is:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 p-6">
                <h3 className="text-lg font-light text-black mb-3">Eco-Friendly</h3>
                <p className="text-gray-600 font-light">
                  We use recyclable and biodegradable packaging materials to minimize environmental impact.
                </p>
              </div>
              <div className="border border-gray-200 p-6">
                <h3 className="text-lg font-light text-black mb-3">Secure</h3>
                <p className="text-gray-600 font-light">
                  Your items are carefully wrapped and protected to ensure safe delivery without damage.
                </p>
              </div>
            </div>
          </div>

          {/* International Shipping */}
          <div className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-light text-black mb-4">International Shipping</h2>
            <p className="text-gray-700 font-light">
              Currently, we ship only within India. We're expanding our international operations and will soon offer shipping to select countries. Subscribe to our newsletter to be notified when international shipping becomes available.
            </p>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-3xl font-light text-black mb-6">Shipping FAQs</h2>
            <div className="space-y-4">
              <div className="border border-gray-200 p-4">
                <h3 className="font-light text-black mb-2">What if my order doesn't arrive on time?</h3>
                <p className="text-gray-600 font-light text-sm">
                  Contact our support team immediately. We'll investigate with the courier and provide a solution, including re-shipment if necessary.
                </p>
              </div>
              <div className="border border-gray-200 p-4">
                <h3 className="font-light text-black mb-2">Can I change my delivery address?</h3>
                <p className="text-gray-600 font-light text-sm">
                  You can change your address before the order ships. Contact us immediately if you need to make changes.
                </p>
              </div>
              <div className="border border-gray-200 p-4">
                <h3 className="font-light text-black mb-2">Do you deliver to PO boxes?</h3>
                <p className="text-gray-600 font-light text-sm">
                  We deliver to residential and commercial addresses only. PO boxes cannot be delivered to.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;
