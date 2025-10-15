

const isDevelopment = import.meta.env.MODE === 'development';
const isProduction = import.meta.env.MODE === 'production';


export const logger = {
 
  log: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  
  error: (...args) => {
    if (isDevelopment) {
      console.error(...args);
    } else if (isProduction) {
   
      console.error(...args); // Keep critical errors visible
    }
  },

  warn: (...args) => {
    if (isDevelopment) {
      console.warn(...args);
    } else if (isProduction) {
     
      console.warn(...args);
    }
  },

  /**
   * Log debug information (development only)
   */
  debug: (...args) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },

  /**
   * Log info with emoji prefix (development only)
   */
  info: (emoji, ...args) => {
    if (isDevelopment) {
      console.log(emoji, ...args);
    }
  },
};

/**
 * Production-safe console group
 */
export const logGroup = (title, callback) => {
  if (isDevelopment) {
    console.group(title);
    callback();
    console.groupEnd();
  }
};

export default logger;
