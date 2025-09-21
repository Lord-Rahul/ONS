import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log to error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Send to error reporting service (Sentry, LogRocket, etc.)
      this.logErrorToService(error, errorInfo);
    }
  }

  logErrorToService(error, errorInfo) {
    // Implement error logging service
    console.log('Logging error to service:', { error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry);
      }

      return (
        <ErrorFallback 
          error={this.state.error}
          onRetry={this.handleRetry}
          level={this.props.level || 'component'}
        />
      );
    }

    return this.props.children;
  }
}

const ErrorFallback = ({ error, onRetry, level }) => {
  const isPageLevel = level === 'page';
  
  return (
    <div className={`${isPageLevel ? 'min-h-screen bg-gray-50 pt-20' : 'p-8'} flex items-center justify-center`}>
      <div className="max-w-md mx-auto text-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {isPageLevel ? 'Page Error' : 'Something went wrong'}
        </h2>
        
        <p className="text-gray-600 mb-6">
          {isPageLevel 
            ? 'We encountered an error loading this page.' 
            : 'This component failed to load properly.'
          }
        </p>
        
        {process.env.NODE_ENV === 'development' && error && (
          <details className="text-left bg-red-50 p-4 rounded mb-4">
            <summary className="cursor-pointer text-red-700 font-medium">
              Error Details
            </summary>
            <pre className="mt-2 text-xs text-red-600 overflow-auto">
              {error.toString()}
            </pre>
          </details>
        )}
        
        <div className="space-y-3">
          <button
            onClick={onRetry}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
          
          {isPageLevel && (
            <button
              onClick={() => window.location.href = '/'}
              className="block w-full text-gray-600 hover:text-black underline"
            >
              Go to Homepage
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// HOC for wrapping components with error boundary
export const withErrorBoundary = (Component, level = 'component') => {
  return function ComponentWithErrorBoundary(props) {
    return (
      <ErrorBoundary level={level}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
};

export default ErrorBoundary;