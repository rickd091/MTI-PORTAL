import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../lib/database.types';

export const createBrowserClient = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials. Please check your environment variables.');
  }
  
  return createClient<Database>(supabaseUrl, supabaseKey);
};

// Export a singleton instance for convenience
export const supabase = createBrowserClient();
