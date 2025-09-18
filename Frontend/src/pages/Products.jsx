import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import productService from "../services/productService.js";
import useCart from "../hooks/useCart.js";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasMore: false
  });
  
  const [filters, setFilters] = useState({
    category: "",
    sortBy: "newest",
    priceRange: "",
    search: ""
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();

  // Update filters from URL params
  useEffect(() => {
    const newFilters = {
      category: searchParams.get("category") || "",
      search: searchParams.get("search") || "",
      sortBy: searchParams.get("sortBy") || "newest",
      priceRange: searchParams.get("priceRange") || ""
    };
    setFilters(newFilters);
  }, [searchParams]);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [filters, searchParams]);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: searchParams.get("page") || 1,
        limit: 12,
        category: filters.category,
        search: filters.search,
        sortBy: filters.sortBy,
        ...(filters.priceRange && { priceRange: filters.priceRange })
      };
      
      // Remove empty parameters
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });

      console.log("Fetching products with params:", params);
      const response = await productService.getProducts(params);
      
      if (response.success) {
        setProducts(response.data?.products || []);
        setPagination({
          currentPage: response.data?.pagination?.currentPage || 1,
          totalPages: response.data?.pagination?.totalPages || 1,
          totalProducts: response.data?.pagination?.totalProducts || 0,
          hasMore: response.data?.pagination?.hasMore || false
        });
      } else {
        throw new Error(response.message || "Failed to fetch products");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message || "Failed to load products. Please try again.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters, searchParams]);

  const fetchCategories = async () => {
    try {
      const response = await productService.getCategories();
      if (response.success) {
        setCategories(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleFilterChange = (filterType, value) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (value) {
      newParams.set(filterType, value);
    } else {
      newParams.delete(filterType);
    }
    
    // Reset to page 1 when filters change
    newParams.delete("page");
    
    setSearchParams(newParams);
  };

  const handleAddToCart = async (product, e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await addToCart({
        productId: product._id,
        quantity: 1,
        size: product.sizes?.[0]?.size || "M",
        color: product.colors?.[0] || "Default",
      });
      
      // Show success feedback (you can implement a toast here)
      console.log("Added to cart:", product.name);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      // Show error feedback
    }
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    setSearchParams(newParams);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  if (loading && products.length === 0) {
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
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-light text-black mb-4">
            {filters.search ? `Search Results for "${filters.search}"` : 
             filters.category ? `${categories.find(cat => cat._id === filters.category)?.name || 'Category'}` : 
             'Our Collection'}
          </h1>
          <div className="w-16 h-px bg-black mx-auto mb-6"></div>
          <p className="text-gray-600 font-light max-w-2xl mx-auto">
            {pagination.totalProducts > 0 
              ? `Discover ${pagination.totalProducts} handcrafted pieces`
              : "Discover our complete range of handcrafted Indian wear"
            }
          </p>
        </div>

        {/* Filters Bar */}
        <div className="bg-white border border-gray-200 p-4 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Category Filter */}
              <select 
                className="px-4 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-light rounded-none min-w-0 flex-1 sm:flex-none sm:w-48"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>

              {/* Sort Filter */}
              <select 
                className="px-4 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-light rounded-none min-w-0 flex-1 sm:flex-none sm:w-48"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
                <option value="name">Name A-Z</option>
              </select>

              {/* Price Range Filter */}
              <select 
                className="px-4 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-light rounded-none min-w-0 flex-1 sm:flex-none sm:w-48"
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
              >
                <option value="">All Prices</option>
                <option value="0-1000">Under ₹1,000</option>
                <option value="1000-2500">₹1,000 - ₹2,500</option>
                <option value="2500-5000">₹2,500 - ₹5,000</option>
                <option value="5000-10000">₹5,000 - ₹10,000</option>
                <option value="10000+">Above ₹10,000</option>
              </select>
            </div>

            {/* Clear Filters & Results Count */}
            <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
              <span className="text-sm text-gray-600 font-light">
                {pagination.totalProducts} {pagination.totalProducts === 1 ? 'product' : 'products'}
              </span>
              
              {(filters.category || filters.search || filters.priceRange || filters.sortBy !== 'newest') && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-black underline font-light"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 inline-block">
              <p className="font-light mb-4">{error}</p>
              <button
                onClick={fetchProducts}
                className="bg-black text-white px-6 py-2 font-light tracking-wide hover:bg-gray-800 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {!error && (
          <>
            {products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-gray-200">
                {products.map((product, index) => (
                  <div
                    key={product._id}
                    className="group relative bg-white hover:bg-gray-50 transition-all duration-500"
                    style={{
                      animationDelay: `${index * 50}ms`
                    }}
                  >
                    <Link to={`/products/${product._id}`} className="block">
                      {/* Product Image */}
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

                      {/* Product Info */}
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
                            <div className="flex items-center">
                              <div className="flex text-gray-400">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-3 h-3 ${
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
                      </div>
                    </Link>

                    {/* Add to Cart Button */}
                    <div className="px-3 sm:px-4 lg:px-6 pb-3 sm:pb-4 lg:pb-6">
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        disabled={product.countInStock === 0}
                        className="w-full bg-black text-white py-2 sm:py-3 px-3 sm:px-6 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 font-light text-xs sm:text-sm tracking-[0.05em] sm:tracking-[0.1em] uppercase transform hover:translate-y-[-1px] disabled:hover:translate-y-0"
                      >
                        {product.countInStock > 0 ? "Add to Cart" : "Out of Stock"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !loading && (
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-light text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-600 font-light mb-6">
                      {filters.search 
                        ? `No products match "${filters.search}". Try adjusting your search or filters.`
                        : "No products match your current filters. Try adjusting your selection."
                      }
                    </p>
                    <button
                      onClick={clearFilters}
                      className="bg-black text-white px-6 py-2 font-light tracking-wide hover:bg-gray-800 transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              )
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center mt-12 gap-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-4 py-2 border border-gray-300 text-gray-600 hover:text-black hover:border-black disabled:opacity-50 disabled:cursor-not-allowed font-light transition-colors"
                >
                  Previous
                </button>
                
                <div className="flex gap-1">
                  {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 border font-light transition-colors ${
                          page === pagination.currentPage
                            ? "bg-black text-white border-black"
                            : "border-gray-300 text-gray-600 hover:text-black hover:border-black"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-4 py-2 border border-gray-300 text-gray-600 hover:text-black hover:border-black disabled:opacity-50 disabled:cursor-not-allowed font-light transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;