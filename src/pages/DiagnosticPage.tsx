import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase-client';

interface EnvironmentInfo {
  supabaseUrl: string;
  supabaseKeyConfigured: boolean;
  nodeEnv: string;
  isDevelopment: boolean;
  buildTime: string;
}

interface TableStatus {
  name: string;
  exists: boolean;
  error?: string;
}

const DiagnosticPage: React.FC = () => {
  const [envInfo, setEnvInfo] = useState<EnvironmentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tableStatuses, setTableStatuses] = useState<TableStatus[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'success' | 'failed'>('checking');
  const [connectionTime, setConnectionTime] = useState<number | null>(null);
  const [consoleErrors, setConsoleErrors] = useState<string[]>([]);

  useEffect(() => {
    // Capture console errors
    const originalConsoleError = console.error;
    const errorLogs: string[] = [];
    
    console.error = (...args) => {
      originalConsoleError(...args);
      const errorMessage = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      errorLogs.push(errorMessage);
      setConsoleErrors(prev => [...prev, errorMessage]);
    };

    // Get environment info
    setEnvInfo({
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'Not configured',
      supabaseKeyConfigured: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
      nodeEnv: import.meta.env.MODE || 'unknown',
      isDevelopment: import.meta.env.DEV || false,
      buildTime: new Date().toISOString(),
    });

    // Check Supabase connection
    checkSupabaseConnection();

    // Restore original console.error when component unmounts
    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  const checkSupabaseConnection = async () => {
    try {
      setLoading(true);
      setConnectionStatus('checking');
      
      const startTime = performance.now();
      
      // Test connection to Supabase
      const { error } = await supabase.from('applications').select('count', { count: 'exact', head: true });
      
      const endTime = performance.now();
      setConnectionTime(endTime - startTime);
      
      if (error) {
        setConnectionStatus('failed');
        setError(error.message);
        throw error;
      }
      
      setConnectionStatus('success');
      
      // Check tables
      const tables = ['applications', 'institutions', 'inspections', 'documents', 'profiles'];
      const statuses: TableStatus[] = [];
      
      for (const table of tables) {
        try {
          const { error } = await supabase.from(table).select('count', { count: 'exact', head: true });
          statuses.push({
            name: table,
            exists: !error,
            error: error?.message,
          });
        } catch (err) {
          statuses.push({
            name: table,
            exists: false,
            error: err instanceof Error ? err.message : String(err),
          });
        }
      }
      
      setTableStatuses(statuses);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">MTI Portal Diagnostic Page</h1>
      
      {/* Environment Information */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Environment Information</h2>
        {envInfo ? (
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>Supabase URL:</strong> {envInfo.supabaseUrl}</p>
                <p><strong>Supabase Key:</strong> {envInfo.supabaseKeyConfigured ? 'Configured' : 'Not configured'}</p>
              </div>
              <div>
                <p><strong>Node Environment:</strong> {envInfo.nodeEnv}</p>
                <p><strong>Development Mode:</strong> {envInfo.isDevelopment ? 'Yes' : 'No'}</p>
                <p><strong>Build Time:</strong> {envInfo.buildTime}</p>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading environment information...</p>
        )}
      </section>
      
      {/* Supabase Connection Status */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Supabase Connection</h2>
        <div className="bg-gray-50 p-4 rounded-md">
          {loading ? (
            <p>Testing connection to Supabase...</p>
          ) : connectionStatus === 'success' ? (
            <div>
              <p className="text-green-600 font-semibold">✅ Connection successful</p>
              {connectionTime && (
                <p className="text-sm text-gray-600">Response time: {connectionTime.toFixed(2)}ms</p>
              )}
            </div>
          ) : (
            <div>
              <p className="text-red-600 font-semibold">❌ Connection failed</p>
              {error && (
                <pre className="mt-2 p-2 bg-red-50 text-red-700 rounded overflow-auto text-sm">
                  {error}
                </pre>
              )}
              <button 
                onClick={checkSupabaseConnection}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Retry Connection
              </button>
            </div>
          )}
        </div>
      </section>
      
      {/* Table Status */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Database Tables</h2>
        <div className="bg-gray-50 p-4 rounded-md">
          {tableStatuses.length > 0 ? (
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Table Name</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Error</th>
                </tr>
              </thead>
              <tbody>
                {tableStatuses.map((table) => (
                  <tr key={table.name} className="border-b">
                    <td className="py-2">{table.name}</td>
                    <td className="py-2">
                      {table.exists ? (
                        <span className="text-green-600">✅ Available</span>
                      ) : (
                        <span className="text-red-600">❌ Not available</span>
                      )}
                    </td>
                    <td className="py-2 text-sm text-red-600">{table.error || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : loading ? (
            <p>Checking table status...</p>
          ) : (
            <p>No table information available</p>
          )}
        </div>
      </section>
      
      {/* Console Errors */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Console Errors</h2>
        <div className="bg-gray-50 p-4 rounded-md">
          {consoleErrors.length > 0 ? (
            <div>
              <p className="mb-2 text-red-600">{consoleErrors.length} errors detected</p>
              <div className="max-h-60 overflow-y-auto">
                {consoleErrors.map((error, index) => (
                  <pre key={index} className="mb-2 p-2 bg-red-50 text-red-700 rounded text-sm">
                    {error}
                  </pre>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-green-600">✅ No console errors detected</p>
          )}
        </div>
      </section>
      
      {/* Routing Information */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Routing Information</h2>
        <div className="bg-gray-50 p-4 rounded-md">
          <p><strong>Current Path:</strong> {window.location.pathname}</p>
          <p><strong>Query Parameters:</strong> {window.location.search || 'None'}</p>
          <p><strong>Hash:</strong> {window.location.hash || 'None'}</p>
        </div>
      </section>
      
      {/* Navigation Links */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Navigation</h2>
        <div className="flex flex-wrap gap-4">
          <a 
            href="/"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Home
          </a>
          <a 
            href="/direct-test"
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Direct Test
          </a>
          <a 
            href="/debug"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Debug Page
          </a>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Refresh Page
          </button>
        </div>
      </section>
    </div>
  );
};

export default DiagnosticPage;
