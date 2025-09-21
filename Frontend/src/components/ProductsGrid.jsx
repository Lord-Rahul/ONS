import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard.jsx';

const ProductsGrid = ({ products, onAddToCart, addingToCart }) => {
  if (!products || products.length === 0) {
    return <EmptyProductsState />;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-gray-200">
      {products.map((product, index) => (
        <ProductCard
          key={product._id}
          product={product}
          index={index}
          onAddToCart={onAddToCart}
          isAdding={addingToCart === product._id}
        />
      ))}
    </div>
  );
};

const EmptyProductsState = () => (
  <div className="text-center py-16">
    <div className="max-w-md mx-auto">
      <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h3 className="text-xl font-light text-gray-900 mb-2">No products found</h3>
      <p className="text-gray-600 font-light mb-6">
        No products match your current filters. Try adjusting your selection.
      </p>
    </div>
  </div>
);

export default ProductsGrid;