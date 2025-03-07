import { useEffect, useState } from 'react';
import { testSupabaseConnection } from '../test-supabase';

export function SupabaseConnectionTest() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkConnection() {
      try {
        setIsLoading(true);
        const connected = await testSupabaseConnection();
        setIsConnected(connected);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkConnection();
  }, []);

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
              <p className="font-bold">Troubleshooting steps:</p>
              <ol className="list-decimal pl-5 mt-2">
                <li>Check that your .env.local file has the correct Supabase URL and anon key</li>
                <li>Verify that your Supabase project is running and accessible</li>
                <li>Check your network connection</li>
                <li>Ensure that the 'applications' table exists in your Supabase database</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
