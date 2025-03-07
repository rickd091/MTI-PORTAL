import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { checkSupabaseConnection } from './lib/supabase-client';

// Import the dev tools and initialize them
import { TempoDevtools } from 'tempo-devtools';
TempoDevtools.init();

// Check Supabase connection on startup
checkSupabaseConnection().then(isConnected => {
  if (!isConnected && import.meta.env.DEV) {
    console.warn('⚠️ Supabase connection failed. Please check your environment variables and database setup.');
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
