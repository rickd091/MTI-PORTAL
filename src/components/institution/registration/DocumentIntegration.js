src/components/institution/registration/DocumentIntegration.js

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Bell, AlertCircle } from 'lucide-react';
import DocumentManagement from './DocumentManagement';
import DocumentExpiryNotification from './DocumentExpiryNotification';

const DocumentIntegration = ({ 
  formData, 
  setFormData,
  onDocumentUpload,
  checkDocumentStatus
}) => {
  const [documentStatuses, setDocumentStatuses] = useState({});
  const [notifications, setNotifications] = useState([]);

  const handleRenewalRequest = async (documentId) => {
    try {
      setDocumentStatuses(prev => ({
        ...prev,
        [documentId]: {
          ...prev[documentId],
          renewalRequested: true,
          renewalRequestDate: new Date().toISOString()
        }
      }));

      setNotifications(prev => [
        {
          id: Date.now(),
          type: 'renewal_request',
          documentId,
          message: 'Renewal request submitted successfully',
          timestamp: new Date().toISOString()
        },
        ...prev
      ]);

      setFormData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [documentId]: {
            ...prev.documents[documentId],
            renewalStatus: 'requested'
          }
        }
      }));

    } catch (error) {
      console.error('Error handling renewal request:', error);
      setNotifications(prev => [
        {
          id: Date.now(),
          type: 'error',
          documentId,
          message: 'Failed to submit renewal request',
          timestamp: new Date().toISOString()
        },
        ...prev
      ]);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Document Management</h3>
          
          <DocumentManagement
            documents={formData.documents}
            onRenewalRequest={handleRenewalRequest}
            onDocumentUpload={onDocumentUpload}
            checkDocumentStatus={checkDocumentStatus}
          />

          <div className="mt-6">
            <DocumentExpiryNotification
              documents={formData.documents}
              expiryThresholdDays={30}
              onRenewalRequest={handleRenewalRequest}
            />
          </div>

          {notifications.length > 0 && (
            <div className="mt-6">
              <h4 className="text-md font-medium mb-3">Notifications</h4>
              <div className="space-y-2">
                {notifications.map(notification => (
                  <Alert
                    key={notification.id}
                    variant={notification.type === 'error' ? 'destructive' : 'default'}
                  >
                    <div className="flex items-center">
                      {notification.type === 'error' ? (
                        <AlertCircle className="w-4 h-4 mr-2" />
                      ) : (
                        <Bell className="w-4 h-4 mr-2" />
                      )}
                      <span>{notification.message}</span>
                    </div>
                  </Alert>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h4 className="font-medium text-gray-900 mb-3">Document Requirements</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• All documents must be clear and legible</li>
            <li>• Accepted formats: PDF, DOC, DOCX</li>
            <li>• Maximum file size: 10MB per document</li>
            <li>• Documents should be recent and valid</li>
            <li>• Ensure all required fields are completed</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentIntegration;