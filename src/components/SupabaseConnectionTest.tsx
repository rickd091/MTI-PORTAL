import { useEffect, useState } from 'react';
import { testSupabaseConnection } from '../test-supabase';
import { supabase } from '../lib/supabase-client';

export function SupabaseConnectionTest() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [envInfo, setEnvInfo] = useState<{url: string, keyConfigured: boolean}>({ 
    url: '', 
    keyConfigured: false 
  });

  useEffect(() => {
    async function checkConnection() {
      try {
        setIsLoading(true);
        
        // Get environment info first
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
        const hasAnonKey = Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY);
        
        setEnvInfo({
          url: supabaseUrl || 'Not configured',
          keyConfigured: hasAnonKey
        });
        
        // Then test the connection
        const connected = await testSupabaseConnection();
        setIsConnected(connected);
      } catch (err) {
        console.error('Connection test error:', err);
        setError(err instanceof Error ? err.message : String(err));
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkConnection();
  }, []);

  // Test a simple query to verify database access
  const [tableStatus, setTableStatus] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    if (isConnected) {
      const testTables = async () => {
        const tables = ['applications', 'users', 'todos', 'inspections', 'documents'];
        const results: Record<string, boolean> = {};
        
        for (const table of tables) {
          try {
            const { error } = await supabase.from(table).select('count', { count: 'exact', head: true });
            results[table] = !error;
          } catch {
            results[table] = false;
          }
        }
        
        setTableStatus(results);
      };
      
      testTables();
    }
  }, [isConnected]);

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden mt-10">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-4">Supabase Connection Test</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2">Testing connection...</span>
          </div>
        ) : isConnected ? (
          <div className="text-green-600 font-semibold">
            ✅ Connected to Supabase successfully!
            <p className="text-sm text-gray-600 mt-2">
              Your application is properly connected to the Supabase backend.
            </p>
            
            <div className="mt-4 text-left bg-gray-50 p-3 rounded">
              <p className="font-bold text-gray-700">Environment Configuration:</p>
              <ul className="mt-2 text-sm text-gray-600">
                <li><strong>Supabase URL:</strong> {envInfo.url}</li>
                <li><strong>Anon Key:</strong> {envInfo.keyConfigured ? 'Configured' : 'Missing'}</li>
              </ul>
              
              <p className="font-bold text-gray-700 mt-3">Table Access:</p>
              <ul className="mt-2 text-sm text-gray-600">
                {Object.entries(tableStatus).map(([table, accessible]) => (
                  <li key={table}>
                    <strong>{table}:</strong> {accessible ? 
                      <span className="text-green-600">Accessible</span> : 
                      <span className="text-red-600">Not accessible</span>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-red-600 font-semibold">
            ❌ Failed to connect to Supabase
            {error && (
              <p className="text-sm text-gray-600 mt-2">
                Error: {error}
              </p>
            )}
            <div className="mt-4 text-sm text-left bg-gray-100 p-3 rounded">
              <p className="font-bold">Environment Configuration:</p>
              <ul className="mt-2 text-sm text-gray-600">
                <li><strong>Supabase URL:</strong> {envInfo.url}</li>
                <li><strong>Anon Key:</strong> {envInfo.keyConfigured ? 'Configured' : 'Missing'}</li>
              </ul>
              
              <p className="font-bold mt-3">Troubleshooting steps:</p>
              <ol className="list-decimal pl-5 mt-2">
                <li>Check that your .env.local file has the correct Supabase URL and anon key with the VITE_ prefix</li>
                <li>Verify that your Supabase project is running and accessible</li>
                <li>Check your network connection</li>
                <li>Ensure that the required tables exist in your Supabase database</li>
                <li>Try restarting the development server after making changes to environment variables</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
