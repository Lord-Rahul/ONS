import React, { useState } from 'react';

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqItems = [
    {
      question: 'How long does shipping take?',
      answer: 'We offer free shipping on orders above ₹999. Standard delivery takes 5-7 business days. Express delivery (2-3 days) is available for select locations at an additional cost.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer hassle-free returns within 15 days of purchase. Items must be in original condition with tags attached. Once we receive your return, refunds are processed within 5-7 business days.'
    },
    {
      question: 'Do you offer international shipping?',
      answer: 'Currently, we ship only within India. We\'re expanding our international operations. Sign up for our newsletter to be notified when we launch globally.'
    },
    {
      question: 'How do I track my order?',
      answer: 'You\'ll receive a tracking number via email once your order ships. You can also track your order in your account under "Orders" section. Updates are sent via email and SMS.'
    },
    {
      question: 'How do I care for my garments?',
      answer: 'Each garment comes with detailed care instructions. Most pieces can be hand-washed in cool water with mild detergent. We recommend air-drying and avoiding harsh chemicals to maintain the fabric quality.'
    },
    {
      question: 'Can I exchange items instead of returning?',
      answer: 'Yes! You can exchange items for a different size or design within 15 days of purchase. Contact our support team to arrange an exchange. No additional charges for exchanges within our return window.'
    },
    {
      question: 'Do you have brick-and-mortar stores?',
      answer: 'Currently, ONS operates as an online-only store. However, we host pop-up shops in major cities during festive seasons. Follow us on Instagram for pop-up announcements.'
    },
    {
      question: 'Are your products eco-friendly?',
      answer: 'Yes! We\'re committed to sustainability. We use eco-friendly fabrics, minimal packaging, and support artisans who practice ethical production. Learn more on our Sustainability page.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative min-h-80 flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-white">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M20 20c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8z'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-6 text-center py-16">
          <div className="mb-6">
            <div className="w-24 h-px bg-black mx-auto mb-4"></div>
            <span className="inline-block px-6 py-2 border border-gray-300 text-gray-800 rounded-full text-sm font-light tracking-[0.15em] uppercase">
              FAQ
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-light text-black mb-4 leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 font-light">
            Find answers to common questions about our products and services
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div key={index} className="border border-gray-200 hover:border-black transition-colors duration-300">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-light text-black text-left">
                  {item.question}
                </h3>
                <svg
                  className={`w-5 h-5 text-black flex-shrink-0 ml-4 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </button>

              {openIndex === index && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700 font-light leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-20 text-center bg-gray-50 px-8 py-12 rounded-lg">
          <h3 className="text-2xl font-light text-black mb-4">Still have questions?</h3>
          <p className="text-gray-600 font-light mb-6">
            Reach out to our support team - we're here to help!
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 border border-black text-black font-light tracking-wide hover:bg-black hover:text-white transition-all duration-500"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQs;
