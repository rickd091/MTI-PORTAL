import { performance, PerformanceObserver } from 'perf_hooks';
import { supabase } from './supabase';

// Define critical performance thresholds
export const PERFORMANCE_THRESHOLDS = {
  API_RESPONSE_TIME: 500, // milliseconds
  PAGE_LOAD_TIME: 3000, // milliseconds
  DATABASE_QUERY_TIME: 200, // milliseconds
  FILE_UPLOAD_TIME: 10000, // milliseconds
};

// Performance metrics data structure
interface PerformanceMetric {
  name: string;
  startTime: number;
  duration: number;
  type: 'api' | 'page' | 'database' | 'render' | 'file' | 'other';
  metadata?: Record<string, any>;
  timestamp: string;
}

// Collection of metrics for batch processing
const metricsQueue: PerformanceMetric[] = [];
const QUEUE_FLUSH_INTERVAL = 60000; // 1 minute
const QUEUE_SIZE_LIMIT = 50;

// Setup performance observer
const observer = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    // Only process our custom metrics
    if (entry.name.startsWith('mti-portal:')) {
      const parts = entry.name.split(':');
      const type = parts[1] as PerformanceMetric['type'];
      const name = parts.slice(2).join(':');
      
      addMetricToQueue({
        name,
        startTime: entry.startTime,
        duration: entry.duration,
        type,
        timestamp: new Date().toISOString(),
      });
    }
  });
});

// Start observing performance measurements
observer.observe({ entryTypes: ['measure'] });

// Initialize the metrics system
export const initMonitoring = () => {
  // Set up interval to flush metrics queue
  setInterval(flushMetricsQueue, QUEUE_FLUSH_INTERVAL);
  
  // Set up window performance monitoring for client-side
  if (typeof window !== 'undefined') {
    // Track page load times
    window.addEventListener('load', () => {
      if (window.performance) {
        const pageLoadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        
        trackMetric('page-load', pageLoadTime, 'page', {
          url: window.location.pathname,
          referrer: document.referrer,
        });
      }
    });
    
    // Track client-side errors
    window.addEventListener('error', (event) => {
      reportError({
        message: event.message,
        source: event.filename,
        line: event.lineno,
        column: event.colno,
        stack: event.error?.stack,
        type: 'client',
      });
    });
    
    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      reportError({
        message: event.reason?.message || 'Unhandled Promise rejection',
        stack: event.reason?.stack,
        type: 'promise',
      });
    });
  }
};

/**
 * Start timing a specific operation
 */
export const startTimer = (name: string, type: PerformanceMetric['type'] = 'other') => {
  const timerName = `mti-portal:${type}:${name}`;
  performance.mark(`${timerName}:start`);
  return timerName;
};

/**
 * End timing and record the metric
 */
export const endTimer = (timerName: string, metadata?: Record<string, any>) => {
  try {
    performance.mark(`${timerName}:end`);
    performance.measure(timerName, `${timerName}:start`, `${timerName}:end`);
    
    // Add metadata if provided (will be picked up by the observer)
    const entries = performance.getEntriesByName(timerName, 'measure');
    if (entries.length > 0 && metadata) {
      const entry = entries[0];
      const parts = entry.name.split(':');
      const type = parts[1] as PerformanceMetric['type'];
      const name = parts.slice(2).join(':');
      
      addMetricToQueue({
        name,
        startTime: entry.startTime,
        duration: entry.duration,
        type,
        metadata,
        timestamp: new Date().toISOString(),
      });
    }
    
    // Clean up marks
    performance.clearMarks(`${timerName}:start`);
    performance.clearMarks(`${timerName}:end`);
    performance.clearMeasures(timerName);
  } catch (error) {
    console.error('Error ending performance timer:', error);
  }
};

/**
 * Directly track a metric without timing
 */
