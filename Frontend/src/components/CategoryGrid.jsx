import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import productService from "../services/productService.js";

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await productService.getCategories();
      if (response.success) {
        setCategories(response.data.slice(0, 6));
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryImage = (category) => {
    const categoryImages = {
      'sarees': 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=1067&fit=crop&crop=face',
      'kurtis': 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=600&h=1067&fit=crop&crop=face',
      'lehengas': 'https://images.unsplash.com/photo-1583391733956-6c78276477e1?w=600&h=1067&fit=crop&crop=face',
      'anarkali': 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=600&h=1067&fit=crop&crop=face',
      'palazzo': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=1067&fit=crop&crop=face',
      'suits': 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=600&h=1067&fit=crop&crop=face'
    };
    
    const categoryName = category.name.toLowerCase();
    return categoryImages[categoryName] || 
           `https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=600&h=1067&fit=crop&crop=face&sig=${category._id}`;
  };

  if (loading) {
    return (
      <div className="py-12 sm:py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="h-8 sm:h-10 bg-gray-200 rounded w-64 sm:w-80 mx-auto animate-pulse mb-4"></div>
            <div className="h-4 sm:h-6 bg-gray-200 rounded w-72 sm:w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-200 aspect-[9/16] animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 sm:py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gray-100 border border-gray-300 p-6 sm:p-8 max-w-md mx-auto">
            <p className="text-gray-800 text-base sm:text-lg font-light mb-4">{error}</p>
            <button
              onClick={fetchCategories}
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
    <section className="py-12 sm:py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Responsive Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="w-16 sm:w-24 h-px bg-black mx-auto mb-6 sm:mb-8"></div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-black mb-4 sm:mb-6 tracking-tight px-4 sm:px-0">
            Shop by <span className="italic font-thin">Collection</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-sm sm:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed font-light px-4 sm:px-0">
            Discover our handcrafted collections, each piece thoughtfully designed 
            to celebrate the timeless elegance of Indian fashion
          </p>
        </div>

        {/* Responsive Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-300">
          {categories.map((category, index) => (
            <Link
              key={category._id}
              to={`/products?category=${category._id}`}
              className="group relative overflow-hidden bg-white hover:bg-gray-50 transition-all duration-700"
              style={{
                animationDelay: `${index * 150}ms`
              }}
            >
              {/* Responsive Image Container */}
              <div className="relative aspect-[9/16] overflow-hidden">
                <img
                  src={getCategoryImage(category)}
                  alt={category.name}
                  className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
                />
                
                {/* Responsive Overlay */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-all duration-700"></div>
              </div>

              {/* Responsive Content Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 lg:p-8">
                <div className="transform translate-y-2 sm:translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  {/* Responsive Category Name */}
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-light text-white mb-2 sm:mb-3 tracking-wide drop-shadow-lg">
                    {category.name}
                  </h3>
                  
                  {/* Responsive Underline */}
                  <div className="w-8 sm:w-12 h-px bg-white mb-3 sm:mb-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  
                  {/* Responsive CTA */}
                  <div className="flex items-center text-white/90 group-hover:text-white transition-colors drop-shadow-lg">
                    <span className="text-xs sm:text-sm font-light tracking-[0.1em] sm:tracking-[0.15em] uppercase">Explore</span>
                    <svg 
                      className="ml-1 sm:ml-2 w-3 sm:w-4 h-3 sm:h-4 transform group-hover:translate-x-1 transition-transform" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Responsive CTA Section */}
        {categories.length > 0 && (
          <div className="text-center mt-12 sm:mt-16 lg:mt-20 px-4 sm:px-0">
            <Link
              to="/products"
              className="group inline-flex items-center w-full sm:w-auto justify-center px-8 sm:px-12 py-3 sm:py-4 border border-black text-black hover:bg-black hover:text-white transition-all duration-500 font-light tracking-[0.1em] text-sm sm:text-base"
            >
              <span>View All Collections</span>
              <svg 
                className="ml-2 sm:ml-3 w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <p className="text-gray-500 text-xs sm:text-sm mt-4 sm:mt-6 font-light tracking-wide">
              {categories.length} Curated Collections
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryGrid;