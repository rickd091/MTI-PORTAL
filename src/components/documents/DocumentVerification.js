// src/components/documents/DocumentVerification.js
import { FileText, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import React, { useState } from 'react';

const DocumentVerification = ({ document, onVerify }) => {
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [verificationNotes, setVerificationNotes] = useState('');

  const handleVerification = (status) => {
    setVerificationStatus(status);
    onVerify({ status, notes: verificationNotes });
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-medium">{document.title}</h4>
          <p className="text-sm text-gray-500">{document.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleVerification('approved')}
            className="p-2 text-green-600 hover:bg-green-50 rounded-full"
          >
            <CheckCircle />
          </button>
          <button
            onClick={() => handleVerification('rejected')}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full"
          >
            <XCircle />
          </button>
        </div>
      </div>

      <textarea
        className="mt-4 w-full border rounded-md p-2"
        placeholder="Add verification notes..."
        value={verificationNotes}
        onChange={(e) => setVerificationNotes(e.target.value)}
      />
    </div>
  );
};

export default DocumentVerification;