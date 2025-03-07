import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// Debug flag for detailed logging
const DEBUG = true;

function logDebug(message: string, data?: any): void {
  if (DEBUG) {
    console.log(`[SUPABASE-DEBUG] ${message}`, data || '');
  }
}

// Get environment variables with fallbacks for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zrnngescxhrjdzpzujnt.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpybm5nZXNjeGhyamR6cHp1am50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwNDgxOTAsImV4cCI6MjA1MzYyNDE5MH0.6K1oQZXiFz0WSVau-vsbXN9_4ciTM2Bs1Zc6r4rFfQE';

logDebug('Supabase configuration', {
  url: supabaseUrl,
  keyConfigured: !!supabaseAnonKey,
  mode: import.meta.env.MODE,
});

// Validate Supabase credentials
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "⚠️ Missing Supabase credentials. Please check your configuration."
  );
  
  // In development, provide helpful information
  if (import.meta.env.DEV) {
    console.info(
      "ℹ️ For local development, make sure you have created a .env.local file with the following variables:\n" +
      "VITE_SUPABASE_URL=your_supabase_url\n" +
      "VITE_SUPABASE_ANON_KEY=your_supabase_anon_key"
    );
  }
}

// Create and export the typed Supabase client
logDebug('Creating Supabase client', {});
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
logDebug('Supabase client created', {});

// Helper function to check if Supabase connection is working
export async function checkSupabaseConnection() {
  try {
    logDebug('Testing Supabase connection with URL:', supabaseUrl);
    const startTime = performance.now();
    
    // Try to access the applications table
    const { data: _data, error } = await supabase.from("applications").select("count", { count: 'exact', head: true });
    
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    
    if (error) {
      logDebug('Supabase connection failed', { 
        error: error.message, 
        code: error.code, 
        details: error.details,
        hint: error.hint
      });
      throw error;
    }
    
    logDebug('Supabase connection successful', { responseTime: `${responseTime.toFixed(2)}ms` });
    
    // Test additional tables to verify database schema
    const tables = ['applications', 'institutions', 'inspections', 'documents', 'profiles'];
    const tableResults: Record<string, boolean> = {};
    
    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select('count', { count: 'exact', head: true });
        tableResults[table] = !error;
        if (error) {
          logDebug(`Table check failed: ${table}`, { error: error.message });
        } else {
          logDebug(`Table check successful: ${table}`, {});
        }
      } catch (err) {
        tableResults[table] = false;
        logDebug(`Table check error: ${table}`, { error: err instanceof Error ? err.message : String(err) });
      }
    }
    
    logDebug('Table check results', tableResults);
    return true;
  } catch (error) {
    console.error("❌ Supabase connection failed:", error);
    return false;
  }
}
