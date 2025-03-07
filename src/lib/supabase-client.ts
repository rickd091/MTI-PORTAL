import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// Hardcoded Supabase credentials (for development only)
const supabaseUrl = 'https://zrnngescxhrjdzpzujnt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpybm5nZXNjeGhyamR6cHp1am50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwNDgxOTAsImV4cCI6MjA1MzYyNDE5MH0.6K1oQZXiFz0WSVau-vsbXN9_4ciTM2Bs1Zc6r4rFfQE';

// Fallback to environment variables if available
const envSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const envSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Use environment variables if available, otherwise use hardcoded values
const finalSupabaseUrl = envSupabaseUrl || supabaseUrl;
const finalSupabaseAnonKey = envSupabaseAnonKey || supabaseAnonKey;

// Validate Supabase credentials
if (!finalSupabaseUrl || !finalSupabaseAnonKey) {
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
export const supabase = createClient<Database>(
  finalSupabaseUrl,
  finalSupabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

// Helper function to check if Supabase connection is working
export async function checkSupabaseConnection() {
  try {
    console.log('Testing Supabase connection with URL:', finalSupabaseUrl);
    const { error } = await supabase.from("applications").select("count", { count: 'exact', head: true });
    if (error) throw error;
    console.log("✅ Supabase connection successful");
    return true;
  } catch (error) {
    console.error("❌ Supabase connection failed:", error);
    return false;
  }
}
