import React from 'react';

const ProductDetailsTab = ({ product }) => {
  return (
    <div>
      <div className="text-lg font-light text-black mb-6">Product Specifications</div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {/* Only show data that exists in backend */}
          <ProductDetailRow label="Product ID" value={product?._id?.slice(-8).toUpperCase()} />
          
          {product?.category && (
            <ProductDetailRow label="Category" value={product.category.name} />
          )}
          
          {product?.brand && (
            <ProductDetailRow label="Brand" value={product.brand} />
          )}
          
          {product?.material && (
            <ProductDetailRow label="Material" value={product.material} />
          )}
          
          {product?.sizes && product.sizes.length > 0 && (
            <ProductDetailRow 
              label="Available Sizes" 
              value={product.sizes.map(size => 
                typeof size === 'object' ? size.size : size
              ).join(', ')} 
            />
          )}
          
          {product?.colors && product.colors.length > 0 && (
            <ProductDetailRow 
              label="Available Colors" 
              value={product.colors.map(color => 
                typeof color === 'object' ? color.color : color
              ).join(', ')} 
            />
          )}
        </div>
        
        <div className="space-y-4">
          <ProductDetailRow 
            label="Stock Status" 
            value={getStockStatus(product?.countInStock)} 
          />
          
          {product?.weight && (
            <ProductDetailRow label="Weight" value={product.weight} />
          )}
          
          {product?.dimensions && (
            <ProductDetailRow label="Dimensions" value={product.dimensions} />
          )}
          
          {product?.sku && (
            <ProductDetailRow label="SKU" value={product.sku} />
          )}
          
          {product?.price && (
            <ProductDetailRow 
              label="Price" 
              value={`₹${product.price.toLocaleString()}`} 
            />
          )}
          
          {product?.createdAt && (
            <ProductDetailRow 
              label="Added Date" 
              value={new Date(product.createdAt).toLocaleDateString('en-IN')} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

const ProductDetailRow = ({ label, value }) => {
  // Only render if value exists
  if (!value || value === 'N/A') return null;
  
  return (
    <div className="flex justify-between py-2 border-b border-gray-100">
      <span className="text-gray-600 font-light">{label}:</span>
      <span className="text-black font-medium text-right">{value}</span>
    </div>
  );
};

const getStockStatus = (stock) => {
  if (!stock || stock === 0) return "Out of Stock";
  if (stock <= 5) return `Low Stock (${stock} left)`;
  return "In Stock";
};

export default ProductDetailsTab;