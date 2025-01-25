src/components/institution/registration/DocumentExpiryNotification.js

import React, { useEffect, useState } from 'react';
import { AlertCircle, Calendar, Bell, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const ExpiryStatus = {
  VALID: 'valid',
  EXPIRING_SOON: 'expiring_soon',
  EXPIRED: 'expired'
};

const getStatusConfig = (status) => {
  const configs = {
    [ExpiryStatus.VALID]: {
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    [ExpiryStatus.EXPIRING_SOON]: {
      icon: Clock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    [ExpiryStatus.EXPIRED]: {
      icon: AlertCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    }
  };
  return configs[status];
};

const DocumentStatusBadge = ({ status, daysUntilExpiry }) => {
  const config = getStatusConfig(status);
  const StatusIcon = config.icon;

  return (
    <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm ${config.bgColor} ${config.color}`}>
      <StatusIcon className="w-4 h-4 mr-1" />
      {status === ExpiryStatus.VALID && 'Valid'}
      {status === ExpiryStatus.EXPIRING_SOON && `Expires in ${daysUntilExpiry} days`}
      {status === ExpiryStatus.EXPIRED && 'Expired'}
    </div>
  );
};

const DocumentExpiryNotification = ({ 
  documents, 
  expiryThresholdDays = 30,
  onRenewalRequest 
}) => {
  const [notifications, setNotifications] = useState([]);
  const [showAllNotifications, setShowAllNotifications] = useState(false);

  useEffect(() => {
    const checkDocumentExpiry = () => {
      const newNotifications = [];
      const now = new Date();

      // Convert documents object to array of documents with their keys
      Object.entries(documents).forEach(([docId, doc]) => {
        if (!doc.expiryDate) return;

        const expiryDate = new Date(doc.expiryDate);
        const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

        let status;
        if (daysUntilExpiry < 0) {
          status = ExpiryStatus.EXPIRED;
        } else if (daysUntilExpiry <= expiryThresholdDays) {
          status = ExpiryStatus.EXPIRING_SOON;
        } else {
          status = ExpiryStatus.VALID;
        }

        newNotifications.push({
          id: docId,
          name: doc.name || `Document ${docId}`,
          category: doc.category || 'Uncategorized',
          status,
          expiryDate,
          daysUntilExpiry,
          requiresAction: status !== ExpiryStatus.VALID
        });
      });

      setNotifications(newNotifications);
    };

    checkDocumentExpiry();
    // Set up daily check
    const interval = setInterval(checkDocumentExpiry, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [documents, expiryThresholdDays]);

  const displayNotifications = showAllNotifications 
    ? notifications 
    : notifications.filter(n => n.requiresAction);

  if (notifications.length === 0) return null;

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Document Status</h3>
          <button
            onClick={() => setShowAllNotifications(!showAllNotifications)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {showAllNotifications ? 'Show Action Required' : 'Show All'}
          </button>
        </div>

        <div className="space-y-4">
          {displayNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border ${getStatusConfig(notification.status).borderColor}`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h4 className="font-medium">{notification.name}</h4>
                  <p className="text-sm text-gray-500">
                    {notification.category}
                  </p>
                  <DocumentStatusBadge 
                    status={notification.status}
                    daysUntilExpiry={notification.daysUntilExpiry}
                  />
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    Expires: {notification.expiryDate.toLocaleDateString()}
                  </p>
                  {notification.requiresAction && (
                    <button
                      onClick={() => onRenewalRequest(notification.id)}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                    >
                      Request Renewal
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {displayNotifications.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            No notifications to display
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Bell className="w-4 h-4" />
            <span>
              {notifications.filter(n => n.requiresAction).length} documents require attention
            </span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Refresh Status
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentExpiryNotification;