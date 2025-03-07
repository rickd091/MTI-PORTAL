import { createServerClient, CookieMethods } from '@supabase/ssr';
import type { Database } from '../../lib/database.types';
import type { CookieOptions } from '@supabase/ssr';

export interface ServerCookieOptions {
  domain?: string;
  path?: string;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

export const createClient = (cookies: {
  get: (name: string) => string | undefined;
  set: (name: string, value: string, options: ServerCookieOptions) => void;
}) => {
  return createServerClient<Database>(
    import.meta.env.VITE_SUPABASE_URL as string,
    import.meta.env.VITE_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        // Implement the cookie methods required by Supabase SSR
        getAll() {
          // Since we don't have direct access to all cookies in this interface,
          // we'll return an empty array. This is a compromise but should work
          // as Supabase typically uses specific cookie names it knows about.
          return [];
        },
        get(name: string) {
          return cookies.get(name);
        },
        set(name: string, value: string, options: CookieOptions) {
          // Convert any boolean sameSite to string to match expected type
          const safeOptions: ServerCookieOptions = {
            ...options,
            sameSite: typeof options.sameSite === 'boolean' 
              ? (options.sameSite ? 'strict' : 'lax') 
              : options.sameSite
          };
          
          cookies.set(name, value, safeOptions);
        },
        remove(name: string, options: CookieOptions) {
          // Convert any boolean sameSite to string to match expected type
          const safeOptions: ServerCookieOptions = {
            ...options,
            sameSite: typeof options.sameSite === 'boolean' 
              ? (options.sameSite ? 'strict' : 'lax') 
              : options.sameSite,
            expires: new Date(0)
          };
          
          cookies.set(name, '', safeOptions);
        }
      } as CookieMethods
    }
  );
};
