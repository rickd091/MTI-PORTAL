import Redis from 'ioredis';

// Initialize Redis client
let redisClient: Redis | null = null;

try {
  redisClient = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD,
    enableReadyCheck: true,
  });
  
  redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
  });
  
  redisClient.on('connect', () => {
    console.log('Redis connected successfully');
  });
} catch (error) {
  console.error('Redis initialization failed:', error);
}

// Default cache expiration time in seconds
const DEFAULT_CACHE_TTL = 3600; // 1 hour

/**
 * Set value in cache
 */
export const cacheSet = async (
  key: string,
  value: any,
  ttl: number = DEFAULT_CACHE_TTL
): Promise<void> => {
  if (!redisClient) return;
  
  try {
    await redisClient.set(key, JSON.stringify(value), 'EX', ttl);
  } catch (error) {
    console.error(`Error setting cache for key ${key}:`, error);
  }
};

/**
 * Get value from cache
 */
export const cacheGet = async <T>(key: string): Promise<T | null> => {
  if (!redisClient) return null;
  
  try {
    const cachedData = await redisClient.get(key);
    if (!cachedData) return null;
    
    return JSON.parse(cachedData) as T;
  } catch (error) {
    console.error(`Error getting cache for key ${key}:`, error);
    return null;
  }
};

/**
 * Delete value from cache
 */
export const cacheDelete = async (key: string): Promise<void> => {
  if (!redisClient) return;
  
  try {
    await redisClient.del(key);
  } catch (error) {
    console.error(`Error deleting cache for key ${key}:`, error);
  }
};

/**
 * Delete multiple keys matching a pattern
 */
export const cacheDeletePattern = async (pattern: string): Promise<void> => {
  if (!redisClient) return;
  
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(...keys);
    }
  } catch (error) {
    console.error(`Error deleting cache pattern ${pattern}:`, error);
  }
};

/**
 * Cache middleware for Express routes
 * Usage: app.get('/api/data', cacheMiddleware(300), getDataHandler);
 */
export const cacheMiddleware = (ttl: number = DEFAULT_CACHE_TTL) => {
  return async (req: any, res: any, next: any) => {
    if (!redisClient) return next();
    
    // Skip caching for non-GET requests
    if (req.method !== 'GET') return next();
    
    // Generate cache key from URL and query parameters
    const cacheKey = `api:${req.originalUrl}`;
    
    try {
      const cachedResponse = await cacheGet(cacheKey);
      
      if (cachedResponse) {
        // Return cached response
        return res.json(cachedResponse);
      }
      
      // Store original json method
      const originalJson = res.json;
      
      // Override json method to cache response
      res.json = function (data: any) {
        // Cache the response data
        cacheSet(cacheKey, data, ttl);
        
        // Call original json method
        return originalJson.call(this, data);
      };
      
      next();
    } catch (error) {
      console.error(`Error in cache middleware for ${cacheKey}:`, error);
      next();
    }
  };
};

/**
 * Helper function to generate consistent cache keys
 */
export const generateCacheKey = (prefix: string, id: string, ...parts: string[]) => {
  return [prefix, id, ...parts].join(':');
};

/**
 * Cache wrapper for expensive function calls
 */
export const cachify = <T, A extends any[]>(
  fn: (...args: A) => Promise<T>,
  keyGenerator: (...args: A) => string,
  ttl: number = DEFAULT_CACHE_TTL
) => {
  return async (...args: A): Promise<T> => {
    if (!redisClient) return fn(...args);
    
    const cacheKey = keyGenerator(...args);
    
    try {
      // Try to get from cache first
      const cachedData = await cacheGet<T>(cacheKey);
      if (cachedData !== null) return cachedData;
      
      // If not in cache, call the original function
      const result = await fn(...args);
      
      // Cache the result
      await cacheSet(cacheKey, result, ttl);
      
      return result;
    } catch (error) {
      console.error(`Error in cachify for key ${cacheKey}:`, error);
      // Fall back to original function if caching fails
      return fn(...args);
    }
  };
};
