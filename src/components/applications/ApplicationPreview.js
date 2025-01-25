// src/components/applications/ApplicationPreview.js
import { Download, Check, AlertCircle } from 'lucide-react';
import React from 'react';

const ApplicationPreview = ({ data, onEdit }) => {
  const renderSection = (section, data) => {
    switch (section) {
      case 'institutionDetails':
        return (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">Institution Details</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(data).map(([key, value]) => (
                <div key={key} className="mb-4">
                  <label className="text-sm text-gray-600 block">{key}</label>
                  <p className="font-medium">{value}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'courses':
        return (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">Course Information</h3>
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-4 text-left">Course Name</th>
                  <th className="p-4 text-left">Duration</th>
                  <th className="p-4 text-left">Capacity</th>
                  <th className="p-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((course, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-4">{course.name}</td>
                    <td className="p-4">{course.duration} months</td>
                    <td className="p-4">{course.capacity} students</td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        Pending Approval
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'documents':
        return (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">Uploaded Documents</h3>
            <div className="space-y-4">
              {Object.entries(data).map(([key, file]) => (
                <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Download className="w-5 h-5 mr-3 text-gray-500" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <span className="flex items-center text-green-600">
                    <Check className="w-4 h-4 mr-1" />
                    Verified
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Application Preview</h2>
        <button
          onClick={onEdit}
          className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
        >
          Edit Application
        </button>
      </div>

      {Object.entries(data).map(([section, sectionData]) => (
        <div key={section}>
          {renderSection(section, sectionData)}
        </div>
      ))}
    </div>
  );
};

export default ApplicationPreview;