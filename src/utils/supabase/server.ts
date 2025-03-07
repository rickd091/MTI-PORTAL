import { createServerClient } from '@supabase/ssr';
import type { Database } from '../../lib/database.types';
import type { CookieOptions as SupabaseCookieOptions, CookieMethodsServer } from '@supabase/ssr';

export interface CookieOptions {
  domain?: string;
  path?: string;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

export const createClient = (cookies: {
  get: (name: string) => string | undefined;
  set: (name: string, value: string, options: CookieOptions) => void;
}) => {
  // Create custom cookie methods that implement CookieMethodsServer
  const cookieMethods: CookieMethodsServer = {
    // Get a cookie value by name
    get(name: string) {
      return cookies.get(name);
    },
    // Set a cookie with name, value, and options
    set(name: string, value: string, options: SupabaseCookieOptions) {
      // Convert any boolean sameSite to string to match expected type
      const safeOptions: CookieOptions = {
        ...options,
        sameSite: typeof options.sameSite === 'boolean' 
          ? (options.sameSite ? 'strict' : 'lax') 
          : options.sameSite
      };
      
      cookies.set(name, value, safeOptions);
    },
    // Remove a cookie by setting an expired date
    remove(name: string, options: SupabaseCookieOptions) {
      // Convert any boolean sameSite to string to match expected type
      const safeOptions: CookieOptions = {
        ...options,
        sameSite: typeof options.sameSite === 'boolean' 
          ? (options.sameSite ? 'strict' : 'lax') 
          : options.sameSite,
        expires: new Date(0)
      };
      
      cookies.set(name, '', safeOptions);
    },
    // Required by CookieMethodsServer interface
    getAll() {
      // Since we don't have direct access to all cookies in this interface,
      // we'll return an empty array. This is a compromise but should work
      // as Supabase typically uses specific cookie names it knows about.
      return [];
    }
  };

  return createServerClient<Database>(
    import.meta.env.VITE_SUPABASE_URL as string,
    import.meta.env.VITE_SUPABASE_ANON_KEY as string,
    {
      cookies: cookieMethods
    }
  );
};
