import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Send,
} from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log("Newsletter subscription:", email);
    setIsSubscribed(true);
    setEmail("");
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  const footerLinks = {
    shop: [
      { name: "Sarees", path: "/products?category=sarees" },
      { name: "Suits & Salwar Kameez", path: "/products?category=suits" },
      { name: "Lehengas", path: "/products?category=lehengas" },
      { name: "Dupattas & Scarves", path: "/products?category=dupattas" },
      { name: "Accessories", path: "/products?category=accessories" },
    ],
    company: [
      { name: "About Us", path: "/about" },
      { name: "Our Story", path: "/story" },
      { name: "Careers", path: "/careers" },
      { name: "Press", path: "/press" },
      { name: "Wholesale", path: "/wholesale" },
    ],
    support: [
      { name: "Contact Us", path: "/contact" },
      { name: "Size Guide", path: "/size-guide" },
      { name: "Shipping Info", path: "/shipping" },
      { name: "Returns & Exchange", path: "/returns" },
      { name: "Care Instructions", path: "/care" },
    ],
    legal: [
      { name: "Privacy Policy", path: "/privacy" },
      { name: "Terms of Service", path: "/terms" },
      { name: "Refund Policy", path: "/refund" },
      { name: "Cookie Policy", path: "/cookies" },
    ],
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">
              Stay Updated with Latest Collections
            </h3>
            <p className="text-red-100 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter and be the first to know about new
              arrivals, exclusive offers, and traditional fashion trends.
            </p>

            <form
              onSubmit={handleNewsletterSubmit}
              className="max-w-md mx-auto flex"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="border-2 flex-1 px-4 py-3 rounded-l-lg text-white focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="bg-white text-red-600 px-6 py-3 rounded-r-lg hover:bg-gray-100 transition-colors flex items-center"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

            {isSubscribed && (
              <p className="mt-4 text-red-100">
                ✅ Thank you for subscribing to our newsletter!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-2 rounded-lg">
                <span className="text-xl font-bold">ONS</span>
              </div>
              <div>
                <span className="text-xl font-bold">ONS Store</span>
                <p className="text-gray-400 text-sm">North Indian Fashion</p>
              </div>
            </div>

            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              Celebrating the beauty of North Indian traditional wear. From
              elegant sarees to stunning lehengas, we bring you authentic
              craftsmanship and timeless designs.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="h-4 w-4" />
                <span>+91 83830 29457</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="h-4 w-4" />
                <span>support@onsstore.com</span>
              </div>
              <div className="flex items-start space-x-3 text-gray-400">
                <MapPin className="h-7 w-7 mt-0.5" />
                <span>
                  ONS Store , opposite Sbi Bank, Laxmi Bazar, Joginder
                  Nagar,Himachal Pradesh 175015
                </span>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="text-lg font-semibold mb-4 mt-6">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.slice(0, 3).map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Care</h4>
            <ul className="space-y-2">
              {footerLinks.support.slice(3).map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="text-lg font-semibold mb-4 mt-6">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Social Links */}
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-400 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-400 transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">
                © 2025 ONS Store. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Proudly celebrating North Indian heritage through fashion
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
