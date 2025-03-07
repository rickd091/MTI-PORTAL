import React from 'react';

export interface AlertProps {
  variant?: 'default' | 'destructive';
  className?: string;
  children?: React.ReactNode;
}

export const Alert: React.FC<AlertProps>;
export const AlertTitle: React.FC<{ children: React.ReactNode }>;
export const AlertDescription: React.FC<{ children: React.ReactNode }>;
