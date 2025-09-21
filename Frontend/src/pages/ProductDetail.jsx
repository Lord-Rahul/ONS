import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import productService from '../services/productService.js';
import useCart from '../hooks/useCart.js';
import useToast from '../hooks/useToast.js';
import { useAuth } from '../context/AuthContext.jsx';
import ProductDescription from '../components/ProductDescription.jsx';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const { isAuthenticated } = useAuth();

  // State management
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Product selection state
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Fetch product details
  useEffect(() => {
    if (id) {
      fetchProductDetail();
    }
  }, [id]);

  // Fetch related products when main product loads
  useEffect(() => {
    if (product?.category?._id) {
      fetchRelatedProducts();
    }
  }, [product]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productService.getProductById(id);
      
      if (response.success) {
        const productData = response.data;
        setProduct(productData);
        
        // Set default selections - handle sizes properly
        if (productData.sizes && Array.isArray(productData.sizes) && productData.sizes.length > 0) {
          // Extract size values from size objects or use as strings
          const sizeValue = typeof productData.sizes[0] === 'object' 
            ? productData.sizes[0].size 
            : productData.sizes[0];
          setSelectedSize(sizeValue);
        }
        
        // Set default color
        if (productData.colors && Array.isArray(productData.colors) && productData.colors.length > 0) {
          const colorValue = typeof productData.colors[0] === 'object'
            ? productData.colors[0].color
            : productData.colors[0];
          setSelectedColor(colorValue);
        }
      } else {
        throw new Error(response.message || 'Product not found');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err.message || 'Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await productService.getProducts({
        category: product.category._id,
        limit: 4,
        exclude: product._id
      });
      
      if (response.success) {
        setRelatedProducts(response.data?.products || []);
      }
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      addToast('Please login to add items to cart', 'warning');
      navigate('/login', { state: { from: `/products/${id}` } });
      return;
    }

    // Get available sizes and colors
    const availableSizes = getAvailableSizes(product);
    const availableColors = getAvailableColors(product);

    if (!selectedSize && availableSizes.length > 0) {
      addToast('Please select a size', 'warning');
      return;
    }

    if (!selectedColor && availableColors.length > 0) {
      addToast('Please select a color', 'warning');
      return;
    }

    try {
      setAddingToCart(true);
      
      await addToCart({
        productId: product._id,
        quantity,
        size: selectedSize || null,
        color: selectedColor || null
      });
      
      addToast(`✅ ${product.name} added to cart!`, 'success', 3000);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      addToast('❌ Failed to add item to cart', 'error');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    if (!error) {
      navigate('/cart');
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (product.countInStock || 99)) {
      setQuantity(newQuantity);
    }
  };

  // Helper functions to extract sizes and colors properly
  const getAvailableSizes = (product) => {
    if (!product?.sizes) return [];
    if (Array.isArray(product.sizes)) {
      return product.sizes.map(size => 
        typeof size === 'object' ? size.size : size
      ).filter(Boolean);
    }
    return [];
  };

  const getAvailableColors = (product) => {
    if (!product?.colors) return [];
    if (Array.isArray(product.colors)) {
      return product.colors.map(color => 
        typeof color === 'object' ? color.color : color
      ).filter(Boolean);
    }
    return [];
  };

  // Loading skeleton
  if (loading) {
    return <ProductDetailSkeleton />;
  }

  // Error state
  if (error || !product) {
    return <ProductDetailError error={error} onRetry={fetchProductDetail} />;
  }

  // Get all product images
  const productImages = [
    product.mainImage?.url,
    ...(product.images?.map(img => img.url) || [])
  ].filter(Boolean);

  // Get processed sizes and colors
  const availableSizes = getAvailableSizes(product);
  const availableColors = getAvailableColors(product);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb */}
        <ProductBreadcrumb product={product} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          
          {/* Product Images */}
          <ProductImageGallery 
            images={productImages}
            productName={product.name}
            selectedImage={selectedImage}
            onImageSelect={setSelectedImage}
          />

          {/* Product Info */}
          <ProductInfo 
            product={product}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
            quantity={quantity}
            availableSizes={availableSizes}
            availableColors={availableColors}
            onSizeSelect={setSelectedSize}
            onColorSelect={setSelectedColor}
            onQuantityChange={handleQuantityChange}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            addingToCart={addingToCart}
          />
        </div>

        {/* Product Description */}
        <ProductDescription product={product} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <RelatedProducts products={relatedProducts} />
        )}
      </div>
    </div>
  );
};

