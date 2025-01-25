//src/App.tsx
import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import LoadingState from './components/common/LoadingState';
import RoleProtectedRoute from './components/auth/RoleProtectedRoute';
import { MTIErrorProvider } from './components/error/MTIErrorProvider';

// Auth & Layout Components
import Login from './components/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';

// Lazy load page components
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const ApplicationsPage = React.lazy(() => import('./pages/ApplicationsPage'));
const RegistrationPage = React.lazy(() => import('./pages/RegistrationPage'));
const ApplicationRenewal = React.lazy(() => import('./components/applications/ApplicationRenewal'));
const ApplicationDetails = React.lazy(() => import('./components/applications/ApplicationDetails'));
const CertificatesPage = React.lazy(() => import('./pages/CertificatesPage'));
const DocumentsPage = React.lazy(() => import('./pages/DocumentsPage'));
const InstructorsPage = React.lazy(() => import('./pages/InstructorsPage'));
const MonitoringPage = React.lazy(() => import('./pages/MonitoringPage'));
const PaymentsPage = React.lazy(() => import('./pages/PaymentsPage'));

function App() {
  return (
    <MTIErrorProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route 
            index 
            element={
              <Suspense fallback={<LoadingState />}>
                <Dashboard />
              </Suspense>
            } 
          />
          
          {/* MTI Applications Routes */}
          <Route path="applications">
            <Route 
              index 
              element={
                <RoleProtectedRoute allowedRoles={['admin', 'institution']}>
                  <Suspense fallback={<LoadingState />}>
                    <ApplicationsPage />
                  </Suspense>
                </RoleProtectedRoute>
              } 
            />
            <Route 
              path="register" 
              element={
                <RoleProtectedRoute allowedRoles={['institution']}>
                  <Suspense fallback={<LoadingState />}>
                    <RegistrationPage />
                  </Suspense>
                </RoleProtectedRoute>
              } 
            />
            <Route 
              path="renew/:id" 
              element={
                <RoleProtectedRoute allowedRoles={['institution']}>
                  <Suspense fallback={<LoadingState />}>
                    <ApplicationRenewal />
                  </Suspense>
                </RoleProtectedRoute>
              } 
            />
            <Route 
              path=":id" 
              element={
                <RoleProtectedRoute allowedRoles={['admin', 'reviewer', 'institution']}>
                  <Suspense fallback={<LoadingState />}>
                    <ApplicationDetails />
                  </Suspense>
                </RoleProtectedRoute>
              } 
            />
          </Route>

          {/* Other Routes */}
          <Route 
            path="instructors" 
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'institution']}>
                <Suspense fallback={<LoadingState />}>
                  <InstructorsPage />
                </Suspense>
              </RoleProtectedRoute>
            } 
          />
          <Route 
            path="certificates" 
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'institution']}>
                <Suspense fallback={<LoadingState />}>
                  <CertificatesPage />
                </Suspense>
              </RoleProtectedRoute>
            } 
          />
          <Route 
            path="monitoring" 
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'reviewer']}>
                <Suspense fallback={<LoadingState />}>
                  <MonitoringPage />
                </Suspense>
              </RoleProtectedRoute>
            } 
          />
          <Route 
            path="documents" 
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'institution', 'reviewer']}>
                <Suspense fallback={<LoadingState />}>
                  <DocumentsPage />
                </Suspense>
              </RoleProtectedRoute>
            } 
          />
          <Route 
            path="payments" 
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'institution']}>
                <Suspense fallback={<LoadingState />}>
                  <PaymentsPage />
                </Suspense>
              </RoleProtectedRoute>
            } 
          />
        </Route>
      </Routes>
    </MTIErrorProvider>
  );
}

export default App;