import { useState, useCallback } from 'react';
import useToast from './useToast.js';

const useErrorHandler = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const handleError = useCallback((error, options = {}) => {
    const {
      showToast = true,
      logError = true,
      customMessage = null
    } = options;

    console.error('Error caught by useErrorHandler:', error);

    let errorMessage = 'An unexpected error occurred';
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    if (customMessage) {
      errorMessage = customMessage;
    }

    setError({
      message: errorMessage,
      status: error.response?.status || 500,
      timestamp: new Date().toISOString()
    });

    if (showToast) {
      addToast(errorMessage, 'error');
    }

    if (logError && process.env.NODE_ENV === 'production') {
      // Log to error service
      console.log('Logging error to service');
    }

    return errorMessage;
  }, [addToast]);

  const executeAsync = useCallback(async (asyncFunction, options = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await asyncFunction();
      return result;
    } catch (error) {
      handleError(error, options);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    isLoading,
    handleError,
    executeAsync,
    clearError
  };
};

export default useErrorHandler;