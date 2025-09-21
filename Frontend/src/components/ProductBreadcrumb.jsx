// ProductBreadcrumb.jsx
import React from 'react';
import { Link } from 'react-router-dom';

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

export default ProductBreadcrumb;