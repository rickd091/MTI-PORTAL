import React, { Suspense } from 'react';
import { Route, Routes, useRoutes } from 'react-router-dom';
import routes from 'tempo-routes';
import { AuthProvider } from '@/contexts/AuthContext';
import { MTIErrorProvider } from '@/components/error/MTIErrorProvider';
import LoadingState from '@/components/common/LoadingState';
import AppLayout from '@/components/layout/AppLayout';

// Lazy load components
const LoginPage = React.lazy(() => import('@/pages/LoginPage'));
const DashboardPage = React.lazy(() => import('@/pages/DashboardPage'));
const ApplicationsPage = React.lazy(() => import('@/pages/ApplicationsPage'));
const InstitutionsPage = React.lazy(() => import('@/pages/InstitutionsPage'));
const InspectionsPage = React.lazy(() => import('@/pages/InspectionsPage'));
const SettingsPage = React.lazy(() => import('@/pages/SettingsPage'));

function App() {
  return (
    <AuthProvider>
      <MTIErrorProvider>
        {/* Tempo routes */}
        {import.meta.env.VITE_TEMPO && useRoutes(routes)}
        
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
