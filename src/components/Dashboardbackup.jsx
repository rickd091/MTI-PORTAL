// src/components/Dashboard.js
import { FileText, Building2, FileSearch, CreditCard, Plus } from 'lucide-react';
import React, { useState } from 'react';

import NewApplicationWizard from './applications/NewApplicationWizard';

const Dashboard = () => {
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

  // Function to handle new application submission
  const handleSubmitApplication = (formData) => {
    console.log('New Application Data:', formData);
    setShowNewApplication(false);
    // Here you would typically send the data to your backend
  };

  const renderStatisticsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-600">Total Applications</p>
            <h3 className="text-2xl font-bold mt-2">
              {analyticsData.applications.total}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {analyticsData.applications.pending} pending
            </p>
          </div>
          <FileText className="w-6 h-6 text-blue-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-600">Inspections</p>
            <h3 className="text-2xl font-bold mt-2">
              {analyticsData.inspections.completed}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {analyticsData.inspections.scheduled} scheduled
            </p>
          </div>
          <Building2 className="w-6 h-6 text-green-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-600">Documents</p>
            <h3 className="text-2xl font-bold mt-2">
              {analyticsData.documents.total}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {analyticsData.documents.verified} verified
            </p>
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
            <p className="text-sm text-gray-500 mt-1">
              {analyticsData.payments.successRate}% success rate
            </p>
          </div>
          <CreditCard className="w-6 h-6 text-orange-600" />
        </div>
      </div>
    </div>
  );

  const renderNavigationTabs = () => (
    <div className="border-b">
      <nav className="flex space-x-8">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'applications', label: 'Applications' },
          { id: 'compliance', label: 'Compliance' },
          { id: 'reports', label: 'Reports' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-4 border-b-2 font-medium text-sm
              ${activeTab === tab.id 
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );

  return (
    <div className="space-y-6">
      {showNewApplication ? (
        // Show application wizard when button is clicked
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">New Application</h2>
                <button 
                  onClick={() => setShowNewApplication(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
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
        // Regular dashboard content
        <>
          {/* Header with New Application Button */}
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

          {/* Navigation Tabs */}
          {renderNavigationTabs()}

          {/* Statistics Cards */}
          {renderStatisticsCards()}
        </>
      )}
    </div>
  );
};

export default Dashboard;