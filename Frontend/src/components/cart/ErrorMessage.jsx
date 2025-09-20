import React from 'react';

const ErrorMessage = ({ error, onDismiss }) => {
  if (!error) return null;

  return (
    <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
      <div className="flex items-center">
        <svg
          className="w-5 h-5 text-red-500 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <span className="text-red-700">{error}</span>
        <button
          onClick={onDismiss}
          className="ml-auto text-red-500 hover:text-red-700"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;