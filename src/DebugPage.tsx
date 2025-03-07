import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase-client';

const DebugPage = () => {
  const [envVars, setEnvVars] = useState<Record<string, string>>({});
  const [supabaseStatus, setSupabaseStatus] = useState<string>('Checking...');
  const [routingStatus, setRoutingStatus] = useState<string>('Checking...');
  const [componentStatus, setComponentStatus] = useState<string>('Checking...');

  useEffect(() => {
    // Check environment variables
    const vars = {
      'VITE_SUPABASE_URL': import.meta.env.VITE_SUPABASE_URL || 'Not set',
      'VITE_SUPABASE_ANON_KEY': import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set (hidden)' : 'Not set',
      'MODE': import.meta.env.MODE || 'Not set',
      'DEV': import.meta.env.DEV ? 'true' : 'false',
      'PROD': import.meta.env.PROD ? 'true' : 'false',
    };
    setEnvVars(vars);

    // Check Supabase connection
    const checkSupabase = async () => {
      try {
        const { error } = await supabase.from('applications').select('count', { count: 'exact', head: true });
        if (error) {
          setSupabaseStatus(`Error: ${error.message}`);
        } else {
          setSupabaseStatus('Connected successfully');
        }
      } catch (err) {
        setSupabaseStatus(`Exception: ${err instanceof Error ? err.message : String(err)}`);
      }
    };
    checkSupabase();

    // Check routing
    try {
      const routes = window.location.pathname;
      setRoutingStatus(`Current route: ${routes}`);
    } catch (err) {
      setRoutingStatus(`Error: ${err instanceof Error ? err.message : String(err)}`);
    }

    // Check component loading
    try {
      setComponentStatus('Debug component loaded successfully');
    } catch (err) {
      setComponentStatus(`Error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mt-10">
      <h1 className="text-2xl font-bold mb-4">MTI Portal Debug Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Environment Variables</h2>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
            {JSON.stringify(envVars, null, 2)}
          </pre>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Supabase Status</h2>
          <div className={`p-3 rounded ${supabaseStatus.includes('Error') || supabaseStatus.includes('Exception') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
            {supabaseStatus}
          </div>
          
          <h2 className="text-xl font-semibold mb-3 mt-4">Routing Status</h2>
          <div className="bg-blue-100 text-blue-800 p-3 rounded">
            {routingStatus}
          </div>
          
          <h2 className="text-xl font-semibold mb-3 mt-4">Component Status</h2>
          <div className="bg-green-100 text-green-800 p-3 rounded">
            {componentStatus}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Browser Information</h2>
        <pre className="bg-yellow-100 p-3 rounded text-sm overflow-auto">
          {`User Agent: ${navigator.userAgent}\nLanguage: ${navigator.language}`}
        </pre>
      </div>

      <div className="mt-6 flex space-x-4">
        <button 
          onClick={() => window.location.href = '/'}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go to Home
        </button>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
};

export default DebugPage;
