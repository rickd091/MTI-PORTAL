// src/components/tracking/ApplicationProgress.js
import { 
  CheckCircle, Clock, AlertCircle, FileText, 
  UserCheck, ClipboardCheck, Award 
} from 'lucide-react';
import React from 'react';
import { useSelector } from 'react-redux';

const ApplicationProgress = ({ applicationId }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [steps, setSteps] = useState([
    { 
      id: 'documents',
      title: 'Document Submission',
      status: 'completed',
      substeps: [
        { title: 'Registration Documents', status: 'completed' },
        { title: 'Facility Documents', status: 'completed' },
        { title: 'Curriculum Documents', status: 'completed' }
      ]
    },
    {
      id: 'review',
      title: 'Initial Review',
      status: 'in_progress',
      substeps: [
        { title: 'Document Verification', status: 'in_progress' },
        { title: 'Compliance Check', status: 'pending' }
      ]
    },
    {
      id: 'inspection',
      title: 'Physical Inspection',
      status: 'pending',
      substeps: [
        { title: 'Schedule Inspection', status: 'pending' },
        { title: 'Facility Inspection', status: 'pending' },
        { title: 'Equipment Verification', status: 'pending' }
      ]
    },
    {
      id: 'approval',
      title: 'Final Approval',
      status: 'pending',
      substeps: [
        { title: 'Committee Review', status: 'pending' },
        { title: 'Certificate Generation', status: 'pending' }
      ]
    }
  ]);

  return (
    <div className="space-y-6">
      {/* Main Progress Steps */}
      <div className="relative">
        <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gray-200">
          <div 
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
          />
        </div>

        <div className="relative flex justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center
                  ${step.status === 'completed' ? 'bg-green-500' :
                    step.status === 'in_progress' ? 'bg-blue-500' :
                    'bg-gray-200'
                  } transition-colors duration-200`}
              >
                {step.status === 'completed' ? (
                  <CheckCircle className="w-6 h-6 text-white" />
                ) : step.status === 'in_progress' ? (
                  <Clock className="w-6 h-6 text-white" />
                ) : (
                  <div className="w-3 h-3 rounded-full bg-gray-400" />
                )}
              </div>
              <div className="mt-2 text-sm font-medium">{step.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Progress View */}
      <div className="bg-white rounded-lg shadow p-6">
        {steps[activeStep].substeps.map((substep, index) => (
          <div key={index} className="flex items-center space-x-4 py-3">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center
                ${substep.status === 'completed' ? 'bg-green-100 text-green-600' :
                  substep.status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                  'bg-gray-100 text-gray-400'
                }`}
            >
              {getStatusIcon(substep.status)}
            </div>
            <div>
              <p className="font-medium">{substep.title}</p>
              {substep.status === 'completed' && (
                <p className="text-sm text-gray-500">
                  Completed on {substep.completedDate}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <button
          disabled={activeStep === 0}
          onClick={() => setActiveStep(prev => prev - 1)}
          className="px-4 py-2 border rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <button
          disabled={activeStep === steps.length - 1}
          onClick={() => setActiveStep(prev => prev + 1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

// Progress Timeline Component
const ProgressTimeline = ({ events }) => {
  return (
    <div className="space-y-6">
      {events.map((event, index) => (
        <div key={index} className="relative pl-8">
          <div className="absolute left-0 top-0 h-full w-px bg-gray-200" />
          <div className="absolute left-0 top-2 w-2 h-2 rounded-full bg-blue-500" />
          <div>
            <p className="font-medium">{event.title}</p>
            <p className="text-sm text-gray-500">{event.timestamp}</p>
            <p className="text-sm mt-1">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};