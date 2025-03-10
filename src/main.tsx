import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { supabase } from './lib/supabase-client';

// Log environment variables for debugging (values are masked for security)
console.log('Environment variables loaded:', {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? 'Configured' : 'Missing',
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Configured' : 'Missing',
});

// Check Supabase connection on application start
const checkSupabaseConnection = async () => {
  try {
    // Test the connection with a simple query
    const { error } = await supabase.from('applications').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Supabase connection error:', error.message);
      return false;
    }
    
    console.log('Supabase connection successful');
    return true;
  } catch (err) {
    console.error('Supabase connection test failed:', err);
    return false;
  }
};

// Initialize the application
const initializeApp = async () => {
  // Attempt to check the Supabase connection
  const isConnected = await checkSupabaseConnection();
  
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('Root element not found');
    return;
  }
  
  const root = ReactDOM.createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
  
  console.log('Application initialized successfully');
};

// Start the application
initializeApp();
