//src/components/documents/EnhancedDocumentVerification.tsx
import React from 'react';
import { Check, X, Clock, AlertCircle } from 'lucide-react';

interface VerificationStatus {
  icon: typeof Check;
  color: string;
  label: string;
}

interface Document {
  id: string;
  status: keyof typeof verificationStatuses;
  name: string;
}

const verificationStatuses = {
  verified: {
    icon: Check,
    color: 'text-green-500',
    label: 'Verified'
  },
  rejected: {
    icon: X,
    color: 'text-red-500',
    label: 'Rejected'
  },
  pending: {
    icon: Clock,
    color: 'text-yellow-500',
    label: 'Pending'
  },
  error: {
    icon: AlertCircle,
    color: 'text-red-500',
    label: 'Error'
  }
} as const;

interface Props {
  documents: Document[];
}

const EnhancedDocumentVerification: React.FC<Props> = ({ documents }) => {
  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <div key={doc.id} className="flex items-center space-x-2">
          <span className="flex items-center">
            {React.createElement(verificationStatuses[doc.status].icon, {
              className: `w-4 h-4 mr-2 ${verificationStatuses[doc.status].color}`
            })}
            <span className={verificationStatuses[doc.status].color}>
              {verificationStatuses[doc.status].label}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
};

export default EnhancedDocumentVerification;