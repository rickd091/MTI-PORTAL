// src/pages/ApplicationsPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Plus } from 'lucide-react';
import NewApplicationWizard from '../components/applications/NewApplicationWizard';
import ECitizenPaymentHandler from '../components/payments/ECitizenPaymentHandler';
import { applicationService } from '../services/api/application-service';
import { useAuth } from '../contexts/AuthContext';

const ApplicationsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewApplication, setShowNewApplication] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [currentApplication, setCurrentApplication] = useState(null);

  useEffect(() => {
    // Fetch applications when component mounts
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await applicationService.list();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartApplication = () => {
    setShowNewApplication(true);
  };

  const handleApplicationSubmit = async (applicationData) => {
    try {
      // Create application in Supabase
      const newApplication = await applicationService.create({
        institution_id: applicationData.institutionId || 'INS-001',
        application_type: applicationData.type?.toUpperCase() || 'INITIAL',
        status: 'DRAFT',
        payment_status: 'PENDING'
      });
      
      // Set current application for payment
      setCurrentApplication({
        applicationId: newApplication.id,
        institutionId: newApplication.institution_id,
        type: newApplication.application_type.toLowerCase(),
        ...applicationData
      });
      
      setShowNewApplication(false);
      setShowPayment(true);
    } catch (error) {
      console.error('Error creating application:', error);
    }
  };

  const handlePaymentComplete = async (result) => {
    try {
      // Update application with payment information
      await applicationService.update(currentApplication.applicationId, {
        payment_status: 'PAID',
        payment_reference: result.reference,
        payment_amount: result.amount,
        status: 'SUBMITTED',
        submission_date: new Date().toISOString()
      });
      
      // Refresh applications list
      fetchApplications();
      setShowPayment(false);
      navigate('/applications/status');
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
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

      {/* Application List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-4 text-center">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No applications found</p>
            <button 
              onClick={handleStartApplication}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create your first application
            </button>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institution</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.institutions?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.application_type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      app.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      app.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      app.status === 'UNDER_REVIEW' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      app.payment_status === 'PAID' ? 'bg-green-100 text-green-800' :
                      app.payment_status === 'FAILED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {app.payment_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(app.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => navigate(`/applications/${app.id}`)} 
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

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
              onPaymentComplete={handlePaymentComplete}
              onCancel={() => setShowPayment(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;