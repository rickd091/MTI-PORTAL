// src/utils/errorHandler.js
export class ApplicationError extends Error {
  constructor(message, code, details = {}) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

export const errorHandler = {
  handle: (error) => {
    if (error instanceof ApplicationError) {
      return {
        message: error.message,
        code: error.code,
        details: error.details
      };
    }

    if (error.response) {
      // Server Error
      return {
        message: error.response.data.message || 'Server Error',
        code: error.response.status,
        details: error.response.data
      };
    }

    if (error.request) {
      // Network Error
      return {
        message: 'Network Error - Please check your connection',
        code: 'NETWORK_ERROR',
        details: { originalError: error }
      };
    }

    // Unknown Error
    return {
      message: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
      details: { originalError: error }
    };
  }
};

// Error Boundary Component
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 rounded-lg">
          <h2 className="text-lg font-medium text-red-800">Something went wrong</h2>
          <p className="mt-2 text-sm text-red-700">
            {this.state.error.message}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}