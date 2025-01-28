//src/components/Dashboard.js

// External imports first (third-party libraries)
import { Building2, CreditCard, FileSearch, FileText, Plus } from 'lucide-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Local imports next
import NewApplicationWizard from './applications/NewApplicationWizard';
import { addApplication } from '../store/slices/applicationSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showNewApplication, setShowNewApplication] = useState(false);

  // Sample data
  const analyticsData = {
    applications: {
      total: 1234,
      pending: 45,
      approved: 1189
    },
    inspections: {
      completed: 892,
      scheduled: 56,
      pending: 23
    },
    documents: {
      total: 3456,
      verified: 3100,
      pending: 356
    },
    payments: {
      total: 4500000,
      successRate: 98.5
    }
  };

  // Define renderStatisticsCards first since it's used in tabData
  const renderStatisticsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-600">Total Applications</p>
            <h3 className="text-2xl font-bold mt-2">{analyticsData.applications.total}</h3>
            <p className="text-sm text-gray-500 mt-1">{analyticsData.applications.pending} pending</p>
          </div>
          <FileText className="w-6 h-6 text-blue-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-600">Inspections</p>
            <h3 className="text-2xl font-bold mt-2">{analyticsData.inspections.completed}</h3>
            <p className="text-sm text-gray-500 mt-1">{analyticsData.inspections.scheduled} scheduled</p>
          </div>
          <Building2 className="w-6 h-6 text-green-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-600">Documents</p>
            <h3 className="text-2xl font-bold mt-2">{analyticsData.documents.total}</h3>
            <p className="text-sm text-gray-500 mt-1">{analyticsData.documents.verified} verified</p>
          </div>
          <FileSearch className="w-6 h-6 text-purple-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-600">Payments</p>
            <h3 className="text-2xl font-bold mt-2">
              KES {(analyticsData.payments.total / 1000).toFixed(1)}k
            </h3>
            <p className="text-sm text-gray-500 mt-1">{analyticsData.payments.successRate}% success rate</p>
          </div>
          <CreditCard className="w-6 h-6 text-orange-600" />
        </div>
      </div>
    </div>
  );

 const handleSubmitApplication = async (formData) => {
  try {
    const result = await dispatch(submitApplication(formData)).unwrap();
    setShowNewApplication(false);
    navigate('/applications');
  } catch (error) {
    console.error('Error submitting application:', error);
    // Show error message to user
  }
};

  // Define tabData after renderStatisticsCards
  const tabData = {
    overview: {
      title: "Overview",
      content: (
        <div className="space-y-6">
          {renderStatisticsCards()}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                <div>
                  <p className="font-medium">New Application Submitted</p>
                  <p className="text-sm text-gray-500">ABC Training Institute</p>
                </div>
                <span className="text-sm text-gray-500">2 hours ago</span>
              </div>
              <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                <div>
                  <p className="font-medium">Inspection Scheduled</p>
                  <p className="text-sm text-gray-500">XYZ Technical College</p>
                </div>
                <span className="text-sm text-gray-500">5 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    applications: {
      title: "Applications",
      content: (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Applications</h3>
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 text-sm">
                  <th className="pb-3">Institution</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="py-3">ABC Training Institute</td>
                  <td><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Pending</span></td>
                  <td className="text-gray-500">2024-01-15</td>
                </tr>
                <tr className="border-t">
                  <td className="py-3">XYZ Technical College</td>
                  <td><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Approved</span></td>
                  <td className="text-gray-500">2024-01-14</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    },
    compliance: {
      title: "Compliance",
      content: (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Compliance Status</h3>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Document Compliance</h4>
                <span className="text-green-600">98%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '98%' }}></div>
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Inspection Compliance</h4>
                <span className="text-blue-600">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    reports: {
      title: "Reports",
      content: (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Available Reports</h3>
          <div className="space-y-4">
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <h4 className="font-medium">Monthly Applications Report</h4>
              <p className="text-sm text-gray-500">Summary of applications received and processed</p>
            </div>
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <h4 className="font-medium">Compliance Report</h4>
              <p className="text-sm text-gray-500">Detailed compliance status of institutions</p>
            </div>
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <h4 className="font-medium">Inspection Summary</h4>
              <p className="text-sm text-gray-500">Overview of completed and pending inspections</p>
            </div>
          </div>
        </div>
      )
    }
  };

  const renderNavigationTabs = () => (
    <div className="border-b">
      <nav className="flex space-x-8">
        {Object.keys(tabData).map(tabKey => (
          <button
            key={tabKey}
            onClick={() => setActiveTab(tabKey)}
            className={`px-4 py-4 border-b-2 font-medium text-sm transition-colors
              ${activeTab === tabKey 
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            {tabData[tabKey].title}
          </button>
        ))}
      </nav>
    </div>
  );

  return (
    <div className="space-y-6">
      {showNewApplication ? (
        // Modal for new application
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto max-w-4xl">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">New Application</h2>
                <button 
                  onClick={() => setShowNewApplication(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              <NewApplicationWizard 
                onSubmit={handleSubmitApplication}
                onCancel={() => setShowNewApplication(false)}
              />
            </div>
          </div>
        </div>
      ) : (
        // Main dashboard content
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <button
              onClick={() => setShowNewApplication(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Application
            </button>
          </div>
          {renderNavigationTabs()}
          <div className="py-4">
            {tabData[activeTab].content}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;