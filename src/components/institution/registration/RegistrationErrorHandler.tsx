//src/components/institution/registration/RegistrationErrorHandler.tsx
import React from 'react';
import { EnhancedErrorHandling } from '../../error/EnhancedErrorHandling';

export const RegistrationErrorHandler: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const handleRegistrationError = (error: Error) => {
    // Handle registration-specific errors
    if (error.message.includes('document validation')) {
      // Handle document validation errors
      return {
        title: 'Document Validation Error',
        message: error.message,
        severity: 'error' as const,
        retryable: true
      };
    }

    if (error.message.includes('network')) {
      // Handle network errors
      return {
        title: 'Connection Error',
        message: 'Please check your internet connection and try again',
        severity: 'warning' as const,
        retryable: true
      };
    }

    // Default error handling
    return {
      title: 'Registration Error',
      message: error.message,
      severity: 'error' as const
    };
  };

  return (
    <EnhancedErrorHandling
      position="top-right"
      onError={handleRegistrationError}
      grouped={true}
      persistentErrors={true}
    >
      {children}
    </EnhancedErrorHandling>
  );
};