// src/components/ApplicationsView.js
import { FileText, Search, Filter } from 'lucide-react';
import React, { useState } from 'react';

const ApplicationsView = () => {
  const [applicationFilter, setApplicationFilter] = useState('all');
  
  const applications = [
    { id: 'APP-001', institution: 'Maritime Academy Kenya', status: 'Under Review', date: '2024-01-10', type: 'New Accreditation' },
    { id: 'APP-002', institution: 'Nautical Institute TZ', status: 'Processing', date: '2024-01-09', type: 'Renewal' },
    { id: 'APP-003', institution: 'Marine School Uganda', status: 'Approved', date: '2024-01-08', type: 'Program Addition' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Applications</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          New Application
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search applications..."
              className="pl-10 w-full rounded-md border border-gray-300 p-2"
            />
          </div>
          <select
            className="border border-gray-300 rounded-md p-2"
            value={applicationFilter}
            onChange={(e) => setApplicationFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="processing">Processing</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4">ID</th>
              <th className="text-left p-4">Institution</th>
              <th className="text-left p-4">Type</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{app.id}</td>
                <td className="p-4">{app.institution}</td>
                <td className="p-4">{app.type}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs
                    ${app.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      app.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'}`}>
                    {app.status}
                  </span>
                </td>
                <td className="p-4">{app.date}</td>
                <td className="p-4">
                  <button className="text-blue-600 hover:text-blue-800">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicationsView;