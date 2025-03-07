import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const DirectTest = () => {
  const [status, setStatus] = useState('Loading...');
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const runTest = async () => {
      try {
        // Hard-coded values from the .env.example file for testing purposes
        const supabaseUrl = 'https://zrnngescxhrjdzpzujnt.supabase.co';
        const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpybm5nZXNjeGhyamR6cHp1am50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwNDgxOTAsImV4cCI6MjA1MzYyNDE5MH0.6K1oQZXiFz0WSVau-vsbXN9_4ciTM2Bs1Zc6r4rFfQE';
        
        // Create a direct Supabase client
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        
        // Test the connection
        const { data, error } = await supabase.from('applications').select('count', { count: 'exact', head: true });
        
        if (error) {
          throw error;
        }
        
        setStatus('Connection successful!');
      } catch (err) {
        console.error('Test error:', err);
        setStatus('Connection failed');
        setError(err instanceof Error ? err.message : String(err));
      }
    };
    
    runTest();
  }, []);
  
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333' }}>Direct Supabase Connection Test</h1>
      
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: status.includes('successful') ? '#d1fae5' : '#fee2e2', borderRadius: '8px' }}>
        <h2 style={{ margin: '0 0 10px 0' }}>{status}</h2>
        {error && (
          <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '4px' }}>
            <p style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>Error details:</p>
            <pre style={{ margin: '0', overflow: 'auto' }}>{error}</pre>
          </div>
        )}
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <p><strong>Note:</strong> This test uses hard-coded credentials from the .env.example file.</p>
        <p>If this test succeeds but the application still doesn't work, the issue is likely with how environment variables are loaded in the application.</p>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => window.location.href = '/'}
          style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}
        >
          Go to Home
        </button>
        <button 
          onClick={() => window.location.reload()}
          style={{ padding: '10px 20px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Refresh Test
        </button>
      </div>
    </div>
  );
};

export default DirectTest;
