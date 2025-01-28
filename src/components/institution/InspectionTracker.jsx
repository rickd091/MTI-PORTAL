// src/components/inspection/InspectionTracker.js
import { Calendar, CheckSquare, AlertTriangle, FileText } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { inspectionService } from '../../services/api';

const InspectionTracker = () => {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState(null);

  const statusColors = {
    scheduled: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800'
  };

  useEffect(() => {
    fetchInspections();
  }, []);

  const fetchInspections = async () => {
    setLoading(true);
    try {
      const response = await inspectionService.list();
      setInspections(response.data);
    } catch (error) {
      console.error('Error fetching inspections:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Inspection Tracker</h2>
        <button
          onClick={() => setSelectedInspection({})}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Schedule Inspection
        </button>
      </div>

      {/* Filters and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(statusColors).map(([status, colorClass]) => (
          <div key={status} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 capitalize">{status}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${colorClass}`}>
                {inspections.filter(i => i.status === status).length}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Inspections List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <h3 className="text-lg font-medium">Upcoming Inspections</h3>
        </div>
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Institution
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Inspector
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {inspections.map((inspection) => (
              <tr key={inspection.id}>
                <td className="px-6 py-4">{inspection.institutionName}</td>
                <td className="px-6 py-4">{inspection.type}</td>
                <td className="px-6 py-4">{inspection.scheduledDate}</td>
                <td className="px-6 py-4">{inspection.inspectorName}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${statusColors[inspection.status]}`}>
                    {inspection.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => setSelectedInspection(inspection)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Inspection Modal */}
      {selectedInspection && (
        <InspectionModal
          inspection={selectedInspection}
          onClose={() => setSelectedInspection(null)}
          onSubmit={handleInspectionSubmit}
        />
      )}
    </div>
  );
};

// Inspection Checklist Component
const InspectionChecklist = ({ items, onChange }) => {
  return (
    <div className="space-y-4">
      {Object.entries(items).map(([category, checkItems]) => (
        <div key={category} className="border-t pt-4">
          <h4 className="font-medium mb-2 capitalize">{category}</h4>
          <div className="space-y-2">
            {checkItems.map((item, index) => (
              <div key={index} className="flex items-start">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={(e) => onChange(category, index, e.target.checked)}
                  className="mt-1 mr-2"
                />
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  {item.description && (
                    <p className="text-sm text-gray-500">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Continue with Document Validation and File Upload components...