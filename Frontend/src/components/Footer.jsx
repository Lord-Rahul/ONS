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

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Categories", href: "/categories" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const customerService = [
    { name: "Size Guide", href: "/size-guide" },
    { name: "Shipping Info", href: "/shipping" },
    { name: "Returns", href: "/returns" },
    { name: "Track Order", href: "/track-order" },
    { name: "FAQ", href: "/faq" },
  ];

  const policies = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Refund Policy", href: "/refund-policy" },
    { name: "Shipping Policy", href: "/shipping-policy" },
  ];

  const socialLinks = [
    {
      name: "Instagram",
      href: "#",
      icon: (
        <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.987 11.988 11.987s11.987-5.366 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.321-1.297C4.252 14.814 3.762 13.663 3.762 12.366c0-1.297.49-2.448 1.366-3.321C5.999 8.169 7.15 7.679 8.447 7.679c1.297 0 2.448.49 3.321 1.366.876.873 1.366 2.024 1.366 3.321 0 1.297-.49 2.448-1.366 3.322-.873.807-2.024 1.3-3.319 1.3zm7.54 1.317c-.435 0-.871-.087-1.277-.235-.406-.148-.783-.353-1.095-.612-.312-.26-.572-.572-.78-.924-.208-.353-.353-.741-.435-1.146-.082-.406-.123-.824-.123-1.254V9.88c0-.43.041-.848.123-1.254.082-.405.227-.793.435-1.146.208-.352.468-.664.78-.924.312-.259.689-.464 1.095-.612.406-.148.842-.235 1.277-.235.435 0 .871.087 1.277.235.406.148.783.353 1.095.612.312.26.572.572.78.924.208.353.353.741.435 1.146.082.406.123.824.123 1.254v4.254c0 .43-.041.848-.123 1.254-.082.405-.227.793-.435 1.146-.208.352-.468.664-.78.924-.312.259-.689.464-1.095.612-.406.148-.842.235-1.277.235z"/>
        </svg>
      )
    },
    {
      name: "Facebook",
      href: "#",
      icon: (
        <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    {
      name: "Twitter",
      href: "#",
      icon: (
        <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      )
    },
    {
      name: "YouTube",
      href: "#",
      icon: (
        <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    }
  ];

  return (
    <footer className="bg-black text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 lg:gap-16">
          
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-white flex items-center justify-center">
                <span className="text-black font-light text-lg sm:text-xl">O</span>
              </div>
              <span className="text-2xl sm:text-3xl font-light tracking-[0.15em]">ONS</span>
            </Link>
            
            <p className="text-gray-400 font-light leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
              Curating timeless elegance through exquisite Indian wear. 
              Where traditional craftsmanship meets contemporary sophistication.
            </p>

            {/* Newsletter Signup */}
            <div className="mb-4 sm:mb-6">
              <h4 className="text-xs sm:text-sm font-light tracking-[0.15em] uppercase mb-3 sm:mb-4 text-white">
                Stay Updated
              </h4>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-3 sm:px-4 py-2 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors font-light text-sm"
                />
                <button className="px-4 sm:px-6 py-2 bg-white text-black hover:bg-gray-200 transition-colors font-light text-sm tracking-wide">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs sm:text-sm font-light tracking-[0.15em] uppercase mb-4 sm:mb-6 text-white">
              Quick Links
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors font-light text-sm leading-relaxed"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-xs sm:text-sm font-light tracking-[0.15em] uppercase mb-4 sm:mb-6 text-white">
              Customer Service
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {customerService.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors font-light text-sm leading-relaxed"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xs sm:text-sm font-light tracking-[0.15em] uppercase mb-4 sm:mb-6 text-white">
              Get in Touch
            </h3>
            
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <svg className="w-3 sm:w-4 h-3 sm:h-4 text-gray-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-gray-400 font-light text-xs sm:text-sm leading-relaxed">
                  123 Fashion Street<br />
                  Mumbai, Maharashtra 400001<br />
                  India
                </p>
              </div>
              
              <div className="flex items-center space-x-2 sm:space-x-3">
                <svg className="w-3 sm:w-4 h-3 sm:h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <p className="text-gray-400 font-light text-xs sm:text-sm">+91 98765 43210</p>
              </div>
              
              <div className="flex items-center space-x-2 sm:space-x-3">
                <svg className="w-3 sm:w-4 h-3 sm:h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-400 font-light text-xs sm:text-sm">hello@ons.com</p>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-xs sm:text-sm font-light tracking-[0.15em] uppercase mb-3 sm:mb-4 text-white">
                Follow Us
              </h4>
              <div className="flex space-x-3 sm:space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-gray-400 hover:text-white transition-colors p-1 sm:p-2 hover:bg-gray-900 rounded"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8">
          {/* Trust Badges & Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mb-6 sm:mb-8">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-6 sm:w-8 h-6 sm:h-8 bg-gray-800 flex items-center justify-center rounded">
                <svg className="w-3 sm:w-4 h-3 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h4 className="text-white font-light text-xs sm:text-sm">Free Shipping</h4>
                <p className="text-gray-400 text-xs font-light">On orders above ₹999</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-6 sm:w-8 h-6 sm:h-8 bg-gray-800 flex items-center justify-center rounded">
                <svg className="w-3 sm:w-4 h-3 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h4 className="text-white font-light text-xs sm:text-sm">Secure Payment</h4>
                <p className="text-gray-400 text-xs font-light">100% secure transactions</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-6 sm:w-8 h-6 sm:h-8 bg-gray-800 flex items-center justify-center rounded">
                <svg className="w-3 sm:w-4 h-3 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-white font-light text-xs sm:text-sm">Handcrafted</h4>
                <p className="text-gray-400 text-xs font-light">Authentic artisan made</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Copyright */}
            <p className="text-gray-400 text-xs sm:text-sm font-light text-center lg:text-left">
              © {currentYear} ONS. All rights reserved. Crafted with care.
            </p>

            {/* Policy Links */}
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
              {policies.map((policy, index) => (
                <React.Fragment key={policy.name}>
                  <Link
                    to={policy.href}
                    className="text-gray-400 hover:text-white text-xs font-light tracking-wide transition-colors"
                  >
                    {policy.name}
                  </Link>
                  {index < policies.length - 1 && (
                    <span className="text-gray-600 hidden sm:inline">·</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <span className="text-gray-400 text-xs font-light">We Accept:</span>
              <div className="flex gap-1">
                {['VISA', 'MC', 'UPI', 'Razorpay'].map((method) => (
                  <div key={method} className="px-1.5 sm:px-2 py-1 bg-gray-800 text-gray-400 text-xs font-light rounded">
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
