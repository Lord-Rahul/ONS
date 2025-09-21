import React from 'react';

const ShippingReturnsTab = () => {
  return (
    <div className="space-y-8">
      <ShippingSection />
      <PolicySection />
    </div>
  );
};

const ShippingSection = () => (
  <div>
    <div className="text-lg font-light text-black mb-6">Shipping Information</div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <ShippingFeatures />
      <ShippingCharges />
    </div>
  </div>
);

const ShippingFeatures = () => {
  const features = [
    {
      icon: <ShippingIcon />,
      title: "Free Shipping",
      description: "On orders above ₹999 across India",
      bgColor: "bg-green-100"
    },
    {
      icon: <ClockIcon />,
      title: "Fast Delivery",
      description: "3-7 business days for most locations",
      bgColor: "bg-blue-100"
    },
    {
      icon: <ShieldIcon />,
      title: "Secure Packaging",
      description: "Your order is carefully packed to prevent damage",
      bgColor: "bg-purple-100"
    }
  ];

  return (
    <div className="space-y-4">
      {features.map((feature, index) => (
        <div key={index} className="flex items-start">
          <div className={`w-10 h-10 ${feature.bgColor} rounded-full flex items-center justify-center mr-4 flex-shrink-0`}>
            {feature.icon}
          </div>
          <div>
            <h4 className="font-medium text-black mb-1">{feature.title}</h4>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const ShippingCharges = () => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <h4 className="font-medium text-black mb-3">Shipping Charges</h4>
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-600">Orders below ₹999:</span>
        <span className="text-black">₹99</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Orders above ₹999:</span>
        <span className="text-green-600 font-medium">FREE</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Express delivery:</span>
        <span className="text-black">₹149</span>
      </div>
    </div>
  </div>
);

const PolicySection = () => (
  <div className="border-t border-gray-200 pt-8">
    <div className="text-lg font-light text-black mb-6">Terms & Policies</div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <OrderPolicy />
      <QualityAssurance />
    </div>
    
    <CustomerSupport />
  </div>
);

const OrderPolicy = () => (
  <div>
    <h4 className="font-medium text-black mb-4">Order Policy</h4>
    <ul className="space-y-3 text-gray-600">
      {[
        'All orders are processed within 24-48 hours',
        'Order confirmation will be sent via email/SMS',
        'Delivery address cannot be changed once order is dispatched',
        'Cash on Delivery available for orders above ₹500'
      ].map((policy, index) => (
        <li key={index} className="flex items-start">
          <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
          {policy}
        </li>
      ))}
    </ul>
  </div>
);

const QualityAssurance = () => (
  <div>
    <h4 className="font-medium text-black mb-4">Quality Assurance</h4>
    <ul className="space-y-3 text-gray-600">
      {[
        'All products are quality checked before dispatch',
        'Authentic traditional Indian wear guaranteed',
        'Premium fabric and craftsmanship assured',
        'Defective items will be replaced (contact us immediately)'
      ].map((assurance, index) => (
        <li key={index} className="flex items-start">
          <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
          {assurance}
        </li>
      ))}
    </ul>
  </div>
);

const CustomerSupport = () => (
  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
    <h4 className="font-medium text-blue-800 mb-2">Need Help?</h4>
    <p className="text-blue-700 text-sm mb-3">
      Our customer service team is here to help with your orders and any questions you may have.
    </p>
    <div className="flex flex-col sm:flex-row gap-2 text-sm">
      <span className="text-blue-600">📧 support@onsfashion.com</span>
      <span className="text-blue-600">📞 +91 9876543210</span>
      <span className="text-blue-600">💬 Live Chat Available</span>
    </div>
    
    {/* Order Tracking Info */}
    <div className="mt-4 p-3 bg-white rounded border border-blue-100">
      <h5 className="font-medium text-gray-800 text-sm mb-2">Track Your Order</h5>
      <p className="text-gray-600 text-xs">
        Once your order is dispatched, you will receive a tracking link via email/SMS to monitor your delivery status.
      </p>
    </div>
  </div>
);

// Icon Components
const ShippingIcon = () => (
  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

export default ShippingReturnsTab;