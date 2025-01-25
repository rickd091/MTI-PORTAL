//src/components/error/ErrorHandling.tsx
import React, { useState, useEffect } from 'react';
import { AlertCircle, XCircle, AlertTriangle, CheckCircle } from 'lucide-react';

export type ErrorSeverity = 'error' | 'warning' | 'info' | 'success';

interface ErrorState {
  message: string;
  severity: ErrorSeverity;
  timestamp: Date;
}

interface ErrorHandlingProps {
  children: React.ReactNode;
  onError?: (error: Error) => void;
  onClearError?: () => void;
  autoHideDuration?: number;
  maxErrors?: number;
  showIcon?: boolean;
}

const ErrorIcon = {
  error: XCircle,
  warning: AlertTriangle,
  info: AlertCircle,
  success: CheckCircle
};

const ErrorColors = {
  error: 'bg-red-50 text-red-800 border-red-200',
  warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  info: 'bg-blue-50 text-blue-800 border-blue-200',
  success: 'bg-green-50 text-green-800 border-green-200'
};

export const ErrorHandling: React.FC<ErrorHandlingProps> = ({
  children,
  onError,
  onClearError,
  autoHideDuration = 5000,
  maxErrors = 3,
  showIcon = true
}) => {
  const [errors, setErrors] = useState<ErrorState[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (errors.length > 0) {
      setIsVisible(true);
    }
  }, [errors]);

  useEffect(() => {
    if (isVisible && autoHideDuration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoHideDuration]);

  const addError = (message: string, severity: ErrorSeverity = 'error') => {
    setErrors(prev => {
      const newErrors = [
        { message, severity, timestamp: new Date() },
        ...prev
      ].slice(0, maxErrors);

      if (severity === 'error' && onError) {
        onError(new Error(message));
      }

      return newErrors;
    });
  };

  const clearError = (index: number) => {
    setErrors(prev => {
      const newErrors = prev.filter((_, i) => i !== index);
      if (newErrors.length === 0 && onClearError) {
        onClearError();
      }
      return newErrors;
    });
  };

  const clearAllErrors = () => {
    setErrors([]);
    if (onClearError) {
      onClearError();
    }
  };

  const handleChildError = (error: Error) => {
    addError(error.message);
  };

  return (
    <div className="relative">
      {/* Error Display */}
      {isVisible && errors.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {errors.map((error, index) => {
            const Icon = ErrorIcon[error.severity];
            return (
              <div
                key={error.timestamp.getTime()}
                className={`flex items-start p-4 rounded-lg border ${ErrorColors[error.severity]} shadow-lg max-w-md`}
                role="alert"
              >
                <div className="flex items-start">
                  {showIcon && <Icon className="w-5 h-5 mr-3 mt-0.5" />}
                  <div>
                    <p className="font-medium">{error.message}</p>
                    <p className="text-sm mt-1 opacity-75">
                      {error.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => clearError(index)}
                  className="ml-4 text-gray-400 hover:text-gray-600"
                  aria-label="Close"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            );
          })}
          {errors.length > 1 && (
            <button
              onClick={clearAllErrors}
              className="text-sm text-gray-600 hover:text-gray-800 underline ml-4"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {/* Error Boundary for Children */}
      <ErrorBoundary onError={handleChildError}>
        {children}
      </ErrorBoundary>
    </div>
  );
};

// Error Boundary Class Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: (error: Error) => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onError: (error: Error) => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError(error);
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

// Hook for using error handling in other components
export const useErrorHandling = () => {
  const [error, setError] = useState<ErrorState | null>(null);

  const showError = (message: string, severity: ErrorSeverity = 'error') => {
    setError({ message, severity, timestamp: new Date() });
  };

  const clearError = () => {
    setError(null);
  };

  return {
    error,
    showError,
    clearError
  };
};

export default ErrorHandling;