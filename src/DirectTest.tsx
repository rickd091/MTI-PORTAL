import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const DirectTest = () => {
  const [status, setStatus] = useState('Loading...');
  const [error, setError] = useState<string | null>(null);
  const renderTest = 'If you can see this text, basic component rendering is working!';
  const [availableTables, setAvailableTables] = useState<string[]>([]);
  const [tableData, setTableData] = useState<Record<string, any>[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');

  useEffect(() => {
    // First, verify the component is rendering at all
    console.log('DirectTest component mounted');

    const runTest = async () => {
      try {
        console.log('Starting Supabase connection test...');
        // Try to use environment variables first, fall back to hardcoded values
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zrnngescxhrjdzpzujnt.supabase.co';
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpybm5nZXNjeGhyamR6cHp1am50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwNDgxOTAsImV4cCI6MjA1MzYyNDE5MH0.6K1oQZXiFz0WSVau-vsbXN9_4ciTM2Bs1Zc6r4rFfQE';

        console.log('Using URL:', supabaseUrl);
        // Create a direct Supabase client
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        // First, let's check what tables are available
        console.log('Fetching available tables...');
        let tables: string[] = [];

        try {
          // Try querying pg_tables first
          const { data: tableData, error: tablesError } = await supabase
            .from('pg_catalog.pg_tables')
            .select('tablename')
            .eq('schemaname', 'public');

          if (tablesError) {
            throw tablesError;
          }

          tables = tableData?.map(row => row.tablename) || [];
        } catch (tablesError) {
          console.log('Error fetching tables, will try alternative approach:', tablesError);
          // If we can't query pg_tables directly, try our expected tables
          const expectedTables = ['profiles', 'institutions', 'applications', 'inspections', 'documents'];
          const existingTables = [];

          for (const table of expectedTables) {
            try {
              const { error: tableCheckError } = await supabase
                .from(table)
                .select('count', { count: 'exact', head: true });

              if (!tableCheckError) {
                existingTables.push(table);
              } else {
                console.log(`Table check error for ${table}:`, tableCheckError.message);
              }
            } catch (e) {
              console.log(`Error checking table ${table}:`, e);
            }
          }

          tables = existingTables;
        }

        setAvailableTables(tables);

        if (tables.length > 0) {
          setStatus('Connection successful! Found tables: ' + tables.join(', '));
          // Set the first table as selected by default
          if (tables.length > 0) {
            setSelectedTable(tables[0]);
            await fetchTableData(supabase, tables[0]);
          }
        } else {
          throw new Error('No tables found in the database. Please create tables in your Supabase instance.');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error('Test error:', errorMessage);
        setStatus('Connection failed or no tables found');
        setError(errorMessage);
      }
    };

    // Run the test after a short delay to ensure component renders first
    setTimeout(() => {
      runTest();
    }, 1000);
  }, []);

  const fetchTableData = async (supabaseClient: any, tableName: string) => {
    try {
      const { data, error } = await supabaseClient
        .from(tableName)
        .select('*')
        .limit(5);

      if (error) throw error;
      setTableData(data || []);
      setSelectedTable(tableName);
    } catch (err) {
      console.error(`Error fetching data from ${tableName}:`, err);
      setTableData([]);
    }
  };

  const handleTableClick = async (tableName: string) => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zrnngescxhrjdzpzujnt.supabase.co';
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpybm5nZXNjeGhyamR6cHp1am50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwNDgxOTAsImV4cCI6MjA1MzYyNDE5MH0.6K1oQZXiFz0WSVau-vsbXN9_4ciTM2Bs1Zc6r4rFfQE';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    await fetchTableData(supabase, tableName);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
      <h1 style={{ color: '#333', borderBottom: '2px solid #2563eb', paddingBottom: '10px' }}>Direct Supabase Connection Test</h1>

      {/* Basic render test */}
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e0f2fe', borderRadius: '8px', border: '1px solid #bae6fd' }}>
        <h2 style={{ margin: '0 0 10px 0', color: '#0369a1' }}>Render Test</h2>
        <p>{renderTest}</p>
      </div>

      {/* Connection status */}
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: status.includes('successful') ? '#d1fae5' : status === 'Loading...' ? '#f3f4f6' : '#fee2e2', borderRadius: '8px', border: '1px solid #ccc' }}>
        <h2 style={{ margin: '0 0 10px 0', color: status.includes('successful') ? '#065f46' : status === 'Loading...' ? '#374151' : '#b91c1c' }}>{status}</h2>
        {error && (
          <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '4px', marginTop: '10px', border: '1px solid #fca5a5' }}>
            <p style={{ fontWeight: 'bold', margin: '0 0 5px 0', color: '#b91c1c' }}>Error details:</p>
            <pre style={{ margin: '0', overflow: 'auto', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '4px', fontSize: '0.9rem' }}>{error}</pre>
          </div>
        )}
      </div>

      {/* Table list */}
      {availableTables.length > 0 && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>Available Tables</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
            {availableTables.map(table => (
              <button
                key={table}
                onClick={() => handleTableClick(table)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: selectedTable === table ? '#2563eb' : '#e5e7eb',
                  color: selectedTable === table ? 'white' : '#333',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {table}
              </button>
            ))}
          </div>

          {/* Table data preview */}
          {selectedTable && (
            <div>
              <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Preview of {selectedTable} (up to 5 rows)</h3>
              {tableData.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                      <tr>
                        {Object.keys(tableData[0]).map(key => (
                          <th key={key} style={{ textAlign: 'left', padding: '8px', borderBottom: '2px solid #e5e7eb' }}>{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((row, i) => (
                        <tr key={i}>
                          {Object.values(row).map((value, j) => (
                            <td key={j} style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>
                              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No data found in this table.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DirectTest;
