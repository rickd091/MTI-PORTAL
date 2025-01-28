// src/pages/ApplicationsPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Plus } from 'lucide-react';
import NewApplicationWizard from '../components/applications/NewApplicationWizard';
import ECitizenPaymentHandler from '../components/payments/ECitizenPaymentHandler';

const ApplicationsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showNewApplication, setShowNewApplication] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [currentApplication, setCurrentApplication] = useState(null);

  const handleStartApplication = () => {
    setShowNewApplication(true);
  };

  const handleApplicationSubmit = (applicationData) => {
    // Save application details and prepare for payment
    setCurrentApplication({
      applicationId: `APP-${Date.now()}`,
      institutionId: applicationData.institutionId || 'INS-001',
      type: 'initial',
      ...applicationData
    });
    setShowNewApplication(false);
    setShowPayment(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">MTI Applications</h1>
          <p className="text-gray-600">Manage and track MTI accreditation applications</p>
        </div>
        <button
          onClick={handleStartApplication}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Application
        </button>
      </div>

      {/* Application List and Other Content */}
      {/* ... your existing application list content ... */}

      {/* New Application Wizard Modal */}
      {showNewApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl">
            <NewApplicationWizard
              onSubmit={handleApplicationSubmit}
              onCancel={() => setShowNewApplication(false)}
            />
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && currentApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl">
            <ECitizenPaymentHandler
              serviceCode="KMA-MTI-001"
              applicationData={{
                applicationId: currentApplication.applicationId,
                institutionId: currentApplication.institutionId,
                applicationType: 'Initial MTI Accreditation',
                institutionName: currentApplication.institutionName
              }}
              onPaymentComplete={(result) => {
                // Handle successful payment
                navigate('/applications/status');
              }}
              onCancel={() => setShowPayment(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;