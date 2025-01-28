//src/components/applications/ApplicationsView.js
import { FileText, Search, Filter, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ITEMS_PER_PAGE = 10;

const ApplicationsView = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    date: 'all',
    searchQuery: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  
  const applications = [
    { 
      id: 'APP-001', 
      institution: 'Maritime Academy Kenya', 
      status: 'Under Review', 
      date: '2024-01-10', 
      type: 'New Accreditation',
      submittedBy: 'John Doe',
      lastUpdated: '2024-01-15'
    },
    // ... more sample data
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const filteredApplications = applications.filter(app => {
    const matchesStatus = filters.status === 'all' || app.status === filters.status;
    const matchesType = filters.type === 'all' || app.type === filters.type;
    const matchesSearch = app.institution.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                         app.id.toLowerCase().includes(filters.searchQuery.toLowerCase());
    
    if (filters.date === 'last7days') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return matchesStatus && matchesType && matchesSearch && 
             new Date(app.date) >= sevenDaysAgo;
    }
    
    return matchesStatus && matchesType && matchesSearch;
  });

  const totalPages = Math.ceil(filteredApplications.length / ITEMS_PER_PAGE);
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Applications</h2>
        <div className="space-x-4">
          <button
            onClick={() => navigate('/applications/register')}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Register Institution
          </button>
          <button
            onClick={() => navigate('/applications/new')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Application
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search applications..."
              className="pl-10 w-full rounded-md border border-gray-300 p-2"
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
            />
          </div>
          <select
            className="border border-gray-300 rounded-md p-2"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Under Review">Under Review</option>
            <option value="Processing">Processing</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <select
            className="border border-gray-300 rounded-md p-2"
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="New Accreditation">New Accreditation</option>
            <option value="Renewal">Renewal</option>
            <option value="Program Addition">Program Addition</option>
          </select>
          <select
            className="border border-gray-300 rounded-md p-2"
            value={filters.date}
            onChange={(e) => handleFilterChange('date', e.target.value)}
          >
            <option value="all">All Dates</option>
            <option value="last7days">Last 7 Days</option>
            <option value="last30days">Last 30 Days</option>
            <option value="last90days">Last 90 Days</option>
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
              <th className="text-left p-4">Submitted By</th>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Last Updated</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedApplications.map((app) => (
              <tr key={app.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{app.id}</td>
                <td className="p-4">{app.institution}</td>
                <td className="p-4">{app.type}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs
                    ${app.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      app.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                      app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'}`}>
                    {app.status}
                  </span>
                </td>
                <td className="p-4">{app.submittedBy}</td>
                <td className="p-4">{app.date}</td>
                <td className="p-4">{app.lastUpdated}</td>
                <td className="p-4">
                  <button 
                    onClick={() => navigate(`/applications/${app.id}`)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="flex items-center">
            <p className="text-sm text-gray-700">
              Showing{' '}
              <span className="font-medium">
                {((currentPage - 1) * ITEMS_PER_PAGE) + 1}
              </span>
              {' '}-{' '}
              <span className="font-medium">
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredApplications.length)}
              </span>
              {' '}of{' '}
              <span className="font-medium">{filteredApplications.length}</span>
              {' '}results
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {/* Page Numbers */}
            <div className="flex space-x-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsView;