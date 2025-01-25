// src/components/Layout.js
import { Outlet } from 'react-router-dom';

import Navigation from './Navigation';
import { useAuth } from '../hooks/useAuth';

const Layout = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;