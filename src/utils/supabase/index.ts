/**
 * Centralized Supabase client exports
 * 
 * This file serves as the single source of truth for Supabase clients
 * throughout the application. It re-exports the appropriate client
 * based on the execution context (browser or server).
 */

// Export the browser client as the default client
export { supabase } from './client';

// Export named clients for specific use cases
export { supabase as browserClient } from './client';

// Export utility functions for creating clients in different contexts
export { createBrowserClient } from './client';
export { createClient as createServerClient } from './server';
export { createClient as createMiddlewareClient } from './middleware';

// Export connection testing utilities
export { testSupabaseConnection } from '../../test-supabase';
