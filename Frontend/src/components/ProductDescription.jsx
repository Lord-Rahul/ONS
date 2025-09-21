import React, { useState } from 'react';
import DescriptionTab from './product-tabs/DescriptionTab.jsx';
import ProductDetailsTab from './product-tabs/ProductDetailsTab.jsx';
import CareInstructionsTab from './product-tabs/CareInstructionsTab.jsx';
import ShippingReturnsTab from './product-tabs/ShippingReturnsTab.jsx';

const ProductDescription = ({ product }) => {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'details', label: 'Product Details' },
    { id: 'care', label: 'Care Instructions' },
    { id: 'shipping', label: 'Shipping & Policies' } // Updated label
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-16">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'description' && <DescriptionTab product={product} />}
        {activeTab === 'details' && <ProductDetailsTab product={product} />}
        {activeTab === 'care' && <CareInstructionsTab product={product} />}
        {activeTab === 'shipping' && <ShippingReturnsTab />}
      </div>
    </div>
  );
};

export default ProductDescription;