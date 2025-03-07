import React, { Suspense, useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { MTIErrorProvider } from '@/components/error/MTIErrorProvider';
import LoadingState from '@/components/common/LoadingState';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';

// Lazy load components
const LoginPage = React.lazy(() => import('@/pages/LoginPage'));
const DashboardPage = React.lazy(() => import('@/pages/DashboardPage.jsx'));
const ApplicationsPage = React.lazy(() => import('@/pages/ApplicationsPage.jsx'));
const InstitutionsPage = React.lazy(() => import('@/pages/InstitutionsPage'));
const InspectionsPage = React.lazy(() => import('@/pages/InspectionsPage.jsx'));
const SettingsPage = React.lazy(() => import('@/pages/SettingsPage.jsx'));

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
            <Suspense fallback={<LoadingState />}>
              <LoginPage />
            </Suspense>
          }
        />

        <Route element={<AppLayout />}>
          <Route
            index
            element={
              <Suspense fallback={<LoadingState />}>
                <DashboardPage />
              </Suspense>
            }
          />
          <Route
            path="applications/*"
            element={
              <Suspense fallback={<LoadingState />}>
                <ApplicationsPage />
              </Suspense>
            }
          />
          <Route
            path="institutions/*"
            element={
              <Suspense fallback={<LoadingState />}>
                <InstitutionsPage />
              </Suspense>
            }
          />
          <Route
            path="inspections/*"
            element={
              <Suspense fallback={<LoadingState />}>
                <InspectionsPage />
              </Suspense>
            }
          />
          <Route
            path="settings/*"
            element={
              <Suspense fallback={<LoadingState />}>
                <SettingsPage />
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </MTIErrorProvider>
  );
}
