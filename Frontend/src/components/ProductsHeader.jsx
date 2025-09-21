import React from 'react';

const ProductsHeader = ({ filters, categories, totalProducts }) => {
  const getHeaderTitle = () => {
    if (filters.search) return `Search Results for "${filters.search}"`;
    if (filters.category) {
      const category = categories.find(cat => cat._id === filters.category);
      return category?.name || 'Category';
    }
    return 'Our Collection';
  };

  const getHeaderSubtitle = () => {
    if (totalProducts > 0) {
      return `Discover ${totalProducts} handcrafted pieces`;
    }
    return "Discover our complete range of handcrafted Indian wear";
  };

  return (
    <div className="text-center mb-12">
      <h1 className="text-3xl md:text-4xl font-light text-black mb-4">
        {getHeaderTitle()}
      </h1>
      <div className="w-16 h-px bg-black mx-auto mb-6"></div>
      <p className="text-gray-600 font-light max-w-2xl mx-auto">
        {getHeaderSubtitle()}
      </p>
    </div>
  );
};

export default ProductsHeader;