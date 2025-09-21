import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import productService from "../services/productService.js";
import useCart from "../hooks/useCart.js";
import useToast from "../hooks/useToast.js";
import ProductsLoadingSkeleton from "../components/ProductsLoadingSkeleton.jsx";
import ProductsHeader from "../components/ProductsHeader.jsx";
import ProductCard from "../components/ProductCard.jsx";
import ProductsFilters from "../components/ProductsFilters.jsx";
import ProductsGrid from "../components/ProductsGrid.jsx";



const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasMore: false,
  });

  const [filters, setFilters] = useState({
    category: "",
    sortBy: "newest",
    priceRange: "",
    search: "",
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { addToast } = useToast(); // 🔥 Move this to top level

  // Update filters from URL params
  useEffect(() => {
    const newFilters = {
      category: searchParams.get("category") || "",
      search: searchParams.get("search") || "",
      sortBy: searchParams.get("sortBy") || "newest",
      priceRange: searchParams.get("priceRange") || "",
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
        ...(filters.priceRange && { priceRange: filters.priceRange }),
      };

      // Remove empty parameters
      Object.keys(params).forEach((key) => {
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
          hasMore: response.data?.pagination?.hasMore || false,
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

  // 🔥 FIXED: Remove useToast from inside function
  const handleAddToCart = async (product, e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setAddingToCart(product._id);

      await addToCart({
        productId: product._id,
        quantity: 1,
        size: "M", // Default size
        color: "Default", // Default color
      });

      // 🔥 Use the hook that's already called at component level
      addToast(`✅ ${product.name} added to cart!`, "success", 3000);
    } catch (error) {
      console.error("Error adding to cart:", error);

      // 🔥 Use the hook that's already called at component level
      addToast("❌ Failed to add item to cart", "error", 4000);
    } finally {
      setAddingToCart(null);
    }
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    setSearchParams(newParams);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  if (loading && products.length === 0) {
    return <ProductsLoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductsHeader
          filters={filters}
          categories={categories}
          totalProducts={pagination.totalProducts}
        />

        <ProductsFilters
          filters={filters}
          categories={categories}
          totalProducts={pagination.totalProducts}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
        />

        {error ? (
          <ProductsError error={error} onRetry={fetchProducts} />
        ) : (
          <>
            <ProductsGrid
              products={products}
              onAddToCart={handleAddToCart}
              addingToCart={addingToCart}
            />

            {pagination.totalPages > 1 && (
              <ProductsPagination
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
