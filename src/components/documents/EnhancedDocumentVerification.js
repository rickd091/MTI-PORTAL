// src/components/documents/EnhancedDocumentVerification.js
import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Clock,
  RefreshCw,
  Eye
} from 'lucide-react';

const EnhancedDocumentVerification = () => {
  const [documents, setDocuments] = useState({
    required: [
      {
        id: 1,
        type: 'REGISTRATION',
        title: 'Institution Registration Certificate',
        status: 'pending',
        verificationSteps: [
          { title: 'Document Authenticity', status: 'pending' },
          { title: 'Information Verification', status: 'pending' },
          { title: 'Authority Validation', status: 'pending' }
        ]
      },
      // Add more required documents
    ],
    supporting: [
      // Supporting documents
    ]
  });

  const verificationStatuses = {
    pending: { icon: Clock, color: 'text-yellow-500' },
    checking: { icon: RefreshCw, color: 'text-blue-500' },
    verified: { icon: CheckCircle, color: 'text-green-500' },
    rejected: { icon: XCircle, color: 'text-red-500' }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Document Verification</h2>
        
        {/* Document Groups */}
        {Object.entries(documents).map(([group, docs]) => (
          <div key={group} className="mt-6">
            <h3 className="text-lg font-semibold capitalize mb-4">{group} Documents</h3>
            <div className="space-y-4">
              {docs.map(doc => (
                <div key={doc.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{doc.title}</h4>
                      <div className="flex items-center mt-2">
                        {verificationStatuses[doc.status].icon && (
                          <verificationStatuses[doc.status].icon 
                            className={`w-4 h-4 mr-2 ${verificationStatuses[doc.status].color}`} 
                          />
                        )}
                        <span className="text-sm capitalize">{doc.status}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 hover:bg-gray-100 rounded-full">
                        <Eye className="w-4 h-4" />
                      </button>
                      {/* Add more action buttons */}
                    </div>
                  </div>

                  {/* Verification Steps */}
                  <div className="mt-4 border-t pt-4">
                    <div className="grid grid-cols-3 gap-4">
                      {doc.verificationSteps.map((step, index) => (
                        <div key={index} className="text-center">
                          <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center
                            ${step.status === 'verified' ? 'bg-green-100' : 'bg-gray-100'}`}>
                            {step.status === 'verified' ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <span className="text-sm">{index + 1}</span>
                            )}
                          </div>
                          <p className="text-sm mt-2">{step.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};