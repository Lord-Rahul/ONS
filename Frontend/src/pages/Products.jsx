import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import productService from "../services/productService.js";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = {
          category: searchParams.get("category"),
          search: searchParams.get("search"),
          page: searchParams.get("page") || 1,
        };
        const response = await productService.getProducts(params);
        setProducts(response.data?.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  // Add your products grid UI here
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Products listing implementation */}
    </div>
  );
};

export default Products;