// Supporting Components
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

const ProductDetailError = ({ error, onRetry }) => (
  <div className="min-h-screen bg-gray-50 pt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-light text-gray-900 mb-2">Product not found</h3>
          <p className="text-gray-600 font-light mb-6">
            {error || "The product you're looking for doesn't exist or has been removed."}
          </p>
          <div className="space-y-4">
            <button
              onClick={onRetry}
              className="bg-black text-white px-6 py-2 hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
            <Link
              to="/products"
              className="block text-gray-600 hover:text-black underline"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ProductBreadcrumb = ({ product }) => (
  <nav className="mb-8 text-sm">
    <ol className="flex items-center space-x-2 text-gray-500">
      <li><Link to="/" className="hover:text-black">Home</Link></li>
      <li>/</li>
      <li><Link to="/products" className="hover:text-black">Products</Link></li>
      {product.category && (
        <>
          <li>/</li>
          <li>
            <Link 
              to={`/products?category=${product.category._id}`} 
              className="hover:text-black"
            >
              {product.category.name}
            </Link>
          </li>
        </>
      )}
      <li>/</li>
      <li className="text-black font-medium">{product.name}</li>
    </ol>
  </nav>
);

const ProductImageGallery = ({ images, productName, selectedImage, onImageSelect }) => {
  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gray-200 flex items-center justify-center rounded-lg">
        <span className="text-gray-400">No image available</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square overflow-hidden bg-gray-100 rounded-lg shadow-lg">
        <img
          src={images[selectedImage] || images[0]}
          alt={productName}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onImageSelect(index)}
              className={`aspect-square overflow-hidden bg-gray-100 rounded border-2 transition-all duration-200 ${
                selectedImage === index 
                  ? 'border-black shadow-md' 
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <img
                src={image}
                alt={`${productName} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ProductInfo = ({ 
  product, 
  selectedSize, 
  selectedColor, 
  quantity,
  availableSizes,
  availableColors,
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
      {availableSizes.length > 0 && (
        <div>
          <h3 className="text-lg font-light text-black mb-3">Size</h3>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size, index) => (
              <button
                key={`${size}-${index}`} // Fixed: unique key
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
      )}

      {/* Color Selection */}
      {availableColors.length > 0 && (
        <div>
          <h3 className="text-lg font-light text-black mb-3">Color</h3>
          <div className="flex flex-wrap gap-2">
            {availableColors.map((color, index) => (
              <button
                key={`${color}-${index}`} // Fixed: unique key
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
      )}

      {/* Quantity Selector */}
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
            disabled={quantity >= product.countInStock}
            className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>
      </div>

      {/* Action Buttons */}
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

const RelatedProducts = ({ products }) => (
  <div className="mt-16">
    <h2 className="text-2xl font-light text-black mb-8">You Might Also Like</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link key={product._id} to={`/products/${product._id}`} className="group">
          <div className="aspect-square overflow-hidden bg-gray-100 mb-4">
            <img
              src={product.mainImage?.url || "https://via.placeholder.com/400"}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <h3 className="font-light text-black mb-2 line-clamp-2">{product.name}</h3>
          <p className="text-gray-600">₹{product.price?.toLocaleString()}</p>
        </Link>
      ))}
    </div>
  </div>
);

export default ProductDetail;

