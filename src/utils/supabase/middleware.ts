import { createServerClient, CookieMethods } from '@supabase/ssr';
import type { Database } from '../../lib/database.types';
import type { CookieOptions } from '@supabase/ssr';

// Define the cookie interface to match Supabase's expected structure
export interface CookieObject {
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
}

export interface RequestWithCookies {
  cookies: {
    getAll: () => Array<{ name: string; value: string }>;
    set: (name: string, value: string, options?: CookieObject['options']) => void;
  };
  headers: Headers;
}

export interface ResponseWithCookies {
  cookies: {
    set: (name: string, value: string, options?: CookieObject['options']) => void;
  };
}

export const createClient = (request: RequestWithCookies) => {
  // Create a response object to handle cookies
  let response: ResponseWithCookies = {
    cookies: {
      set: (name: string, value: string, options?: CookieObject['options']) => {
        request.cookies.set(name, value, options);
      }
    }
  };

  const supabase = createServerClient<Database>(
    import.meta.env.VITE_SUPABASE_URL as string,
    import.meta.env.VITE_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        set(name: string, value: string, options: CookieOptions) {
          // Convert any boolean sameSite to string to match expected type
          const safeOptions = options ? {
            ...options,
            sameSite: typeof options.sameSite === 'boolean' 
              ? (options.sameSite ? 'strict' : 'lax') 
              : options.sameSite
          } : undefined;
          
          request.cookies.set(name, value, safeOptions);
          response.cookies.set(name, value, safeOptions);
        },
        remove(name: string, options: CookieOptions) {
          // Convert any boolean sameSite to string to match expected type
          const safeOptions = options ? {
            ...options,
            sameSite: typeof options.sameSite === 'boolean' 
              ? (options.sameSite ? 'strict' : 'lax') 
              : options.sameSite,
            expires: new Date(0)
          } : { expires: new Date(0) };
          
          request.cookies.set(name, '', safeOptions);
          response.cookies.set(name, '', safeOptions);
        }
      } as CookieMethods
    },
  );

  return { supabase, response };
};
