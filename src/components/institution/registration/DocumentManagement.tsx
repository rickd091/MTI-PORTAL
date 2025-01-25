//src/components/institution/registration/DocumentManagement.tsx
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload, RefreshCw, X, Check } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Document {
  id: string;
  name: string;
  status: string;
  expiryDate?: string;
}

interface DocumentManagementProps {
  documents: Record<string, Document>;
  onRenewalRequest: (id: string) => void;
  onDocumentUpload: (id: string, file: File) => void;
  checkDocumentStatus: (id: string) => string;
}

const DocumentManagement = ({ 
  documents, 
  onRenewalRequest, 
  onDocumentUpload,
  checkDocumentStatus 
}: DocumentManagementProps) => {
  const [uploadError, setUploadError] = useState<string | null>(null);

  const documentTypes = [
    { 
      id: 'registrationCertificate', 
      label: 'Registration Certificate',
      required: true 
    },
    { 
      id: 'taxCompliance', 
      label: 'Tax Compliance Certificate',
      required: true 
    },
    { 
      id: 'qmsManual', 
      label: 'Quality Management System Manual',
      required: true 
    },
    { 
      id: 'insuranceCertificate', 
      label: 'Insurance Certificate',
      required: true 
    }
  ];

  const handleFileUpload = async (documentId: string, file: File) => {
    try {
      setUploadError(null);
      
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload PDF or DOC/DOCX files only.');
      }

      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        throw new Error('File size exceeds 10MB limit.');
      }

      await onDocumentUpload(documentId, file);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'text-green-500';
      case 'pending_validation':
        return 'text-yellow-500';
      case 'expired':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'pending_validation':
        return <RefreshCw className="w-4 h-4 text-yellow-500" />;
      case 'expired':
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return <Upload className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {uploadError && (
        <div className="p-4 bg-red-50 text-red-600 rounded-md">
          {uploadError}
        </div>
      )}

      {documentTypes.map(({ id, label, required }) => {
        const doc = documents[id];
        const status = checkDocumentStatus(id);
        const isExpiredOrMissing = status === 'expired' || status === 'missing';

        return (
          <div key={id} className="border rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-gray-500" />
                <div>
                  <h4 className="font-medium text-gray-900">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                  </h4>
                  {doc?.expiryDate && (
                    <p className="text-sm text-gray-500">
                      Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`flex items-center ${getStatusColor(status)}`}>
                  {getStatusIcon(status)}
                  <span className="ml-1 text-sm">
                    {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                  </span>
                </span>
                
                {isExpiredOrMissing ? (
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(id, file);
                      }}
                    />
                    <button
                      type="button"
                      className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50 flex items-center space-x-1"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload</span>
                    </button>
                  </label>
                ) : (
                  status === 'expired' && (
                    <button
                      type="button"
                      onClick={() => onRenewalRequest(id)}
                      className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50 flex items-center space-x-1"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Renew</span>
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DocumentManagement;