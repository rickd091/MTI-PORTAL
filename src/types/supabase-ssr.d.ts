declare module '@supabase/ssr' {
  import { SupabaseClient, Session } from '@supabase/supabase-js';

  export interface CookieOptions {
    domain?: string;
    path?: string;
    expires?: Date;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none' | boolean;
    maxAge?: number;
  }

  export interface CookieMethods {
    get(name: string): string | undefined;
    set(name: string, value: string, options?: CookieOptions): void;
    remove(name: string, options?: CookieOptions): void;
    getAll(): Array<{ name: string; value: string }>;
  }

  export interface CreateClientOptions {
    cookies: CookieMethods;
    auth?: {
      flowType?: 'implicit' | 'pkce';
      autoRefreshToken?: boolean;
      persistSession?: boolean;
      detectSessionInUrl?: boolean;
    };
  }

  export function createBrowserClient<Database = any>(
    supabaseUrl: string,
    supabaseKey: string,
    options?: {
      cookies?: {
        name?: string;
        lifetime?: number;
        domain?: string;
        path?: string;
        sameSite?: 'strict' | 'lax' | 'none';
      };
      auth?: {
        flowType?: 'implicit' | 'pkce';
        autoRefreshToken?: boolean;
        persistSession?: boolean;
        detectSessionInUrl?: boolean;
      };
    }
  ): SupabaseClient<Database>;

  export function createServerClient<Database = any>(
    supabaseUrl: string,
    supabaseKey: string,
    options: CreateClientOptions
  ): SupabaseClient<Database>;
}
