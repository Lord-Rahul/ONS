import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-3">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Cpath d='M20 20c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8zm0-20c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      {/* Responsive Floating Elements */}
      <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-gray-100 rounded-full opacity-20 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-gray-200 rounded-full opacity-15 blur-3xl animate-pulse delay-1000"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 text-center">
        {/* Elegant Line */}
        <div className="mb-6 sm:mb-8">
          <div className="w-16 sm:w-24 h-px bg-black mx-auto mb-4 sm:mb-6"></div>
          <span className="inline-block px-4 sm:px-6 py-2 border border-gray-300 text-gray-800 rounded-full text-xs sm:text-sm font-light tracking-[0.15em] sm:tracking-[0.2em] uppercase">
            Timeless Elegance
          </span>
        </div>

        {/* Responsive Main Heading */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-black mb-6 sm:mb-8 leading-[0.9] tracking-tight">
          Discover Your
          <span className="block font-thin italic text-gray-700 mt-1 sm:mt-2">
            Perfect Style
          </span>
        </h1>

        {/* Responsive Description */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-12 max-w-sm sm:max-w-2xl lg:max-w-4xl mx-auto leading-relaxed font-light px-4 sm:px-0">
          Curated collections of exquisite Indian wear, where traditional
          craftsmanship meets contemporary elegance. Each piece tells a story of
          heritage and grace.
        </p>

        {/* Responsive CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16 px-4 sm:px-0">
          <Link
            to="/products"
            className="group relative w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-4 bg-black text-white text-base sm:text-lg font-light tracking-wide overflow-hidden transition-all duration-500 hover:bg-gray-900"
          >
            <span className="relative z-10 flex items-center justify-center">
              Explore Collection
              <svg
                className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform"
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
            </span>
          </Link>

          <Link
            to="/products?featured=true"
            className="group w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-4 border border-black text-black text-base sm:text-lg font-light tracking-wide hover:bg-black hover:text-white transition-all duration-500"
          >
            <span className="flex items-center justify-center">
              Featured Pieces
              <svg
                className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform"
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
            </span>
          </Link>
        </div>

        {/* Responsive Trust Indicators */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-12 text-gray-500 text-xs sm:text-sm font-light px-4 sm:px-0">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-black rounded-full mr-2 sm:mr-3"></div>
            <span className="whitespace-nowrap">Free Shipping Above ₹999</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-black rounded-full mr-2 sm:mr-3"></div>
            <span className="whitespace-nowrap">Easy 15-Day Returns</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-black rounded-full mr-2 sm:mr-3"></div>
            <span className="whitespace-nowrap">Authentic Handcrafted</span>
          </div>
        </div>
      </div>

      {/* Responsive Scroll Indicator */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:block">
        <div className="w-px h-12 sm:h-16 bg-gray-300 relative">
          <div className="w-px h-3 sm:h-4 bg-black absolute top-0 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
