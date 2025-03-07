import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';
import { Request, Response } from 'express';

// Create Redis client for rate limiting
let redisClient: Redis | null = null;

try {
  // Use environment variables for Redis configuration
  redisClient = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD,
    enableReadyCheck: true,
  });
} catch (error) {
  console.error('Redis connection failed:', error);
}

// Standard API rate limiter
export const apiLimiter = rateLimit({
  // Use Redis as store if available, otherwise use memory store
  store: redisClient
    ? new RedisStore({
        sendCommand: (...args: string[]) => redisClient!.call(...args),
      })
    : undefined,
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many requests, please try again later.',
  },
});

// Stricter rate limiter for authentication endpoints
export const authLimiter = rateLimit({
  store: redisClient
    ? new RedisStore({
        sendCommand: (...args: string[]) => redisClient!.call(...args),
      })
    : undefined,
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 login attempts per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many login attempts, please try again later.',
  },
});

// Rate limiter for document uploads to prevent abuse
export const uploadLimiter = rateLimit({
  store: redisClient
    ? new RedisStore({
        sendCommand: (...args: string[]) => redisClient!.call(...args),
      })
    : undefined,
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // limit each IP to 50 upload requests per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many upload requests, please try again later.',
  },
});

// Skip rate limiting for certain IPs (e.g., internal systems)
export const skipRateLimitForTrustedIPs = (req: Request, res: Response, next: Function) => {
  const trustedIPs = process.env.TRUSTED_IPS ? process.env.TRUSTED_IPS.split(',') : [];
  
  if (trustedIPs.includes(req.ip)) {
    next();
  } else {
    // Apply appropriate rate limiter based on route
    if (req.path.includes('/auth/')) {
      authLimiter(req, res, next);
    } else if (req.path.includes('/upload/')) {
      uploadLimiter(req, res, next);
    } else {
      apiLimiter(req, res, next);
    }
  }
};
