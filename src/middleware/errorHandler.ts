import { Request, Response, NextFunction } from 'express';
import { auditLog } from './audit';

// Define custom error classes
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  errors: Record<string, string>;
  
  constructor(message: string, errors: Record<string, string>) {
    super(message, 400);
    this.errors = errors;
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'You are not authorized to perform this action') {
    super(message, 403);
  }
}

export class ResourceNotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404);
  }
}

// Global error handling middleware
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  // Log error details
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params,
    timestamp: new Date().toISOString(),
  });

  // Handle known errors
  if (err instanceof AppError) {
    // Log significant errors to the audit log
    if (req.user && req.user.id) {
      auditLog(
        req.user.id,
        'ERROR',
        'system',
        err.name,
        { message: err.message, code: err.statusCode },
        req.ip
      );
    }

    // Return structured error response
    if (err instanceof ValidationError) {
      return res.status(err.statusCode).json({
        status: 'error',
        message: err.message,
        errors: err.errors,
      });
    }

    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // Handle unexpected errors
  console.error('Unhandled error:', err);
  
  // Don't expose error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return res.status(500).json({
    status: 'error',
    message: 'An unexpected error occurred. Please try again later.',
    ...(isDevelopment && { details: err.message, stack: err.stack }),
  });
};

// Async error handler wrapper to avoid try/catch blocks
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Handle 404 errors for undefined routes
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  next(new ResourceNotFoundError('Route'));
};
