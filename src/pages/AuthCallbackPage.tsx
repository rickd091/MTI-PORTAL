import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingState from '../components/common/LoadingState';

const AuthCallbackPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const { getSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // No need to extract hash since we're using the location directly
    const handleCallback = async () => {
      try {
        const session = await getSession();
        
        // Get the return URL from state or default to home
        const returnTo = location.state?.from || '/';
        
        if (session) {
          navigate(returnTo, { replace: true });
        } else {
          // If no session, redirect to login
          navigate('/login', { replace: true });
        }
      } catch (err) {
        console.error('Error in auth callback:', err);
        setError('Authentication failed. Please try again.');
        // Redirect to login after a short delay
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      }
    };

    handleCallback();
  }, [getSession, navigate, location]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-700">{error}</p>
          <p className="text-gray-500 mt-2">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <LoadingState message="Completing authentication..." />;
};

export default AuthCallbackPage;
