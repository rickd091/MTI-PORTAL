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

// Add detailed logging for debugging
const DEBUG = true;

function logDebug(message: string, data?: any): void {
  if (DEBUG) {
    console.log(`[MTI-DEBUG] ${message}`, data || '');
  }
}

logDebug('Application initialization started', { timestamp: new Date().toISOString() });
logDebug('Environment variables', {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? 'Configured' : 'Missing',
  supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Configured' : 'Missing',
  mode: import.meta.env.MODE,
  dev: import.meta.env.DEV,
});

// Create a simple error boundary component
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
    logDebug('ErrorBoundary initialized', {});
  }

  static getDerivedStateFromError(error: Error) {
    logDebug('ErrorBoundary caught an error', { error: error.message, stack: error.stack });
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Application error:', error, errorInfo);
    logDebug('ErrorBoundary componentDidCatch', { 
      error: error.message, 
      componentStack: errorInfo.componentStack 
    });
  }

  render() {
    if (this.state.hasError) {
      logDebug('ErrorBoundary rendering error UI', {});
      return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ color: '#e53e3e' }}>Something went wrong</h1>
          <p>The application encountered an error. Please try the following:</p>
          <ul style={{ marginBottom: '20px' }}>
            <li>Check your browser console for specific error messages</li>
            <li>Verify your Supabase connection settings</li>
            <li>Refresh the page to try again</li>
          </ul>
          <div style={{ padding: '10px', backgroundColor: '#f7fafc', borderRadius: '4px', marginBottom: '20px' }}>
            <p style={{ fontWeight: 'bold' }}>Error details:</p>
            <pre style={{ overflow: 'auto', padding: '10px', backgroundColor: '#edf2f7', borderRadius: '4px' }}>
              {this.state.error?.message || 'Unknown error'}
            </pre>
          </div>
          <div>
            <a 
              href="/supabase-diagnostic"
              style={{ 
                display: 'inline-block', 
                padding: '10px 20px', 
                backgroundColor: '#4299e1', 
                color: 'white', 
                textDecoration: 'none', 
                borderRadius: '4px',
                marginRight: '10px'
              }}
            >
              Go to Diagnostic Page
            </a>
            <a 
              href="/direct-test"
              style={{ 
                display: 'inline-block', 
                padding: '10px 20px', 
                backgroundColor: '#805ad5', 
                color: 'white', 
                textDecoration: 'none', 
                borderRadius: '4px',
                marginRight: '10px'
              }}
            >
              Try Direct Test
            </a>
            <button 
              onClick={() => window.location.reload()} 
              style={{ 
                padding: '10px 20px', 
                backgroundColor: '#48bb78', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer' 
              }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Check Supabase connection on startup
logDebug('Checking Supabase connection', {});
checkSupabaseConnection().then(isConnected => {
  logDebug('Supabase connection check result', { isConnected });
  if (!isConnected && import.meta.env.DEV) {
    console.warn('⚠️ Supabase connection failed. Please check your environment variables and database setup.');
  }
});

logDebug('Mounting React application', {});
try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  logDebug('Root element found, creating React root', {});
  const root = ReactDOM.createRoot(rootElement);
  
  logDebug('Rendering React application', {});
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>
  );
  logDebug('React application rendered successfully', {});
} catch (error) {
  console.error('Fatal error during application initialization:', error);
  logDebug('Fatal error during application initialization', { 
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined
  });
}
