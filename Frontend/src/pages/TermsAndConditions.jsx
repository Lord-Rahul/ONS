import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative min-h-80 flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-white">
        <div className="relative max-w-4xl mx-auto px-6 text-center py-16">
          <div className="mb-6">
            <div className="w-24 h-px bg-black mx-auto mb-4"></div>
            <span className="inline-block px-6 py-2 border border-gray-300 text-gray-800 rounded-full text-sm font-light tracking-[0.15em] uppercase">
              Terms
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-light text-black mb-4 leading-tight">
            Terms & Conditions
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="prose prose-sm max-w-none font-light text-gray-700 space-y-8">
          <div>
            <h2 className="text-2xl font-light text-black mb-4">1. Introduction</h2>
            <p>
              These Terms and Conditions ("Terms") govern your use of ONS (Original Native Style) website and services. By accessing and using our website, you accept and agree to be bound by the terms of this agreement.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-light text-black mb-4">2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials (information or software) from ONS website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-none space-y-2 pl-4">
              <li>• Modifying or copying the materials</li>
              <li>• Using the materials for commercial purpose or for any public display</li>
              <li>• Attempting to decompile or reverse engineer any software contained on the website</li>
              <li>• Removing any copyright or other proprietary notations from the materials</li>
              <li>• Transferring the materials to another person or "mirroring" the materials on any other server</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-light text-black mb-4">3. Disclaimer</h2>
            <p>
              The materials on ONS website are provided on an 'as is' basis. ONS makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-light text-black mb-4">4. Limitations</h2>
            <p>
              In no event shall ONS or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the ONS website.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-light text-black mb-4">5. Accuracy of Materials</h2>
            <p>
              The materials appearing on ONS website could include technical, typographical, or photographic errors. ONS does not warrant that any of the materials on the website are accurate, complete, or current. ONS may make changes to the materials contained on the website at any time without notice.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-light text-black mb-4">6. Links</h2>
            <p>
              ONS has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by ONS of the site. Use of any such linked website is at the user's own risk.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-light text-black mb-4">7. Modifications</h2>
            <p>
              ONS may revise these terms of service for the website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-light text-black mb-4">8. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-light text-black mb-4">9. Payment & Refund</h2>
            <p>
              All payments must be made at the time of purchase. ONS accepts multiple payment methods. Refunds are processed within 5-7 business days after we receive and inspect your returned items. For detailed information, please refer to our Return Policy.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-light text-black mb-4">10. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account information and password. You agree to accept responsibility for all activities that occur under your account. You must notify ONS immediately of any unauthorized use of your account.
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

export default TermsAndConditions;
