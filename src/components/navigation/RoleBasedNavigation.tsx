//src/components/navigation/RoleBasedNavigation.tsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserRole } from '../../types/core';

interface NavigationItem {
  path: string;
  label: string;
  icon?: React.ComponentType;
  roles: UserRole[];
  children?: NavigationItem[];
}

interface RoleBasedNavigationProps {
  currentRole: UserRole;
  items: NavigationItem[];
  onNavigate?: (path: string) => void;
}

const navigationConfig: NavigationItem[] = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    roles: ['admin', 'reviewer', 'institution']
  },
  {
    path: '/applications',
    label: 'Applications',
    roles: ['admin', 'institution'],
    children: [
      {
        path: '/applications/new',
        label: 'New Application',
        roles: ['institution']
      },
      {
        path: '/applications/review',
        label: 'Review Applications',
        roles: ['admin', 'reviewer']
      }
    ]
  },
  {
    path: '/documents',
    label: 'Documents',
    roles: ['admin', 'reviewer', 'institution']
  },
  {
    path: '/settings',
    label: 'Settings',
    roles: ['admin']
  }
];

export const RoleBasedNavigation: React.FC<RoleBasedNavigationProps> = ({
  currentRole,
  items = navigationConfig,
  onNavigate
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path);
    }
  };

  const renderNavItem = (item: NavigationItem) => {
    if (!item.roles.includes(currentRole)) {
      return null;
    }

    const isActive = location.pathname === item.path;
    const Icon = item.icon;

    return (
      <div key={item.path} className="space-y-1">
        <button
          onClick={() => handleNavigation(item.path)}
          className={`w-full text-left px-4 py-2 rounded-md transition-colors
            ${isActive 
              ? 'bg-blue-50 text-blue-600' 
              : 'hover:bg-gray-50 text-gray-700'}`}
        >
          <div className="flex items-center">
            {Icon && <Icon className="w-5 h-5 mr-3" />}
            <span>{item.label}</span>
          </div>
        </button>

        {item.children && item.children.length > 0 && (
          <div className="pl-4 ml-4 border-l space-y-1">
            {item.children.map(child => renderNavItem(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className="space-y-1">
      {items.map(item => renderNavItem(item))}
    </nav>
  );
};