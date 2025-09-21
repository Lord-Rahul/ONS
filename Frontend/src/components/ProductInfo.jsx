import React from 'react';

const ProductInfo = ({ 
  product, 
  selectedSize, 
  selectedColor, 
  quantity,
  onSizeSelect,
  onColorSelect,
  onQuantityChange,
  onAddToCart,
  onBuyNow,
  addingToCart
}) => {
  return (
    <div className="space-y-8">
      {/* Product Title and Price */}
      <div>
        <div className="text-sm text-gray-500 font-light tracking-widest uppercase mb-2">
          {product.category?.name}
        </div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-light text-black mb-4 leading-tight">
          {product.name}
        </h1>
        <div className="flex items-center space-x-4 mb-4">
          <span className="text-2xl lg:text-3xl font-light text-black">
            ₹{product.price?.toLocaleString()}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <>
              <span className="text-lg text-gray-500 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
              <span className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </span>
            </>
          )}
        </div>

        {/* Stock Status */}
        <ProductStockStatus stock={product.countInStock} />
      </div>

      {/* Product Description */}
      {product.description && (
        <div>
          <h3 className="text-lg font-light text-black mb-3">Description</h3>
          <p className="text-gray-600 font-light leading-relaxed">
            {product.description}
          </p>
        </div>
      )}

      {/* Size Selection */}
      {product.sizes && product.sizes.length > 0 && (
        <ProductSizeSelector 
          sizes={product.sizes}
          selectedSize={selectedSize}
          onSizeSelect={onSizeSelect}
        />
      )}

      {/* Color Selection */}
      {product.colors && product.colors.length > 0 && (
        <ProductColorSelector 
          colors={product.colors}
          selectedColor={selectedColor}
          onColorSelect={onColorSelect}
        />
      )}

      {/* Quantity Selector */}
      <ProductQuantitySelector 
        quantity={quantity}
        maxQuantity={product.countInStock}
        onQuantityChange={onQuantityChange}
      />

      {/* Action Buttons */}
      <ProductActions 
        product={product}
        onAddToCart={onAddToCart}
        onBuyNow={onBuyNow}
        addingToCart={addingToCart}
      />

      {/* Product Features */}
      <ProductFeatures product={product} />
    </div>
  );
};

const ProductStockStatus = ({ stock }) => {
  if (stock === 0) {
    return (
      <div className="bg-red-50 border border-red-200 rounded px-4 py-2 inline-block">
        <span className="text-red-800 text-sm font-medium">Out of Stock</span>
      </div>
    );
  }
  
  if (stock <= 5) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded px-4 py-2 inline-block">
        <span className="text-yellow-800 text-sm font-medium">
          Only {stock} left in stock
        </span>
      </div>
    );
  }
  
  return (
    <div className="bg-green-50 border border-green-200 rounded px-4 py-2 inline-block">
      <span className="text-green-800 text-sm font-medium">In Stock</span>
    </div>
  );
};

const ProductSizeSelector = ({ sizes, selectedSize, onSizeSelect }) => (
  <div>
    <h3 className="text-lg font-light text-black mb-3">Size</h3>
    <div className="flex flex-wrap gap-2">
      {sizes.map((size) => (
        <button
          key={size}
          onClick={() => onSizeSelect(size)}
          className={`px-4 py-2 border transition-all duration-200 ${
            selectedSize === size
              ? 'border-black bg-black text-white'
              : 'border-gray-300 hover:border-black'
          }`}
        >
          {size}
        </button>
      ))}
    </div>
  </div>
);

const ProductColorSelector = ({ colors, selectedColor, onColorSelect }) => (
  <div>
    <h3 className="text-lg font-light text-black mb-3">Color</h3>
    <div className="flex flex-wrap gap-2">
      {colors.map((color) => (
        <button
          key={color}
          onClick={() => onColorSelect(color)}
          className={`px-4 py-2 border transition-all duration-200 ${
            selectedColor === color
              ? 'border-black bg-black text-white'
              : 'border-gray-300 hover:border-black'
          }`}
        >
          {color}
        </button>
      ))}
    </div>
  </div>
);

const ProductQuantitySelector = ({ quantity, maxQuantity, onQuantityChange }) => (
  <div>
    <h3 className="text-lg font-light text-black mb-3">Quantity</h3>
    <div className="flex items-center space-x-3">
      <button
        onClick={() => onQuantityChange(quantity - 1)}
        disabled={quantity <= 1}
        className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        -
      </button>
      <span className="w-16 text-center font-medium">{quantity}</span>
      <button
        onClick={() => onQuantityChange(quantity + 1)}
        disabled={quantity >= maxQuantity}
        className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        +
      </button>
    </div>
  </div>
);

const ProductActions = ({ product, onAddToCart, onBuyNow, addingToCart }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <button
        onClick={onAddToCart}
        disabled={product.countInStock === 0 || addingToCart}
        className="bg-black text-white py-4 px-8 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 font-light tracking-wide uppercase flex items-center justify-center"
      >
        {addingToCart ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
            Adding...
          </>
        ) : (
          'Add to Cart'
        )}
      </button>
      
      <button
        onClick={onBuyNow}
        disabled={product.countInStock === 0 || addingToCart}
        className="bg-white text-black border-2 border-black py-4 px-8 hover:bg-black hover:text-white disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed transition-all duration-300 font-light tracking-wide uppercase"
      >
        Buy Now
      </button>
    </div>
  </div>
);

const ProductFeatures = ({ product }) => (
  <div className="border-t border-gray-200 pt-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
      <div className="flex items-center">
        <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <span className="text-gray-600">Free Shipping Above ₹999</span>
      </div>
      
      <div className="flex items-center">
        <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span className="text-gray-600">30 Day Return Policy</span>
      </div>
      
      <div className="flex items-center">
        <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span className="text-gray-600">Secure Payment</span>
      </div>
      
      <div className="flex items-center">
        <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <span className="text-gray-600">24/7 Customer Support</span>
      </div>
    </div>
  </div>
);

export default ProductInfo;