import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { Database } from '../../lib/database.types';

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
    getAll: () => CookieObject[];
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
        setAll(cookiesToSet: CookieObject[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value, options);
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  return { supabase, response };
};
