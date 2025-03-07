import { supabase } from './lib/supabase-client';

/**
 * Test Supabase connectivity and log the results
 */
async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    // Test basic connectivity by querying system schema
    const { data, error } = await supabase
      .from('applications')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection successful!');
    console.log('Connection details:', {
      url: import.meta.env.VITE_SUPABASE_URL ? 'Configured' : 'Missing',
      anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Configured' : 'Missing',
    });
    
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
