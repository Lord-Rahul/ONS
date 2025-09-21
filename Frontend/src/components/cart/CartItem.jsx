import React from 'react';

const CartItem = ({ 
  item, 
  isUpdating, 
  isRemoving, 
  onUpdateQuantity, 
  onRemove 
}) => {
  // 🔥 Use actual item quantity directly from the cart item
  const currentQuantity = item.quantity;

  // 🔥 Add validation for item structure
  if (!item || !item.product) {
    console.warn('Invalid cart item:', item);
    return (
      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
        <p className="text-red-700">Invalid item data</p>
        <button 
          onClick={() => onRemove(item._id)}
          className="text-red-600 underline mt-2"
        >
          Remove from cart
        </button>
      </div>
    );
  }

  return (
    <div
      className={`bg-white p-6 shadow-sm border border-gray-200 rounded-lg transition-all duration-300 ${
        isRemoving ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
      } ${isUpdating ? 'bg-gray-50' : ''}`}
    >
      <div className="flex items-center space-x-4">
        {/* Product Image with loading overlay */}
        <div className="relative">
          <img
            src={
              item.product?.mainImage?.url ||
              item.product?.images?.[0]?.url ||
              item.product?.image ||
              '/api/placeholder/80/80'
            }
            alt={item.product?.name || 'Product'}
            className={`w-20 h-20 object-cover rounded-md transition-opacity ${
              isUpdating ? 'opacity-50' : 'opacity-100'
            }`}
            onError={(e) => {
              e.target.src = '/api/placeholder/80/80';
            }}
          />
          {/* 🔥 Loading overlay for the entire image */}
          {isUpdating && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-md">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-black border-t-transparent"></div>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <h3 className={`text-lg font-light text-black mb-1 transition-opacity ${
            isUpdating ? 'opacity-50' : 'opacity-100'
          }`}>
            {item.product?.name || 'Unknown Product'}
          </h3>
          <p className={`text-gray-600 mb-2 transition-opacity ${
            isUpdating ? 'opacity-50' : 'opacity-100'
          }`}>
            ₹{item.product?.price?.toLocaleString() || '0'}
          </p>
          <div className={`flex space-x-4 text-sm text-gray-500 transition-opacity ${
            isUpdating ? 'opacity-50' : 'opacity-100'
          }`}>
            {item.size && <span>Size: {item.size}</span>}
            {item.color && <span>Color: {item.color}</span>}
          </div>
          <p className={`text-sm font-medium text-gray-900 mt-2 transition-opacity ${
            isUpdating ? 'opacity-50' : 'opacity-100'
          }`}>
            {/* v Show current quantity during update, not the changing one */}
            Subtotal: ₹{((item.product?.price || 0) * currentQuantity).toLocaleString()}
          </p>
          
          {/*  Show updating message */}
          {isUpdating && (
            <p className="text-xs text-blue-600 mt-1 animate-pulse">
              Updating quantity...
            </p>
          )}
          {isRemoving && (
            <p className="text-xs text-red-600 mt-1 animate-pulse">
              Removing item...
            </p>
          )}
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onUpdateQuantity(item._id, currentQuantity - 1, currentQuantity)}
            disabled={isUpdating || isRemoving || currentQuantity <= 1}
            className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isUpdating ? (
              <div className="animate-spin rounded-full h-3 w-3 border border-gray-400 border-t-transparent"></div>
            ) : (
              '-'
            )}
          </button>
          
          <div className="relative w-12 text-center">
            <span className={`block transition-opacity ${
              isUpdating ? 'opacity-50' : 'opacity-100'
            }`}>
              {currentQuantity}
            </span>
            {/* 🔥 Loading spinner overlay on quantity */}
            {isUpdating && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border border-blue-500 border-t-transparent"></div>
              </div>
            )}
          </div>
          
          <button
            onClick={() => onUpdateQuantity(item._id, currentQuantity + 1, currentQuantity)}
            disabled={isUpdating || isRemoving}
            className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isUpdating ? (
              <div className="animate-spin rounded-full h-3 w-3 border border-gray-400 border-t-transparent"></div>
            ) : (
              '+'
            )}
          </button>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => onRemove(item._id)}
          disabled={isRemoving || isUpdating}
          className="text-red-600 hover:text-red-800 ml-4 p-2 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isRemoving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"></div>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default CartItem;