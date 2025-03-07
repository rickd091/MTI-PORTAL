import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase/client';

interface Application {
  id: string;
  name?: string;
  status?: string;
  created_at?: string;
  [key: string]: any; // Allow for other fields
}

const ApplicationsList: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [availableTables, setAvailableTables] = useState<string[]>([]);

  // Check available tables
  useEffect(() => {
    const checkTables = async () => {
      try {
        const { data, error } = await supabase.rpc('get_tables');
        if (error) {
          console.error('Error fetching tables:', error);
          return;
        }
        
        if (data && Array.isArray(data)) {
          const tableNames = data.map((t: any) => t.table_name || t.name);
          setAvailableTables(tableNames);
          console.log('Available tables:', tableNames);
        }
      } catch (err) {
        console.error('Error checking tables:', err);
      }
    };
    
    checkTables();
  }, []);

  // Fetch applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        
        // Try to determine the correct table name
        let tableName = 'applications';
        if (availableTables.includes('applications')) {
          tableName = 'applications';
        } else if (availableTables.includes('application')) {
          tableName = 'application';
        } else {
          // Look for any table that might contain application data
          const appTable = availableTables.find(t => 
            t.toLowerCase().includes('app') || 
            t.toLowerCase().includes('application')
          );
          
          if (appTable) {
            tableName = appTable;
          }
        }
        
        console.log(`Attempting to fetch data from '${tableName}' table`);
        const { data, error } = await supabase.from(tableName).select('*').limit(10);
        
        if (error) {
          console.error('Error fetching applications:', error);
          setError(error.message);
        } else {
          console.log('Applications data:', data);
          setApplications(data || []);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    if (availableTables.length > 0) {
      fetchApplications();
    }
  }, [availableTables]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Applications from Supabase</h1>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      {/* Available tables */}
      {availableTables.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <p className="font-semibold">Available tables in database:</p>
          <ul className="list-disc pl-5 mt-2">
            {availableTables.map(table => (
              <li key={table}>{table}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading applications...</span>
        </div>
      )}
      
      {/* Empty state */}
      {!loading && !error && applications.length === 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
          <p>No applications found.</p>
        </div>
      )}
      
      {/* Applications list */}
      {applications.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {Object.keys(applications[0]).map(key => (
                  <th 
                    key={key} 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((app) => (
                <tr key={app.id}>
                  {Object.keys(applications[0]).map(key => (
                    <td key={`${app.id}-${key}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {typeof app[key] === 'object' ? JSON.stringify(app[key]) : String(app[key] || '-')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ApplicationsList;
