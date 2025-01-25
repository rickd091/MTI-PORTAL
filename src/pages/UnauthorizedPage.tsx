//src/pages/UnauthorizedPage.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-center mb-6">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-4">Access Denied</h1>
        <p className="text-gray-600 text-center mb-6">
          You don't have permission to access this page. Please contact your
          administrator if you believe this is an error.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;