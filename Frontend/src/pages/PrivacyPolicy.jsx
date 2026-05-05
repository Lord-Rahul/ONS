import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative min-h-80 flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-white">
        <div className="relative max-w-4xl mx-auto px-6 text-center py-16">
          <div className="mb-6">
            <div className="w-24 h-px bg-black mx-auto mb-4"></div>
            <span className="inline-block px-6 py-2 border border-gray-300 text-gray-800 rounded-full text-sm font-light tracking-[0.15em] uppercase">
              Privacy Policy
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-light text-black mb-4 leading-tight">
            Your Privacy Matters
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="prose prose-sm max-w-none font-light text-gray-700 space-y-8">
          <div>
            <h2 className="text-2xl font-light text-black mb-4">Introduction</h2>
            <p>
              At ONS (Original Native Style), we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-light text-black mb-4">Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-light text-black mb-2">Personal Information</h3>
                <p>
                  We collect information you provide directly, such as when you create an account, make a purchase, or contact us. This may include your name, email address, phone number, postal address, and payment information.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-light text-black mb-2">Automated Information</h3>
                <p>
                  When you visit our website, we automatically collect certain information about your device and browsing behavior, including IP address, browser type, pages visited, and time spent on the site.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-light text-black mb-2">Cookies</h3>
                <p>
                  We use cookies to enhance your shopping experience, maintain your preferences, and analyze site usage. You can control cookie settings through your browser.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-light text-black mb-4">How We Use Your Information</h2>
            <ul className="list-none space-y-2 pl-0">
              <li>• To process and fulfill your orders</li>
              <li>• To send order updates and shipping notifications</li>
              <li>• To provide customer support and handle inquiries</li>
              <li>• To improve our website and services</li>
              <li>• To send promotional emails (with your consent)</li>
              <li>• To comply with legal obligations</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-light text-black mb-4">Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal information. However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security of your data.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-light text-black mb-4">Sharing Your Information</h2>
            <p>
              We do not sell, trade, or rent your personal information. We may share your information with trusted service providers who assist us in operating our website and conducting business. These parties are contractually obligated to keep your information confidential.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-light text-black mb-4">Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal information. You can also opt out of marketing communications at any time. To exercise these rights, contact us at privacy@ons.store.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-light text-black mb-4">Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or our privacy practices, please contact us at:<br />
              <strong>Email:</strong> privacy@ons.store<br />
              <strong>Address:</strong> 123 Heritage Lane, New Delhi, India 110001
            </p>
          </div>

          <div className="pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Last updated: May 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