export const trackMetric = (
  name: string,
  duration: number,
  type: PerformanceMetric['type'] = 'other',
  metadata?: Record<string, any>
) => {
  addMetricToQueue({
    name,
    startTime: performance.now() - duration,
    duration,
    type,
    metadata,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Add a metric to the processing queue
 */
const addMetricToQueue = (metric: PerformanceMetric) => {
  metricsQueue.push(metric);
  
  // Check if we should alert for slow performance
  checkPerformanceThresholds(metric);
  
  // Flush queue if it's getting large
  if (metricsQueue.length >= QUEUE_SIZE_LIMIT) {
    flushMetricsQueue();
  }
};

/**
 * Check if a metric exceeds performance thresholds
 */
const checkPerformanceThresholds = (metric: PerformanceMetric) => {
  let threshold: number | undefined;
  
  // Determine which threshold to check
  if (metric.type === 'api') {
    threshold = PERFORMANCE_THRESHOLDS.API_RESPONSE_TIME;
  } else if (metric.type === 'page') {
    threshold = PERFORMANCE_THRESHOLDS.PAGE_LOAD_TIME;
  } else if (metric.type === 'database') {
    threshold = PERFORMANCE_THRESHOLDS.DATABASE_QUERY_TIME;
  } else if (metric.type === 'file') {
    threshold = PERFORMANCE_THRESHOLDS.FILE_UPLOAD_TIME;
  }
  
  // Alert if threshold is exceeded
  if (threshold && metric.duration > threshold) {
    console.warn(`Performance threshold exceeded: ${metric.name} (${metric.duration}ms > ${threshold}ms)`);
    
    // In production, this would send to a monitoring service
    reportPerformanceIssue(metric, threshold);
  }
};

/**
 * Report a performance issue to monitoring system
 */
const reportPerformanceIssue = async (metric: PerformanceMetric, threshold: number) => {
  try {
    // In production, this would send to New Relic, Datadog, etc.
    // For now, we'll store in Supabase
    await supabase.from('performance_alerts').insert([{
      metric_name: metric.name,
      metric_type: metric.type,
      duration: metric.duration,
      threshold,
      metadata: metric.metadata,
      created_at: new Date().toISOString(),
    }]);
  } catch (error) {
    console.error('Failed to report performance issue:', error);
  }
};

/**
 * Flush metrics queue to storage/analytics
 */
const flushMetricsQueue = async () => {
  if (metricsQueue.length === 0) return;
  
  const metrics = [...metricsQueue];
  metricsQueue.length = 0; // Clear the queue
  
  try {
    // In production, this would batch send to a time-series database
    // For prototype, we'll store in Supabase
    await supabase.from('performance_metrics').insert(
      metrics.map(metric => ({
        name: metric.name,
        type: metric.type,
        duration: metric.duration,
        metadata: metric.metadata,
        created_at: metric.timestamp,
      }))
    );
  } catch (error) {
    console.error('Failed to store performance metrics:', error);
    // Put items back in queue
    metricsQueue.push(...metrics);
  }
};

/**
 * Report an error to the monitoring system
 */
export const reportError = async (error: any) => {
  try {
    // Capture error details
    const errorData = {
      message: error.message || 'Unknown error',
      stack: error.stack,
      type: error.type || 'unknown',
      source: error.source,
      line: error.line,
      column: error.column,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      timestamp: new Date().toISOString(),
    };
    
    // Log error locally
    console.error('Application error:', errorData);
    
    // In production, this would send to error tracking service like Sentry
    // For now, we'll store in Supabase
    await supabase.from('error_logs').insert([errorData]);
  } catch (logError) {
    console.error('Failed to log error:', logError);
  }
};

/**
 * Create a middleware for tracking API performance
 */
export const performanceMiddleware = () => {
  return (req: any, res: any, next: any) => {
    const startTime = performance.now();
    const route = `${req.method} ${req.path}`;
    
    // Track response time
    res.on('finish', () => {
      const duration = performance.now() - startTime;
      
      trackMetric(route, duration, 'api', {
        method: req.method,
        path: req.path,
        status: res.statusCode,
        contentLength: res.getHeader('content-length'),
        userAgent: req.headers['user-agent'],
      });
    });
    
    next();
  };
};

/**
 * Get system health metrics
 */
export const getSystemHealth = async () => {
  try {
    const startTime = performance.now();
    
    // Check database connectivity
    const { data, error } = await supabase
      .from('health_checks')
      .select('id')
      .limit(1);
      
    const dbResponseTime = performance.now() - startTime;
    
    // Check Redis if available
    let redisStatus = 'unavailable';
    let redisResponseTime = 0;
    if (typeof global.__redisClient !== 'undefined') {
      const redisStartTime = performance.now();
      try {
        await global.__redisClient.ping();
        redisStatus = 'connected';
      } catch (e) {
        redisStatus = 'error';
      }
      redisResponseTime = performance.now() - redisStartTime;
    }
    
    // Calculate memory usage
    const memoryUsage = process.memoryUsage();
    
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        status: error ? 'error' : 'connected',
        responseTime: dbResponseTime,
        error: error ? error.message : null,
      },
      redis: {
        status: redisStatus,
        responseTime: redisResponseTime,
      },
      memory: {
        rss: Math.round(memoryUsage.rss / 1024 / 1024) + 'MB',
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB',
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
        external: Math.round(memoryUsage.external / 1024 / 1024) + 'MB',
      },
      metrics: {
        totalRequests: await getTotalRequestCount(),
        activeUsers: await getActiveUserCount(),
        errorRate: await getErrorRate(),
      },
    };
  } catch (error) {
    console.error('Health check failed:', error);
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
    };
  }
};

// Helper functions for health metrics
async function getTotalRequestCount() {
  const { count } = await supabase
    .from('performance_metrics')
    .select('id', { count: 'exact', head: true })
    .eq('type', 'api')
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
    
  return count || 0;
}

async function getActiveUserCount() {
  const { count } = await supabase
    .from('users')
    .select('id', { count: 'exact', head: true })
    .gte('last_login_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
    
  return count || 0;
}

async function getErrorRate() {
  const { count: errorCount } = await supabase
    .from('error_logs')
    .select('id', { count: 'exact', head: true })
    .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
    
  const totalRequests = await getTotalRequestCount();
  
  return totalRequests > 0 ? (errorCount || 0) / totalRequests : 0;
}
