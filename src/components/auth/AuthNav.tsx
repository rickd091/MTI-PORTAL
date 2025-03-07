import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';

const AuthNav: React.FC = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="bg-white shadow-sm py-3 px-6 mb-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex space-x-4 items-center">
          <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
            Home
          </Link>
          <Link to="/auth/demo" className="text-blue-600 hover:text-blue-800 font-medium">
            Auth Demo
          </Link>
          <Link to="/server-example" className="text-blue-600 hover:text-blue-800 font-medium">
            Server Example
          </Link>
          <Link to="/users" className="text-blue-600 hover:text-blue-800 font-medium">
            Users
          </Link>
        </div>
        
        <div>
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Signed in as: <span className="font-medium">{user.email}</span>
              </span>
              <Button 
                onClick={handleSignOut}
                variant="outline"
                className="text-sm"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Link to="/login">
                <Button variant="outline" className="text-sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth/demo">
                <Button className="text-sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthNav;
