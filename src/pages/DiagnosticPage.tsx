import React from 'react';
import { Link } from 'react-router-dom';

const DiagnosticPage: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Supabase Integration Diagnostic</h1>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <p className="mb-2">This page helps diagnose issues with the Supabase integration.</p>
        <p>Click the links below to test different components:</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link 
          to="/supabase-test" 
          className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold mb-2">Supabase Connection Test</h2>
          <p className="text-gray-600">Tests basic connectivity to your Supabase instance</p>
        </Link>
        
        <Link 
          to="/applications-list" 
          className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold mb-2">Applications List</h2>
          <p className="text-gray-600">Displays applications from your Supabase database</p>
        </Link>
        
        <Link 
          to="/todos" 
          className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold mb-2">Todo List Component</h2>
          <p className="text-gray-600">Tests CRUD operations with the todos table</p>
        </Link>
        
        <Link 
          to="/users" 
          className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold mb-2">User List Component</h2>
          <p className="text-gray-600">Tests fetching data from the users table</p>
        </Link>
        
        <Link 
          to="/server-example" 
          className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold mb-2">Server Example</h2>
          <p className="text-gray-600">Tests data fetching with simulated server components</p>
        </Link>
      </div>
      
      <div className="bg-yellow-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">Troubleshooting Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Make sure your <code>.env.local</code> file has the correct Supabase URL and anon key with the <code>VITE_</code> prefix</li>
          <li>Check the browser console (F12) for any JavaScript errors</li>
          <li>Verify that the required tables exist in your Supabase database</li>
          <li>Try restarting your development server after making changes to environment variables</li>
        </ul>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Environment Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div><strong>Vite Mode:</strong> {import.meta.env.MODE}</div>
          <div><strong>Base URL:</strong> {import.meta.env.BASE_URL}</div>
          <div><strong>Supabase URL Configured:</strong> {import.meta.env.VITE_SUPABASE_URL ? 'Yes' : 'No'}</div>
          <div><strong>Supabase Key Configured:</strong> {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Yes' : 'No'}</div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticPage;
