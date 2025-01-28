//src/components/shared/StatusBadge.js

import React from 'react';
import { CheckCircle, Clock, AlertTriangle, XCircle } from 'lucide-react';

const statusConfigs = {
  // Application Statuses
  pending_payment: { 
    color: 'bg-yellow-100 text-yellow-800', 
    icon: Clock,
    label: 'Pending Payment' 
  },
  document_verification: { 
    color: 'bg-blue-100 text-blue-800', 
    icon: CheckCircle,
    label: 'Under Verification' 
  },
  audit_scheduled: { 
    color: 'bg-purple-100 text-purple-800', 
    icon: Clock,
    label: 'Audit Scheduled' 
  },
  approved: { 
    color: 'bg-green-100 text-green-800', 
    icon: CheckCircle,
    label: 'Approved' 
  },
  rejected: { 
    color: 'bg-red-100 text-red-800', 
    icon: XCircle,
    label: 'Rejected' 
  },

  // Audit Statuses
  audit_scheduled: { 
    color: 'bg-blue-100 text-blue-800', 
    icon: Clock,
    label: 'Scheduled' 
  },
  audit_pending: { 
    color: 'bg-yellow-100 text-yellow-800', 
    icon: Clock,
    label: 'Pending' 
  },
  audit_overdue: { 
    color: 'bg-red-100 text-red-800', 
    icon: AlertTriangle,
    label: 'Overdue' 
  },
  audit_completed: { 
    color: 'bg-green-100 text-green-800', 
    icon: CheckCircle,
    label: 'Completed' 
  },

  // Payment Statuses
  payment_pending: { 
    color: 'bg-yellow-100 text-yellow-800', 
    icon: Clock,
    label: 'Payment Pending' 
  },
  payment_processing: { 
    color: 'bg-blue-100 text-blue-800', 
    icon: Clock,
    label: 'Processing' 
  },
  payment_completed: { 
    color: 'bg-green-100 text-green-800', 
    icon: CheckCircle,
    label: 'Paid' 
  },
  payment_failed: { 
    color: 'bg-red-100 text-red-800', 
    icon: XCircle,
    label: 'Payment Failed' 
  }
};

const StatusBadge = ({ status, showIcon = true }) => {
  const config = statusConfigs[status] || {
    color: 'bg-gray-100 text-gray-800',
    icon: Clock,
    label: status
  };

  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full ${config.color}`}>
      {showIcon && <Icon className="w-4 h-4 mr-2" />}
      <span className="text-sm font-medium capitalize">
        {config.label}
      </span>
    </span>
  );
};

export default StatusBadge;