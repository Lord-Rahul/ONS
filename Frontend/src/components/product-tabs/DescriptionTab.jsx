import React from 'react';

const DescriptionTab = ({ product }) => {
  return (
    <div className="prose prose-gray max-w-none">
      <div className="text-lg font-light text-black mb-6">About This Product</div>
      
      {product?.description ? (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed font-light text-base">
            {product.description}
          </p>
        </div>
      ) : (
        <p className="text-gray-500 italic">No description available for this product.</p>
      )}
    </div>
  );
};

export default DescriptionTab;