// src/components/Navigation.js
import { 
  LayoutDashboard,
  FileText,
  Users,
  Award,
  Clipboard,
  FileCheck,
  CreditCard,
  Settings,
  AlertCircle
} from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { 
      path: '/', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      role: ['admin', 'reviewer', 'institution'] 
    },
    { 
      path: '/applications', 
      label: 'MTI Applications', 
      icon: FileText,
      role: ['admin', 'institution'] 
    },
    { 
      path: '/instructors', 
      label: 'Instructors', 
      icon: Users,
      role: ['admin', 'institution'] 
    },
    { 
      path: '/certificates', 
      label: 'Certificates', 
      icon: Award,
      role: ['admin', 'institution'] 
    },
    { 
      path: '/monitoring', 
      label: 'Monitoring', 
      icon: AlertCircle,
      role: ['admin', 'reviewer'] 
    },
    { 
      path: '/documents', 
      label: 'Documents', 
      icon: FileCheck,
      role: ['admin', 'institution', 'reviewer'] 
    },
    { 
      path: '/payments', 
      label: 'Payments', 
      icon: CreditCard,
      role: ['admin', 'institution'] 
    },
    { 
      path: '/settings', 
      label: 'Settings', 
      icon: Settings,
      role: ['admin'] 
    },
  ];

  // Mock user role - replace with actual auth context
  const userRole = 'admin';

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-blue-600 mr-10">MTI Portal</h1>
            <div className="flex space-x-4">
              {navItems
                .filter(item => item.role.includes(userRole))
                .map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center px-4 py-2 rounded-md transition-colors
                      ${location.pathname === path 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    <span className="hidden md:inline">{label}</span>
                  </Link>
                ))}
            </div>
          </div>
          
          {/* User Profile & Notifications */}
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-full">
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              <AlertCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;