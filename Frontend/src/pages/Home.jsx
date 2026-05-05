import React from "react";
import { Hero, CategoryGrid, FeaturedProducts } from "../components/index.js";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <CategoryGrid />
      <FeaturedProducts />
      
      {/* Trust Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-black mb-4">Why Choose ONS</h2>
            <div className="w-16 h-px bg-black mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Free Shipping',
                desc: 'On orders above ₹999'
              },
              {
                title: '15-Day Returns',
                desc: 'Hassle-free returns'
              },
              {
                title: 'Secure Payment',
                desc: 'SSL encrypted checkout'
              },
              {
                title: '24/7 Support',
                desc: 'Dedicated customer service'
              }
            ].map((feature, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto mb-4 h-px w-10 bg-black/20"></div>
                <h3 className="text-lg font-light text-black mb-2">{feature.title}</h3>
                <p className="text-gray-600 font-light text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banner Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-light mb-6">Discover Your Perfect Style</h2>
            <p className="text-xl text-gray-300 font-light mb-8 max-w-2xl mx-auto">
              Explore our curated collection of handpicked Indian wear, crafted with passion and precision
            </p>
            <Link
              to="/products"
              className="inline-block px-12 py-3 border border-white text-white font-light tracking-wide hover:bg-white hover:text-black transition-all duration-500"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Info Cards Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                image: 'https://blingbag.co.in/cdn/shop/files/GoldenKashmiraAntiqueJewellerySet_1.jpg',
                title: 'Artisan Collection',
                desc: 'Handcrafted by skilled artisans preserving traditional techniques'
              },
              {
                image: 'https://www.giva.co/cdn/shop/articles/1-min_7c32be2b-8045-4a94-a1bb-ef3f91115a07.jpg?v=1760355237',
                title: 'Sustainable Fashion',
                desc: 'Eco-friendly materials and ethical production practices'
              },
              {
                image: 'https://medias.utsavfashion.com/media/catalog/product/cache/1/small_image/295x/040ec09b1e35df139433887a97daa66f/s/t/stone-studded-necklace-set-v1-jdn666.jpg',
                title: 'Premium Quality',
                desc: 'Only the finest fabrics and meticulous attention to detail'
              }
            ].map((card, i) => (
              <div key={i} className="group overflow-hidden">
                <div className="h-64 overflow-hidden mb-4">
                  <img 
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-2xl font-light text-black mb-3">{card.title}</h3>
                <p className="text-gray-600 font-light leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
