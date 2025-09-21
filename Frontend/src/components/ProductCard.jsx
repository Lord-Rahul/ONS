import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, index, onAddToCart, isAdding }) => {
  return (
    <div
      className="group relative bg-white hover:bg-gray-50 transition-all duration-500"
      style={{
        animationDelay: `${index * 50}ms`
      }}
    >
      <Link to={`/products/${product._id}`} className="block">
        <ProductImage product={product} />
        <ProductInfo product={product} />
      </Link>
      
      <ProductActions 
        product={product} 
        onAddToCart={onAddToCart}
        isAdding={isAdding}
      />
    </div>
  );
};

const ProductImage = ({ product }) => (
  <div className="relative aspect-[9/16] overflow-hidden bg-gray-100">
    <img
      src={product.mainImage?.url || "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=711&fit=crop&crop=face"}
      alt={product.name}
      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
      loading="lazy"
    />

    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500"></div>

    {/* Stock Badges */}
    {product.countInStock <= 5 && product.countInStock > 0 && (
      <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
        <span className="px-2 sm:px-3 py-1 bg-gray-800 text-white text-xs font-light tracking-wide">
          Only {product.countInStock} left
        </span>
      </div>
    )}

    {product.countInStock === 0 && (
      <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
        <span className="px-2 sm:px-3 py-1 bg-black text-white text-xs font-light tracking-wide">
          Out of Stock
        </span>
      </div>
    )}
  </div>
);

const ProductInfo = ({ product }) => (
  <div className="p-3 sm:p-4 lg:p-6">
    <p className="text-xs text-gray-500 font-light tracking-[0.15em] uppercase mb-2 sm:mb-3">
      {product.category?.name || "Fashion"}
    </p>

    <h3 className="text-sm sm:text-base lg:text-lg font-light text-black mb-3 sm:mb-4 line-clamp-2 leading-tight">
      {product.name}
    </h3>

    <div className="flex items-center justify-between mb-3 sm:mb-4">
      <span className="text-base sm:text-lg lg:text-xl font-light text-black">
        ₹{product.price?.toLocaleString()}
      </span>
      
      {product.rating > 0 && (
        <ProductRating rating={product.rating} />
      )}
    </div>
  </div>
);

const ProductRating = ({ rating }) => (
  <div className="flex items-center">
    <div className="flex text-gray-400">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-3 h-3 ${
            i < Math.floor(rating)
              ? "fill-current text-black"
              : "text-gray-300"
          }`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  </div>
);

const ProductActions = ({ product, onAddToCart, isAdding }) => (
  <div className="px-3 sm:px-4 lg:px-6 pb-3 sm:pb-4 lg:pb-6">
    <button
      onClick={(e) => onAddToCart(product, e)}
      disabled={product.countInStock === 0 || isAdding}
      className="w-full bg-black text-white py-2 sm:py-3 px-3 sm:px-6 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 font-light text-xs sm:text-sm tracking-[0.05em] sm:tracking-[0.1em] uppercase transform hover:translate-y-[-1px] disabled:hover:translate-y-0 flex items-center justify-center"
    >
      {isAdding ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
          Adding...
        </>
      ) : (
        product.countInStock > 0 ? "Add to Cart" : "Out of Stock"
      )}
    </button>
  </div>
);

export default ProductCard;