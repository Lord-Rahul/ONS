/**
 * Utility to dynamically load Razorpay checkout script
 * @returns {Promise<boolean>} - Promise that resolves when script is loaded
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve, reject) => {
    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      console.log('✅ Razorpay already loaded');
      resolve(true);
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      console.log('🔄 Razorpay script already loading...');
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Razorpay SDK')));
      return;
    }

    console.log('🔄 Loading Razorpay script...');
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log('✅ Razorpay script loaded successfully');
      if (window.Razorpay) {
        resolve(true);
      } else {
        reject(new Error('Razorpay SDK not available after load'));
      }
    };
    
    script.onerror = (error) => {
      console.error('❌ Failed to load Razorpay script:', error);
      reject(new Error('Failed to load Razorpay SDK'));
    };
    
    document.head.appendChild(script);
  });
};

/**
 * Check if Razorpay is available
 * @returns {boolean}
 */
export const isRazorpayLoaded = () => {
  return typeof window !== 'undefined' && !!window.Razorpay;
};

/**
 * Get Razorpay version if available
 * @returns {string|null}
 */
export const getRazorpayVersion = () => {
  if (isRazorpayLoaded() && window.Razorpay.version) {
    return window.Razorpay.version;
  }
  return null;
};