// src/components/maritime/MaritimeApplications.js

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FileText, Ship, Award, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

import { 
  submitApplication, 
  APPLICATION_STATUS, 
  updateApplicationStatus 
} from '../../store/slices/applicationSlice';

const MaritimeApplications = () => {
  const dispatch = useDispatch();
  const [selectedType, setSelectedType] = useState('new');
  const [showForm, setShowForm] = useState(false);

  const applications = useSelector(state => state.applications.applications);
  const status = useSelector(state => state.applications.status);

  const applicationTypes = [
    {
      id: 'new',
      title: 'New MTI Accreditation',
      description: 'Apply for initial Maritime Training Institution accreditation',
      icon: Ship
    },
    {
      id: 'renewal',
      title: 'Renewal Application',
      description: 'Renew your existing MTI accreditation',
      icon: Award
    },
    {
      id: 'course',
      title: 'Course Addition',
      description: 'Add new courses to your accredited programs',
      icon: FileText
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      [APPLICATION_STATUS.SUBMITTED]: { 
        color: 'bg-blue-100 text-blue-800', 
        icon: Clock 
      },
      [APPLICATION_STATUS.APPROVED]: { 
        color: 'bg-green-100 text-green-800', 
        icon: CheckCircle 
      },
      [APPLICATION_STATUS.REJECTED]: { 
        color: 'bg-red-100 text-red-800', 
        icon: AlertTriangle 
      }
    };

    const config = statusConfig[status] || statusConfig[APPLICATION_STATUS.SUBMITTED];
    
    return (
      <span className={`flex items-center px-2 py-1 rounded-full text-xs ${config.color}`}>
        <config.icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  const renderApplicationsList = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Recent Applications</h3>
      </div>
      <div className="divide-y">
        {applications.map(app => (
          <div key={app.id} className="p-4 hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{app.institutionName}</h4>
                <p className="text-sm text-gray-500">{app.type}</p>
                <div className="mt-2 flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    Submitted: {new Date(app.submissionDate).toLocaleDateString()}
                  </span>
                  {getStatusBadge(app.status)}
                </div>
              </div>
              <button 
                className="text-blue-600 hover:text-blue-800"
                onClick={() => handleViewDetails(app.id)}
              >
                View Details
              </button>
            </div>
            {app.status === APPLICATION_STATUS.DOCUMENT_VERIFICATION && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-md">
                <p className="text-sm text-yellow-800">
                  Document verification in progress. Please check your email for updates.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderApplicationTypes = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {applicationTypes.map(type => (
        <button
          key={type.id}
          onClick={() => {
            setSelectedType(type.id);
            setShowForm(true);
          }}
          className={`p-6 rounded-lg border-2 text-left transition-colors
            ${selectedType === type.id 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-blue-300'}`}
        >
          <type.icon className="w-8 h-8 text-blue-600 mb-4" />
          <h3 className="font-semibold mb-2">{type.title}</h3>
          <p className="text-sm text-gray-600">{type.description}</p>
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Maritime Training Institution Applications</h2>
          <p className="text-gray-600">Apply for or manage your MTI accreditation</p>
        </div>
      </div>

      {!showForm ? (
        <>
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">Start New Application</h3>
            {renderApplicationTypes()}
          </div>
          {renderApplicationsList()}
        </>
      ) : (
        <ApplicationForm 
          type={selectedType}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default MaritimeApplications;