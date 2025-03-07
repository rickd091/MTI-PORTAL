import React, { Suspense, useState, useEffect, ComponentType, ReactElement } from 'react';
import { Route, Routes, Navigate, Link } from 'react-router-dom';
import { MTIErrorProvider } from '@/components/error/MTIErrorProvider';
import LoadingState from '@/components/common/LoadingState';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import SupabaseTest from './SupabaseTest';
import UserList from './components/UserList';
import TodoList from './components/TodoList';
import ApplicationsList from './components/ApplicationsList';
import AuthNav from './components/auth/AuthNav';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

// Lazy load components
const LoginPage = React.lazy(() => import('@/pages/LoginPage'));
const DashboardPage = React.lazy(() => import('@/pages/DashboardPage'));
const ApplicationsPage = React.lazy(() => import('@/pages/ApplicationsPage'));
const InstitutionsPage = React.lazy(() => import('@/pages/InstitutionsPage'));
const InspectionsPage = React.lazy(() => import('@/pages/InspectionsPage'));
const SettingsPage = React.lazy(() => import('@/pages/SettingsPage'));
const SimpleTest = React.lazy(() => import('@/SimpleTest'));
const ServerPage = React.lazy(() => import('@/pages/ServerPage'));
const DiagnosticPage = React.lazy(() => import('@/pages/DiagnosticPage'));
const AuthDemoPage = React.lazy(() => import('@/pages/AuthDemoPage'));
const AuthCallbackPage = React.lazy(() => import('@/pages/AuthCallbackPage'));
const DebugPage = React.lazy(() => import('@/DebugPage'));
const DirectTest = React.lazy(() => import('@/DirectTest'));

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps): ReactElement => (
  <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden mt-10">
    <div className="text-center">
      <h2 className="text-xl font-bold mb-4 text-red-600">Component Error</h2>
      <p className="mb-4">There was an error loading this component:</p>
      <pre className="bg-gray-100 p-3 rounded text-left text-sm overflow-auto mb-4">
        {error.message}
      </pre>
      <div className="flex justify-center space-x-4">
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
        <Link
          to="/supabase-diagnostic"
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Go to Diagnostics
        </Link>
      </div>
    </div>
  </div>
);

// Wrapper for lazy-loaded components with error boundary
interface LazyComponentProps {
  component: ComponentType;
  fallback?: ReactElement;
}

const LazyComponentWithErrorBoundary = ({ component: Component, fallback = <LoadingState /> }: LazyComponentProps): ReactElement => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={fallback}>
        <Component />
      </Suspense>
    </ErrorBoundary>
  );
};

export default function App() {
  const { loading } = useAuth();
  const [isReady, setIsReady] = useState(false);

  // Add a small delay to ensure all components are loaded
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Show loading state while auth is initializing
  if (loading || !isReady) {
    return <LoadingState />;
  }

  return (
    <MTIErrorProvider>
      {/* Use environment variable safely */}
      {import.meta.env?.VITE_TEMPO && <div id="tempo-routes" />}
      
      <Routes>
        <Route
          path="/login"
          element={
            <LazyComponentWithErrorBoundary component={LoginPage} />
          }
        />
        
        <Route
          path="/auth/demo"
          element={
            <LazyComponentWithErrorBoundary component={() => (
              <>
                <AuthNav />
                <AuthDemoPage />
              </>
            )} />
          }
        />

        <Route
          path="/auth/callback"
          element={
            <LazyComponentWithErrorBoundary component={AuthCallbackPage} />
          }
        />
        
        <Route
          path="/test"
          element={
            <LazyComponentWithErrorBoundary component={SimpleTest} />
          }
        />

        <Route
          path="/supabase-test"
          element={
            <>
              <AuthNav />
              <SupabaseTest />
            </>
          }
        />

        <Route
          path="/users"
          element={
            <>
              <AuthNav />
              <UserList />
            </>
          }
        />

        <Route
          path="/todos"
          element={
            <>
              <AuthNav />
              <TodoList />
            </>
          }
        />

        <Route
          path="/applications-list"
          element={
            <>
              <AuthNav />
              <ApplicationsList />
            </>
          }
        />

        <Route
          path="/server-example"
          element={
            <LazyComponentWithErrorBoundary component={ServerPage} />
          }
        />

        <Route
          path="/direct-test"
          element={
            <LazyComponentWithErrorBoundary component={DirectTest} />
          }
        />

        <Route
          path="/debug"
          element={
            <LazyComponentWithErrorBoundary component={DebugPage} />
          }
        />

        <Route
          path="/supabase-diagnostic"
          element={
            <LazyComponentWithErrorBoundary component={DiagnosticPage} />
          }
        />

        <Route element={<AppLayout />}>
          <Route
            index
            element={
              <LazyComponentWithErrorBoundary component={DashboardPage} />
            }
          />
          <Route
            path="applications/*"
            element={
              <LazyComponentWithErrorBoundary component={ApplicationsPage} />
            }
          />
          <Route
            path="institutions/*"
            element={
              <LazyComponentWithErrorBoundary component={InstitutionsPage} />
            }
          />
          <Route
            path="inspections/*"
            element={
              <LazyComponentWithErrorBoundary component={InspectionsPage} />
            }
          />
          <Route
            path="settings/*"
            element={
              <LazyComponentWithErrorBoundary component={SettingsPage} />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </MTIErrorProvider>
  );
}
