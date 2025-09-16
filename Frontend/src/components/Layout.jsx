import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar, Footer } from "./index.js";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
