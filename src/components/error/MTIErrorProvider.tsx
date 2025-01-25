//src/components/error/MTIErrorProvider.tsx
import React from 'react';
import { EnhancedErrorHandling } from './EnhancedErrorHandling';

// MTI-specific error configurations
export const MTIErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <EnhancedErrorHandling
      position="top-right"
      theme="light"
      maxErrors={3}
      autoHideDuration={5000}
      grouped={true}
      onError={(error) => {
        // Log errors to your monitoring system
        console.error('MTI Portal Error:', error);
        // You might want to send this to your error tracking service
      }}
    >
      {children}
    </EnhancedErrorHandling>
  );
};