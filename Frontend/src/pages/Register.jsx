import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authServices.js";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false); // New state for terms agreement
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError("");
  };

  const handleTermsChange = (e) => {
    setAgreedToTerms(e.target.checked);
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError("Full name is required");
      return false;
    }

    if (formData.fullName.trim().length < 2) {
      setError("Full name must be at least 2 characters long");
      return false;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (!formData.password) {
      setError("Password is required");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    // Phone validation - required field
    if (!formData.phone || !formData.phone.trim()) {
      setError("Phone number is required");
      return false;
    }

    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      setError("Please enter a valid phone number (10-15 digits)");
      return false;
    }

    // Terms and conditions validation
    if (!agreedToTerms) {
      setError("You must agree to the Terms & Conditions and Privacy Policy to create an account");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Double check terms agreement before submission
    if (!agreedToTerms) {
      setError("You must agree to the Terms & Conditions and Privacy Policy to create an account");
      return;
    }

    if (!validateForm()) return;

    setLoading(true);
    setError("");
    
    try {
      const registrationData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        number: formData.phone.replace(/\D/g, '') // Backend expects 'number', not 'phone'
      };

      console.log("Attempting registration with:", { ...registrationData, password: "[HIDDEN]" });
      
      const response = await authService.register(registrationData);
      
      console.log("Registration response:", response);
      
      if (response && (response.success || response.data)) {
        navigate("/login", { 
          state: { 
            message: "Registration successful! Please sign in with your credentials." 
          }
        });
      } else {
        setError(response?.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      
      // Handle different error formats
      let errorMessage = "Registration failed. Please try again.";
      
      // Check if the error response contains HTML (server error page)
      if (typeof err === 'string' && err.includes('<html>')) {
        // Extract error message from HTML
        const match = err.match(/Error: ([^<]+)/);
        if (match) {
          errorMessage = match[1].trim();
        }
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data && typeof err.response.data === 'string' && err.response.data.includes('<html>')) {
        // Extract error from HTML response
        const match = err.response.data.match(/Error: ([^<]+)/);
        if (match) {
          errorMessage = match[1].trim();
        }
      } else if (err.data?.message) {
        errorMessage = err.data.message;
      } else if (err.message && !err.message.includes('<html>')) {
        errorMessage = err.message;
      }
      
      // Handle common registration errors
      if (errorMessage.toLowerCase().includes('email') && errorMessage.toLowerCase().includes('exists')) {
        errorMessage = "An account with this email already exists. Please use a different email or try logging in.";
      } else if (errorMessage.toLowerCase().includes('phone') && errorMessage.toLowerCase().includes('exists')) {
        errorMessage = "An account with this phone number already exists. Please use a different phone number or try logging in.";
      } else if (errorMessage.toLowerCase().includes('validation')) {
        errorMessage = "Please check your input and try again.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Side - Brand */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1583391733956-6c78276477e1?w=800&h=1200&fit=crop&crop=face"
            alt="Fashion Collection"
            className="w-full h-full object-cover opacity-60"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/30"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <Link to="/" className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-white flex items-center justify-center">
              <span className="text-black font-light text-2xl">O</span>
            </div>
            <span className="text-4xl font-light tracking-[0.15em]">ONS</span>
          </Link>

          <h1 className="text-4xl md:text-5xl font-light mb-6 leading-tight">
            Join Our
            <span className="block font-thin italic mt-2">Fashion Community</span>
          </h1>

          <p className="text-xl font-light text-white/80 mb-8 leading-relaxed">
            Create your account and discover exclusive collections curated just for you.
          </p>

          <div className="space-y-4 text-white/70">
            {[
              "Exclusive member discounts",
              "Early access to new collections", 
              "Personalized style recommendations"
            ].map((benefit, index) => (
              <div key={index} className="flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-3 flex-shrink-0"></div>
                <span className="font-light">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          {/* Mobile Brand Header */}
          <div className="lg:hidden text-center">
            <Link to="/" className="inline-flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-black flex items-center justify-center">
                <span className="text-white font-light text-xl">O</span>
              </div>
              <span className="text-3xl font-light tracking-[0.15em] text-black">ONS</span>
            </Link>
          </div>

          {/* Form Header */}
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-light text-black mb-2">
              Create Account
            </h2>
            <div className="w-16 h-px bg-black mx-auto mb-4"></div>
            <p className="text-gray-600 font-light">
              Join us to start your fashion journey
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm font-light rounded">
              {error}
            </div>
          )}

          {/* Register Form */}
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-light text-gray-700 mb-2 tracking-wide">
                Full Name *
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors font-light rounded-none"
                placeholder="Enter your full name"
                disabled={loading}
                autoComplete="name"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-light text-gray-700 mb-2 tracking-wide">
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors font-light rounded-none"
                placeholder="Enter your email"
                disabled={loading}
                autoComplete="email"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-light text-gray-700 mb-2 tracking-wide">
                Phone Number *
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors font-light rounded-none"
                placeholder="Enter your phone number"
                disabled={loading}
                autoComplete="tel"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-light text-gray-700 mb-2 tracking-wide">
                Password *
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors font-light pr-12 rounded-none"
                  placeholder="Create a password (min. 6 characters)"
                  disabled={loading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>) : (
                    <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-light text-gray-700 mb-2 tracking-wide">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors font-light pr-12 rounded-none"
                  placeholder="Confirm your password"
                  disabled={loading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>) : (
                    <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Terms & Conditions - Enhanced */}
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                checked={agreedToTerms}
                onChange={handleTermsChange}
                className="h-4 w-4 text-black focus:ring-black border-gray-300 mt-1 rounded"
                disabled={loading}
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 font-light">
                I agree to the{' '}
                <Link 
                  to="/terms" 
                  className="text-black hover:text-gray-800 underline" 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms & Conditions
                </Link>
                {' '}and{' '}
                <Link 
                  to="/privacy" 
                  className="text-black hover:text-gray-800 underline" 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </Link>
                {' '}<span className="text-red-500">*</span>
              </label>
            </div>

            {/* Submit Button - Disabled when terms not agreed */}
            <div>
              <button
                type="submit"
                disabled={loading || !agreedToTerms}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-light tracking-[0.1em] uppercase text-white transition-all duration-300 rounded-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${
                  loading || !agreedToTerms
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-black hover:bg-gray-800'
                }`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </div>
                ) : (
                  <span className="flex items-center">
                    {!agreedToTerms ? 'Agree to Terms to Continue' : 'Create Account'}
                    {agreedToTerms && (
                      <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </span>
                )}
              </button>
            </div>

            {/* Additional Terms Reminder */}
            {!agreedToTerms && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 text-sm font-light rounded">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Please read and accept our Terms & Conditions and Privacy Policy to create your account.
                </div>
              </div>
            )}

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600 font-light">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-light text-black hover:text-gray-800 transition-colors underline"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;