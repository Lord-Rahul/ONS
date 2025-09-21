import React from "react";

const ProductsFilters = ({
  filters,
  categories,
  totalProducts,
  onFilterChange,
  onClearFilters,
}) => {
  const hasActiveFilters =
    filters.category ||
    filters.search ||
    filters.priceRange ||
    filters.sortBy !== "newest";

  return (
    <div className="bg-white border border-gray-200 p-4 mb-8 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Category Filter */}
          <select
            className="px-4 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-light rounded-none min-w-0 flex-1 sm:flex-none sm:w-48"
            value={filters.category}
            onChange={(e) => onFilterChange("category", e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Sort Filter */}
          <select
            className="px-4 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-light rounded-none min-w-0 flex-1 sm:flex-none sm:w-48"
            value={filters.sortBy}
            onChange={(e) => onFilterChange("sortBy", e.target.value)}
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
            onChange={(e) => onFilterChange("priceRange", e.target.value)}
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
            {totalProducts} {totalProducts === 1 ? "product" : "products"}
          </span>

          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-sm text-gray-600 hover:text-black underline font-light"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsFilters;
