//src/components/applications/ApplicationDetails.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  FileText, 
  User, 
  Building, 
  CheckSquare,
  AlertCircle,
  MessageSquare,
  Download,
  ChevronLeft,
  Edit
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const StatusBadge = ({ status }) => {
  const statusStyles = {
    'Under Review': 'bg-blue-100 text-blue-800',
    'Approved': 'bg-green-100 text-green-800',
    'Processing': 'bg-yellow-100 text-yellow-800',
    'Rejected': 'bg-red-100 text-red-800',
    'Pending': 'bg-gray-100 text-gray-800'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs ${statusStyles[status] || 'bg-gray-100'}`}>
      {status}
    </span>
  );
};

const TimelineEvent = ({ event }) => (
  <div className="flex gap-4 pb-6 relative">
    <div className={`w-3 h-3 rounded-full mt-2 
      ${event.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'}`}
    />
    <div className="flex-1">
      <p className="font-medium">{event.action}</p>
      <div className="text-sm text-gray-500 space-y-1">
        <p>By: {event.user}</p>
        <p>{event.date}</p>
        {event.notes && <p className="text-gray-600">{event.notes}</p>}
      </div>
    </div>
  </div>
);

const DocumentItem = ({ document, onDownload }) => (
  <div className="flex items-center justify-between p-4 border rounded-lg">
    <div className="flex items-center space-x-4">
      <FileText className="w-6 h-6 text-blue-500" />
      <div>
        <p className="font-medium">{document.name}</p>
        <p className="text-sm text-gray-500">
          {(document.size / 1024 / 1024).toFixed(2)} MB
        </p>
      </div>
    </div>
    <button 
      onClick={() => onDownload(document)}
      className="p-2 hover:bg-gray-100 rounded-full"
    >
      <Download className="w-5 h-5 text-gray-600" />
    </button>
  </div>
);

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [newComment, setNewComment] = useState('');

  // Sample application data - replace with actual data fetching
  const application = {
    id: 'APP-001',
    institution: 'Maritime Academy Kenya',
    status: 'Under Review',
    type: 'New Accreditation',
    submittedBy: 'John Doe',
    submittedDate: '2024-01-10',
    lastUpdated: '2024-01-15',
    description: 'Application for maritime training institution accreditation',
    documents: [
      { id: 1, name: 'Institution Profile.pdf', size: 2500000 },
      { id: 2, name: 'Course Outline.pdf', size: 1800000 },
      { id: 3, name: 'Staff Credentials.pdf', size: 3200000 }
    ],
    timeline: [
      { 
        date: '2024-01-15', 
        action: 'Document Review Completed', 
        user: 'Alice Smith',
        status: 'completed',
        notes: 'All required documents have been verified.'
      },
      { 
        date: '2024-01-12', 
        action: 'Additional Documents Requested', 
        user: 'Bob Johnson',
        status: 'pending',
        notes: 'Staff certification documents needed.'
      },
      { 
        date: '2024-01-10', 
        action: 'Application Submitted', 
        user: 'John Doe',
        status: 'completed'
      }
    ],
    comments: [
      {
        id: 1,
        user: 'Alice Smith',
        date: '2024-01-15',
        text: 'All documents have been reviewed. Pending site inspection.',
        internal: true
      },
      {
        id: 2,
        user: 'John Doe',
        date: '2024-01-12',
        text: 'Additional staff credentials uploaded as requested.',
        internal: false
      }
    ],
    requirements: [
      { id: 1, name: 'Institution Documentation', status: 'completed' },
      { id: 2, name: 'Staff Credentials', status: 'pending' },
      { id: 3, name: 'Facility Inspection', status: 'pending' },
      { id: 4, name: 'Payment Verification', status: 'completed' }
    ]
  };

  const handleDownload = (document) => {
    // Implement document download logic
    console.log('Downloading:', document.name);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    // Add comment logic here
    console.log('Adding comment:', newComment);
    setNewComment('');
    setShowCommentInput(false);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'comments', label: 'Comments', icon: MessageSquare }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Status and Action Buttons */}
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Current Status</p>
                <StatusBadge status={application.status} />
              </div>
              <div className="space-x-4">
                <button className="px-4 py-2 border rounded-md hover:bg-gray-50">
                  Request Review
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Update Status
                </button>
              </div>
            </div>

            {/* Requirements Progress */}
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Application Requirements</h4>
                <div className="space-y-4">
                  {application.requirements.map(req => (
                    <div key={req.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CheckSquare className={`w-5 h-5 mr-2 
                          ${req.status === 'completed' ? 'text-green-500' : 'text-gray-400'}`} 
                        />
                        <span>{req.name}</span>
                      </div>
                      <StatusBadge status={req.status} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Institution Details */}
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Institution Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Institution Name</p>
                    <p className="font-medium">{application.institution}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Application Type</p>
                    <p className="font-medium">{application.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Submitted By</p>
                    <p className="font-medium">{application.submittedBy}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Submission Date</p>
                    <p className="font-medium">{application.submittedDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'documents':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-900">Application Documents</h4>
              <button className="px-4 py-2 border rounded-md hover:bg-gray-50">
                Upload New Document
              </button>
            </div>
            <div className="space-y-4">
              {application.documents.map(doc => (
                <DocumentItem 
                  key={doc.id} 
                  document={doc} 
                  onDownload={handleDownload}
                />
              ))}
            </div>
          </div>
        );

      case 'timeline':
        return (
          <div className="space-y-6">
            <h4 className="font-medium text-gray-900">Application Timeline</h4>
            <div className="space-y-6 relative before:absolute before:left-1.5 before:top-2 
              before:h-full before:w-0.5 before:bg-gray-200">
              {application.timeline.map((event, index) => (
                <TimelineEvent key={index} event={event} />
              ))}
            </div>
          </div>
        );

      case 'comments':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-900">Comments</h4>
              <button 
                onClick={() => setShowCommentInput(true)}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Add Comment
              </button>
            </div>

            {showCommentInput && (
              <div className="space-y-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full border rounded-md p-3"
                  rows={3}
                  placeholder="Type your comment here..."
                />
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowCommentInput(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddComment}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add Comment
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {application.comments.map(comment => (
                <div 
                  key={comment.id}
                  className={`p-4 rounded-lg ${comment.internal ? 'bg-blue-50' : 'bg-gray-50'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{comment.user}</p>
                      <p className="text-sm text-gray-500">{comment.date}</p>
                    </div>
                    {comment.internal && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        Internal
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600">{comment.text}</p>
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/applications')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold">Application Details</h2>
            <p className="text-sm text-gray-500">Application ID: {application.id}</p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/applications/${id}/edit`)}
          className="flex items-center px-4 py-2 border rounded-md hover:bg-gray-50"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-4 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="py-4">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ApplicationDetails;