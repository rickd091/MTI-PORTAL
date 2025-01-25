src/components/institution/registration/DocumentManagement.js
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload, RefreshCw, X, Check } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const DocumentManagement = ({ 
  documents, 
  onRenewalRequest, 
  onDocumentUpload,
  checkDocumentStatus 
}) => {
  const [uploadError, setUploadError] = useState(null);

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

  const handleFileUpload = async (documentId, file) => {
    try {
      setUploadError(null);
      
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload PDF or DOC/DOCX files only.');
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        throw new Error('File size exceeds 10MB limit.');
      }

      await onDocumentUpload(documentId, file);
    } catch (error) {
      setUploadError(error.message);
      console.error('Document upload error:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      valid: 'text-green-500',
      pending_validation: 'text-yellow-500',
      expired: 'text-red-500',
      missing: 'text-gray-400'
    };
    return colors[status] || 'text-gray-500';
  };

  const getStatusIcon = (status) => {
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
        <Alert variant="destructive">
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}

      {documentTypes.map(({ id, label, required }) => {
        const doc = documents[id];
        const status = checkDocumentStatus(id);
        const isExpiredOrMissing = status === 'expired' || status === 'missing';

        return (
          <Card key={id} className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {label}
                      {required && <span className="text-red-500 ml-1">*</span>}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {doc?.expiryDate && `Expires: ${new Date(doc.expiryDate).toLocaleDateString()}`}
                    </p>
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
                        onChange={(e) => handleFileUpload(id, e.target.files[0])}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload</span>
                      </Button>
                    </label>
                  ) : (
                    status === 'expired' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRenewalRequest(id)}
                        className="flex items-center space-x-1"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Renew</span>
                      </Button>
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DocumentManagement;