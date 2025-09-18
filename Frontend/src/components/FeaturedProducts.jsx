import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import productService from "../services/productService.js";
import useCart from "../hooks/useCart.js";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getFeaturedProducts(8);
      if (response.success) {
        setProducts(response.data.products || []);
      }
    } catch (err) {
      console.error("Error fetching featured products:", err);
      setError("Failed to load featured products");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAddToCart = async (product, e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await addToCart({
        productId: product._id,
        quantity: 1,
        size: product.sizes?.[0]?.size || "M",
        color: product.colors?.[0] || "Default",
      });

      console.log("Added to cart:", product.name);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  if (loading) {
    return (
      <div className="py-12 sm:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="h-8 sm:h-12 bg-gray-200 rounded w-64 sm:w-80 mx-auto animate-pulse mb-4"></div>
            <div className="h-4 sm:h-6 bg-gray-200 rounded w-72 sm:w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-gray-200 aspect-[9/16] animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 sm:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gray-100 border border-gray-300 p-6 sm:p-8 max-w-md mx-auto">
            <p className="text-gray-800 text-base sm:text-lg font-light mb-4">{error}</p>
            <button
              onClick={fetchFeaturedProducts}
              className="bg-black text-white px-6 sm:px-8 py-2 sm:py-3 font-light tracking-wide hover:bg-gray-800 transition-colors text-sm sm:text-base"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Responsive Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="w-16 sm:w-24 h-px bg-black mx-auto mb-6 sm:mb-8"></div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-black mb-4 sm:mb-6 tracking-tight px-4 sm:px-0">
            Featured <span className="italic font-thin">Pieces</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-sm sm:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed font-light px-4 sm:px-0">
            Handpicked favorites from our artisan collections, each piece embodying
            the perfect harmony of tradition and contemporary style
          </p>
        </div>

        {/* Responsive Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200">
          {products.map((product, index) => (
            <div
              key={product._id}
              className="group relative bg-white hover:bg-gray-50 transition-all duration-500"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <Link to={`/products/${product._id}`} className="block">
                {/* Responsive Product Image */}
                <div className="relative aspect-[9/16] overflow-hidden bg-gray-100">
                  <img
                    src={
                      product.mainImage?.url ||
                      "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=711&fit=crop&crop=face"
                    }
                    alt={product.name}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                  />

                  {/* Responsive Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500"></div>

                  {/* Responsive Quick Actions */}
                  <div className="absolute top-2 sm:top-4 right-2 sm:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="p-2 sm:p-3 bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-colors">
                      <svg
                        className="w-3 sm:w-4 h-3 sm:h-4 text-gray-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Responsive Stock Badge */}
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

                {/* Responsive Product Info */}
                <div className="p-3 sm:p-4 lg:p-6">
                  {/* Responsive Category */}
                  <p className="text-xs text-gray-500 font-light tracking-[0.15em] sm:tracking-[0.2em] uppercase mb-2 sm:mb-3">
                    {product.category?.name || "Fashion"}
                  </p>

                  {/* Responsive Product Name */}
                  <h3 className="text-sm sm:text-base lg:text-lg font-light text-black mb-3 sm:mb-4 line-clamp-2 leading-tight">
                    {product.name}
                  </h3>

                  {/* Responsive Price & Rating */}
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="flex items-center">
                      <span className="text-base sm:text-lg lg:text-xl font-light text-black">
                        ₹{product.price?.toLocaleString()}
                      </span>
                    </div>

                    {product.rating > 0 && (
                      <div className="flex items-center">
                        <div className="flex text-gray-400">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-2 sm:w-3 h-2 sm:h-3 ${
                                i < Math.floor(product.rating)
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
                    )}
                  </div>

                  {/* Responsive Fabric & Occasion - Hidden on mobile */}
                  <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500 mb-4">
                    {product.fabric && (
                      <span className="border border-gray-300 px-2 py-1 font-light">
                        {product.fabric}
                      </span>
                    )}
                    {product.occasion && (
                      <span className="border border-gray-300 px-2 py-1 font-light">
                        {product.occasion}
                      </span>
                    )}
                  </div>
                </div>
              </Link>

              {/* Responsive Add to Cart Button */}
              <div className="px-3 sm:px-4 lg:px-6 pb-3 sm:pb-4 lg:pb-6">
                <button
                  onClick={(e) => handleQuickAddToCart(product, e)}
                  disabled={product.countInStock === 0}
                  className="w-full bg-black text-white py-2 sm:py-3 px-3 sm:px-6 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 font-light text-xs sm:text-sm tracking-[0.05em] sm:tracking-[0.1em] uppercase transform hover:translate-y-[-1px] disabled:hover:translate-y-0"
                >
                  {product.countInStock > 0 ? "Add to Cart" : "Out of Stock"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Responsive CTA */}
        {products.length > 0 && (
          <div className="text-center mt-12 sm:mt-16 lg:mt-20 px-4 sm:px-0">
            <Link
              to="/products"
              className="group inline-flex items-center w-full sm:w-auto justify-center px-8 sm:px-12 py-3 sm:py-4 border border-black text-black hover:bg-black hover:text-white transition-all duration-500 font-light tracking-[0.1em] text-sm sm:text-base"
            >
              <span>View All Products</span>
              <svg
                className="ml-2 sm:ml-3 w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
            <p className="text-gray-500 text-xs sm:text-sm mt-4 sm:mt-6 font-light tracking-wide">
              {products.length}+ Curated Pieces
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
