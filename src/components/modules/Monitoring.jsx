src/components/modules/Monitoring.js

import React, { useState } from 'react';
import { Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const Monitoring = () => {
  const [auditTypes] = useState({
    INITIAL: 'initial',
    FOLLOW_UP: 'follow_up',
    ANNUAL: 'annual',
    RENEWAL: 'renewal'
  });

  const [auditStatus] = useState({
    SCHEDULED: 'scheduled',
    PENDING: 'pending',
    COMPLETED: 'completed',
    OVERDUE: 'overdue'
  });

  const [audits] = useState([
    {
      id: 1,
      institution: 'Maritime Academy A',
      type: 'initial',
      scheduledDate: '2024-02-20',
      status: 'scheduled',
      findings: [],
      requirements: ['Safety Equipment', 'Training Records']
    },
    // ... more audits
  ]);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'scheduled':
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Monitoring & Audits</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
          Schedule New Audit
        </button>
      </div>

      {/* Upcoming Audits */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Upcoming Audits</h3>
        <div className="space-y-4">
          {audits.map(audit => (
            <div key={audit.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{audit.institution}</h4>
                  <p className="text-sm text-gray-500">Type: {audit.type}</p>
                  <p className="text-sm text-gray-500">Scheduled: {audit.scheduledDate}</p>
                </div>
                <div className="flex items-center">
                  {getStatusIcon(audit.status)}
                  <span className="ml-2 text-sm">{audit.status}</span>
                </div>
              </div>
              {audit.findings.length > 0 && (
                <div className="mt-4">
                  <h5 className="text-sm font-medium">Findings:</h5>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {audit.findings.map((finding, index) => (
                      <li key={index}>{finding}</li>
                    ))}
                  </ul>
                </div>
              )}
              {audit.requirements.length > 0 && (
                <div className="mt-4">
                  <h5 className="text-sm font-medium">Requirements:</h5>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {audit.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Audit Calendar */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Audit Calendar</h3>
        {/* Calendar Implementation */}
      </div>

      {/* Compliance Tracking */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Compliance Tracking</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Compliant MTIs', count: 15, color: 'bg-green-100 text-green-800' },
            { label: 'Pending Actions', count: 5, color: 'bg-yellow-100 text-yellow-800' },
            { label: 'Non-Compliant', count: 2, color: 'bg-red-100 text-red-800' }
          ].map((stat, index) => (
            <div key={index} className={`p-4 rounded-lg ${stat.color}`}>
              <div className="text-2xl font-bold">{stat.count}</div>
              <div className="text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Monitoring;