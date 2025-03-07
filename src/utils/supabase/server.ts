import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { Database } from '../../lib/database.types';

export interface CookieStore {
  getAll: () => Array<{
    name: string;
    value: string;
  }>;
  set: (name: string, value: string, options?: {
    domain?: string;
    path?: string;
    expires?: Date;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
  }) => void;
}

export const createClient = (cookieStore: CookieStore) => {
  return createServerClient<Database>(
    import.meta.env.VITE_SUPABASE_URL as string,
    import.meta.env.VITE_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: Array<{
          name: string;
          value: string;
          options?: {
            domain?: string;
            path?: string;
            expires?: Date;
            httpOnly?: boolean;
            secure?: boolean;
            sameSite?: 'strict' | 'lax' | 'none';
          };
        }>) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch (error) {
            console.error('Error setting cookies:', error);
            // This can happen in environments where cookies cannot be set
            // or when running in a server environment
          }
        },
      },
    },
  );
};
