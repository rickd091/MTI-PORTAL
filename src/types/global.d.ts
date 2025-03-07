// Add global type definitions here

declare module '@supabase/ssr' {
  import { SupabaseClient } from '@supabase/supabase-js';
  
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

  export function createServerClient<Database = any>(
    supabaseUrl: string,
    supabaseKey: string,
    options: {
      cookies: CookieMethods;
    }
  ): SupabaseClient<Database>;
}
