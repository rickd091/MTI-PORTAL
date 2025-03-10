import * as React from 'react';
import { SupabaseConnectionTest } from './components/SupabaseConnectionTest';

const SimpleTest: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: 'blue', marginBottom: '10px' }}>Simple Test Page</h1>
      <p>This is a minimal test page with inline styles.</p>
      <button 
        style={{ 
          backgroundColor: 'green', 
          color: 'white', 
          padding: '10px 15px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Click Me
      </button>
      
      {/* Supabase Connection Test */}
      <div style={{ marginTop: '30px' }}>
        <SupabaseConnectionTest />
      </div>
    </div>
  );
};

export default SimpleTest;
