import { supabase } from './lib/supabase-client';

/**
 * Test Supabase connectivity and log the results
 */
async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    // Log configuration details
    console.log('Supabase configuration:', {
      url: supabaseUrl ? 'Configured' : 'Missing',
      anonKey: supabaseKey ? 'Configured' : 'Missing',
      mode: import.meta.env.MODE,
    });
    
    if (!supabaseUrl || !supabaseKey) {
      console.warn('⚠️ Missing Supabase credentials in environment variables');
      console.log('Using fallback configuration if available');
    }
    
    // Test basic connectivity by querying system schema
    const { error } = await supabase
      .from('applications')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection successful!');
    
    return true;
  } catch (e) {
    console.error('❌ Supabase connection error:', e);
    return false;
  }
}

// Export the function for use in other files
export { testSupabaseConnection };

// Run the test if this file is executed directly
if (import.meta.url.endsWith('test-supabase.ts')) {
  testSupabaseConnection();
}
