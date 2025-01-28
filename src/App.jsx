//src/App.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Auth & Layout Components
import Login from './components/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';

// Applications Components
import ApplicationRenewal from './components/applications/ApplicationRenewal';
import ApplicationDetails from './components/applications/ApplicationDetails';

// Pages
import Dashboard from './components/Dashboard';
import ApplicationsPage from './pages/ApplicationsPage';
import RegistrationPage from './pages/RegistrationPage';
import CertificatesPage from './pages/CertificatesPage';
import DocumentsPage from './pages/DocumentsPage';
import InstructorsPage from './pages/InstructorsPage';
import MonitoringPage from './pages/MonitoringPage';
import PaymentsPage from './pages/PaymentsPage';

function App() {
  return (
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
        <Route index element={<Dashboard />} />
        
        {/* MTI Applications Routes */}
        <Route path="applications">
          <Route index element={<ApplicationsPage />} />
          <Route path="register" element={<RegistrationPage />} />
          <Route path="renew/:id" element={<ApplicationRenewal />} />
          <Route path=":id" element={<ApplicationDetails />} />
        </Route>

        {/* Other Routes */}
        <Route path="instructors" element={<InstructorsPage />} />
        <Route path="certificates" element={<CertificatesPage />} />
        <Route path="monitoring" element={<MonitoringPage />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="payments" element={<PaymentsPage />} />
      </Route>
    </Routes>
  );
}

export default App;