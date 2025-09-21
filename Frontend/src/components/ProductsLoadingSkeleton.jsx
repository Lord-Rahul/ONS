import React from 'react';

const ProductsLoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading Header */}
        <div className="text-center mb-12">
          <div className="h-10 bg-gray-200 rounded w-64 mx-auto animate-pulse mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
        </div>
        
        {/* Loading Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-gray-200 aspect-[9/16] animate-pulse rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsLoadingSkeleton;