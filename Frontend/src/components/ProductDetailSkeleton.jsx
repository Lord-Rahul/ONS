// ProductDetailSkeleton.jsx
import React from 'react';

const ProductDetailSkeleton = () => (
  <div className="min-h-screen bg-gray-50 pt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Skeleton */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-200 animate-pulse rounded-lg"></div>
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded"></div>
            ))}
          </div>
        </div>
        
        {/* Info Skeleton */}
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 animate-pulse rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 animate-pulse rounded w-1/2"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-5/6"></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-12 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-12 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ProductDetailSkeleton;