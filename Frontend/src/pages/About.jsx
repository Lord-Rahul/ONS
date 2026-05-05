import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative min-h-96 flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-white">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M20 20c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8z'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-6 text-center py-20">
          <div className="mb-6">
            <div className="w-24 h-px bg-black mx-auto mb-4"></div>
            <span className="inline-block px-6 py-2 border border-gray-300 text-gray-800 rounded-full text-sm font-light tracking-[0.15em] uppercase">
              Our Story
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-light text-black mb-6 leading-tight">
            Celebrating Indian
            <span className="block font-thin italic text-gray-700 mt-2">Heritage & Craft</span>
          </h1>
          <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
            Preserving centuries of tradition through contemporary fashion
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-light text-black mb-6">Our Mission</h2>
            <div className="w-16 h-px bg-black mb-6"></div>
            <p className="text-gray-700 font-light text-lg leading-relaxed mb-6">
              ONS (Original Native Style) is dedicated to bringing authentic Indian craftsmanship to the modern wardrobe. We collaborate with local artisans and designers to create collections that honor tradition while embracing contemporary aesthetics.
            </p>
            <p className="text-gray-600 font-light text-base leading-relaxed">
              Every piece is a celebration of heritage, quality, and sustainable fashion. We believe that true style lies in the stories woven into every thread.
            </p>
          </div>
          <div className="relative h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden shadow-md">
            <img 
              src="https://blingbag.co.in/cdn/shop/files/GoldenKashmiraAntiqueJewellerySet_1.jpg"
              alt="Indian traditional craftsmanship"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-black mb-4">Our Values</h2>
            <div className="w-16 h-px bg-black mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Quality */}
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-light text-black mb-4">Premium Quality</h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Meticulously curated fabrics and exceptional craftsmanship in every collection
              </p>
            </div>

            {/* Sustainability */}
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-light text-black mb-4">Sustainability</h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Eco-conscious practices and ethical sourcing for a better future
              </p>
            </div>

            {/* Heritage */}
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-light text-black mb-4">Cultural Heritage</h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Preserving traditional techniques while celebrating Indian artistry
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-light text-black mb-4">Our Team</h2>
          <div className="w-16 h-px bg-black mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: 'Priya Sharma',
              role: 'Founder & Creative Director',
              image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiV4XSxJRYv1CJSWo7XuqHilS1K5VsnGQSaw&s'
            },
            {
              name: 'Arjun Mehta',
              role: 'Head of Design',
              image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiV4XSxJRYv1CJSWo7XuqHilS1K5VsnGQSaw&s'
            },
            {
              name: 'Anjali Desai',
              role: 'Sustainability Lead',
              image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiV4XSxJRYv1CJSWo7XuqHilS1K5VsnGQSaw&s'
            }
          ].map((member) => (
            <div key={member.name} className="text-center">
              <div className="mb-6 h-64 bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                <img 
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-light text-black mb-2">{member.name}</h3>
              <p className="text-gray-600 font-light">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-black text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-light mb-6">Join Our Community</h2>
          <p className="text-lg font-light text-gray-300 mb-8">
            Discover the art of traditional Indian fashion reimagined for the modern world
          </p>
          <Link
            to="/products"
            className="inline-block px-12 py-3 border border-white text-white font-light tracking-wide hover:bg-white hover:text-black transition-all duration-500"
          >
            Explore Collection
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
