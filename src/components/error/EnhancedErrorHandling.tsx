//src/components/error/EnhancedErrorHandling.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, XCircle, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './error-styles.css';

export type ErrorSeverity = 'error' | 'warning' | 'info' | 'success';

export interface ErrorState {
  id: string;
  title?: string;
  message: string;
  severity: ErrorSeverity;
  timestamp: Date;
  actionLabel?: string;
  onAction?: () => void;
  retryable?: boolean;
  details?: unknown;
  groupId?: string;
}

interface EnhancedErrorHandlingProps {
  children: React.ReactNode;
  onError?: (error: Error) => void;
  onClearError?: () => void;
  autoHideDuration?: number;
  maxErrors?: number;
  showIcon?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  grouped?: boolean;
  persistentErrors?: boolean;
  theme?: 'light' | 'dark';
}

const ErrorIcon = {
  error: XCircle,
  warning: AlertTriangle,
  info: AlertCircle,
  success: CheckCircle
};

const ErrorColors = {
  light: {
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    success: 'bg-green-50 text-green-800 border-green-200'
  },
  dark: {
    error: 'bg-red-900 text-red-100 border-red-800',
    warning: 'bg-yellow-900 text-yellow-100 border-yellow-800',
    info: 'bg-blue-900 text-blue-100 border-blue-800',
    success: 'bg-green-900 text-green-100 border-green-800'
  }
};

const positionClasses = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4'
};

export const EnhancedErrorHandling: React.FC<EnhancedErrorHandlingProps> = ({
  children,
  onError,
  onClearError,
  autoHideDuration = 5000,
  maxErrors = 3,
  showIcon = true,
  position = 'top-right',
  grouped = false,
  persistentErrors = false,
  theme = 'light'
}) => {
  const [errors, setErrors] = useState<ErrorState[]>([]);
  const [groupedErrors, setGroupedErrors] = useState<Record<string, ErrorState[]>>({});

  const addError = useCallback((error: Omit<ErrorState, 'id' | 'timestamp'>) => {
    const newError: ErrorState = {
      ...error,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    };

    if (grouped && error.groupId) {
      setGroupedErrors(prev => ({
        ...prev,
        [error.groupId]: [
          ...(prev[error.groupId] || []),
          newError
        ].slice(-maxErrors)
      }));
    } else {
      setErrors(prev => [...prev, newError].slice(-maxErrors));
    }

    if (error.severity === 'error' && onError) {
      onError(new Error(error.message));
    }

    if (!persistentErrors && autoHideDuration > 0) {
      setTimeout(() => {
        removeError(newError.id);
      }, autoHideDuration);
    }
  }, [grouped, maxErrors, onError, persistentErrors, autoHideDuration]);

  const removeError = useCallback((errorId: string) => {
    if (grouped) {
      setGroupedErrors(prev => {
        const newGroupedErrors = { ...prev };
        Object.keys(newGroupedErrors).forEach(groupId => {
          newGroupedErrors[groupId] = newGroupedErrors[groupId].filter(
            error => error.id !== errorId
          );
        });
        return newGroupedErrors;
      });
    } else {
      setErrors(prev => prev.filter(error => error.id !== errorId));
    }
  }, [grouped]);

  const clearAllErrors = useCallback(() => {
    setErrors([]);
    setGroupedErrors({});
    onClearError?.();
  }, [onClearError]);

  const retryAction = useCallback((error: ErrorState) => {
    if (error.onAction) {
      error.onAction();
      removeError(error.id);
    }
  }, [removeError]);

  const ErrorNotification: React.FC<{ error: ErrorState }> = ({ error }) => {
    const Icon = ErrorIcon[error.severity];
    const colorClasses = ErrorColors[theme][error.severity];

    return (
      <div
        className={`error-notification ${colorClasses}`}
        role="alert"
      >
        {showIcon && <Icon className="w-5 h-5 flex-shrink-0" />}
        <div className="flex-1">
          {error.title && (
            <h4 className="error-title">{error.title}</h4>
          )}
          <p className="error-message">{error.message}</p>
          <p className="error-timestamp">
            {error.timestamp.toLocaleTimeString()}
          </p>
          {(error.retryable || error.actionLabel) && (
            <div className="mt-2 flex gap-2">
              {error.retryable && (
                <button
                  onClick={() => retryAction(error)}
                  className="flex items-center text-sm hover:underline"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Retry
                </button>
              )}
              {error.actionLabel && (
                <button
                  onClick={error.onAction}
                  className="text-sm hover:underline"
                >
                  {error.actionLabel}
                </button>
              )}
            </div>
          )}
        </div>
        <button
          onClick={() => removeError(error.id)}
          className="ml-2 text-current opacity-60 hover:opacity-100"
          aria-label="Close"
        >
          <XCircle className="w-5 h-5" />
        </button>
      </div>
    );
  };

  return (
    <>
      <div className={`error-stack ${positionClasses[position]}`}>
        <TransitionGroup>
          {grouped ? (
            Object.entries(groupedErrors).map(([groupId, groupErrors]) => (
              <CSSTransition
                key={groupId}
                timeout={300}
                classNames="error-notification"
              >
                <div className="space-y-2">
                  {groupErrors.map(error => (
                    <ErrorNotification key={error.id} error={error} />
                  ))}
                </div>
              </CSSTransition>
            ))
          ) : (
            errors.map(error => (
              <CSSTransition
                key={error.id}
                timeout={300}
                classNames="error-notification"
              >
                <ErrorNotification error={error} />
              </CSSTransition>
            ))
          )}
        </TransitionGroup>
      </div>

      {children}
    </>
  );
};

export default EnhancedErrorHandling;