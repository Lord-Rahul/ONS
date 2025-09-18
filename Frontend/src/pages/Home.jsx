import React from "react";
import { Hero, CategoryGrid, FeaturedProducts } from "../components/index.js";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      <CategoryGrid />
      <FeaturedProducts />
    </div>
  );
};

export default Home;
