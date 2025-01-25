//src/components/registration/DocumentManagement.js
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import DocumentExpiryNotification from './DocumentExpiryNotification';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Bell, Calendar } from 'lucide-react';

const DocumentManagement = ({ documents }) => {
  const [expiryNotifications, setExpiryNotifications] = useState([]);
  const [renewalRequests, setRenewalRequests] = useState([]);

  useEffect(() => {
    // Load saved renewal requests
    const savedRequests = localStorage.getItem('documentRenewalRequests');
    if (savedRequests) {
      setRenewalRequests(JSON.parse(savedRequests));
    }
  }, []);

  const handleRenewalRequest = (documentId) => {
    const newRequest = {
      id: documentId,
      requestDate: new Date().toISOString(),
      status: 'pending'
    };
    
    setRenewalRequests(prev => {
      const updated = [...prev, newRequest];
      localStorage.setItem('documentRenewalRequests', JSON.stringify(updated));
      return updated;
    });

    // Show notification
    const notification = new Notification('Document Renewal Request', {
      body: 'Your document renewal request has been submitted.',
      icon: '/path/to/notification-icon.png'
    });
  };

  const getPendingRenewals = () => {
    return renewalRequests.filter(request => request.status === 'pending');
  };

  const getNextExpiringDocuments = () => {
    return documents
      .filter(doc => doc.expiryDate)
      .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))
      .slice(0, 3);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold">{documents.length}</p>
              </div>
              <Bell className="w-5 h-5 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Renewals</p>
                <p className="text-2xl font-bold">{getPendingRenewals().length}</p>
              </div>
              <Calendar className="w-5 h-5 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold">
                  {documents.filter(doc => {
                    if (!doc.expiryDate) return false;
                    const daysUntilExpiry = Math.ceil(
                      (new Date(doc.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
                    );
                    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
                  }).length}
                </p>
              </div>
              <Bell className="w-5 h-5 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expiry Notifications */}
      <DocumentExpiryNotification
        documents={documents}
        onRenewalRequest={handleRenewalRequest}
      />

      {/* Next Expiring Documents */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Upcoming Expirations</h3>
          <div className="space-y-4">
            {getNextExpiringDocuments().map(doc => {
              const daysUntilExpiry = Math.ceil(
                (new Date(doc.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
              );
              
              return (
                <div
                  key={doc.id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-gray-500">{doc.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      Expires in {daysUntilExpiry} days
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(doc.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Renewal Requests */}
      {renewalRequests.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Renewal Requests</h3>
            <div className="space-y-4">
              {renewalRequests.map(request => {
                const document = documents.find(doc => doc.id === request.id);
                if (!document) return null;

                return (
                  <div
                    key={request.id}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{document.name}</p>
                      <p className="text-sm text-gray-500">
                        Requested: {new Date(request.requestDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className={`px-2 py-1 rounded-full text-xs
                        ${request.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentManagement;