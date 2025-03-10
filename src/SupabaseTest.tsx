import { useEffect, useState } from 'react';
import { supabase } from './utils/supabase/client';

const SupabaseTest = () => {
  const [connectionStatus, setConnectionStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [supabaseUrl, setSupabaseUrl] = useState<string>('');
  const [supabaseKey, setSupabaseKey] = useState<string>('');
  const [tablesFound, setTablesFound] = useState<string[]>([]);

  useEffect(() => {
    async function testConnection() {
      try {
        // Get the Supabase credentials from environment variables
        const url = import.meta.env.VITE_SUPABASE_URL || 'Not configured';
        const key = import.meta.env.VITE_SUPABASE_ANON_KEY ? 
          import.meta.env.VITE_SUPABASE_ANON_KEY.substring(0, 8) + '...' : 'Not configured';
        
        setSupabaseUrl(url);
        setSupabaseKey(key);

        console.log('Testing Supabase connection with URL:', url);
        
        if (!url || url === 'Not configured' || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
          throw new Error('Supabase credentials are not properly configured in environment variables');
        }

        // Simple health check query - using a simpler approach that doesn't require specific tables
        const { error: connectionError } = await supabase.from('_tables').select('*').limit(1);
        
        if (connectionError) {
          console.error('Supabase connection error:', connectionError);
          setErrorMessage(connectionError.message);
          setConnectionStatus('error');
          return;
        }
        
        // Check for existing tables
        try {
          const { data: tableData } = await supabase.rpc('get_tables');
          if (tableData && Array.isArray(tableData)) {
            const tableNames = tableData.map((t: any) => t.table_name || t.name);
            setTablesFound(tableNames);
            console.log('Tables found:', tableNames);
          }
        } catch (tableErr) {
          console.log('Could not fetch table list:', tableErr);
        }
        
        setConnectionStatus('success');
        console.log('Successfully connected to Supabase');
      } catch (err) {
        console.error('Unexpected error:', err);
        setErrorMessage(err instanceof Error ? err.message : String(err));
        setConnectionStatus('error');
      }
    }

    testConnection();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: '#3b82f6', marginBottom: '20px' }}>Supabase Connection Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <div><strong>Supabase URL:</strong> {supabaseUrl}</div>
        <div><strong>Supabase Key:</strong> {supabaseKey}</div>
        <div><strong>Environment:</strong> {import.meta.env.MODE}</div>
      </div>
      
      {connectionStatus === 'loading' && (
        <div style={{ display: 'flex', alignItems: 'center', color: '#6b7280' }}>
          <div style={{ 
            width: '20px', 
            height: '20px', 
            borderRadius: '50%', 
            border: '3px solid #e5e7eb', 
            borderTopColor: '#3b82f6',
            animation: 'spin 1s linear infinite',
            marginRight: '10px'
          }}></div>
          Testing connection to Supabase...
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
      
      {connectionStatus === 'success' && (
        <div style={{ backgroundColor: '#dcfce7', padding: '15px', borderRadius: '5px', color: '#166534' }}>
          &#x2705; Successfully connected to Supabase!
          
          {tablesFound.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <p><strong>Tables found in database:</strong></p>
              <ul style={{ marginTop: '5px', paddingLeft: '20px' }}>
                {tablesFound.map(table => (
                  <li key={table}>{table}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      {connectionStatus === 'error' && (
        <div style={{ backgroundColor: '#fee2e2', padding: '15px', borderRadius: '5px', color: '#b91c1c' }}>
          &#x274c; Failed to connect to Supabase
          {errorMessage && (
            <div style={{ marginTop: '10px', fontSize: '14px' }}>
              Error: {errorMessage}
            </div>
          )}
          
          <div style={{ marginTop: '20px', backgroundColor: '#f3f4f6', padding: '15px', borderRadius: '5px' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#374151' }}>Troubleshooting Steps:</h3>
            <ol style={{ margin: '0', paddingLeft: '20px', color: '#4b5563' }}>
              <li>Check that your .env.local file has the correct Supabase URL and anon key with the <code>VITE_</code> prefix</li>
              <li>Verify that your Supabase project is running and accessible</li>
              <li>Restart your development server after updating environment variables</li>
              <li>Ensure you have proper network connectivity</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupabaseTest;
