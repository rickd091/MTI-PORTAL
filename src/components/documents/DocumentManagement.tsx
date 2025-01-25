//src/components/documents/DocumentManagement.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { AlertCircle, Upload, FileText, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Document, DocumentStatus, WorkflowState } from '../../types/core';
import { useAuth } from '../../contexts/AuthContext';
import { ErrorBoundary } from '../error/ErrorBoundary';

// Enhanced interfaces
interface FileValidation {
  maxSize: number;
  maxFiles: number;
  allowedTypes: string[];
}

interface DocumentError {
  code: string;
  message: string;
  details?: any;
}

interface DocumentStatusTracking {
  lastUpdated: string;
  currentStatus: DocumentStatus;
  statusHistory: Array<{
    status: DocumentStatus;
    timestamp: string;
    updatedBy: string;
  }>;
}

interface DocumentUploadState {
  progress: number;
  error: string | null;
  validationErrors: string[];
  status: 'idle' | 'validating' | 'uploading' | 'completed' | 'error';
}

interface DocumentManagementProps {
  initialDocuments?: Document[];
  onDocumentUpdate?: (document: Document) => void;
  onError?: (error: Error) => void;
  validation?: FileValidation;
  maxUploads?: number;
  allowMultiple?: boolean;
  showProgress?: boolean;
  autoUpload?: boolean;
}

// Default validation settings
const defaultValidation: FileValidation = {
  maxSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 10,
  allowedTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png'
  ]
};

export const DocumentManagement: React.FC<DocumentManagementProps> = ({
  initialDocuments = [],
  onDocumentUpdate,
  onError,
  validation = defaultValidation,
  maxUploads = 10,
  allowMultiple = true,
  showProgress = true,
  autoUpload = true
}) => {
  const { role, user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [uploadState, setUploadState] = useState<Record<string, DocumentUploadState>>({});
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  // File validation
  const validateFile = useCallback((file: File): string[] => {
    const errors: string[] = [];
    
    if (file.size > validation.maxSize) {
      errors.push(`File ${file.name} exceeds ${validation.maxSize / (1024 * 1024)}MB limit`);
    }
    
    if (!validation.allowedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} not allowed for ${file.name}. Allowed types: ${validation.allowedTypes.join(', ')}`);
    }
    
    return errors;
  }, [validation]);

  // Batch validation
  const validateFiles = useCallback((files: FileList | File[]): { valid: File[]; errors: string[] } => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    if (files.length > validation.maxFiles) {
      errors.push(`Maximum ${validation.maxFiles} files allowed`);
      return { valid: [], errors };
    }

    Array.from(files).forEach(file => {
      const fileErrors = validateFile(file);
      if (fileErrors.length === 0) {
        validFiles.push(file);
      } else {
        errors.push(...fileErrors);
      }
    });

    return { valid: validFiles, errors };
  }, [validateFile, validation.maxFiles]);

  // Handle file upload
  const handleFileUpload = useCallback(async (files: FileList | File[]) => {
    const { valid: validFiles, errors } = validateFiles(files);
    
    if (errors.length > 0) {
      onError?.(new Error(errors.join('\n')));
      return;
    }

    const uploadPromises = validFiles.map(async (file) => {
      const docId = Math.random().toString(36).substring(7);
      
      setUploadState(prev => ({
        ...prev,
        [docId]: { 
          progress: 0, 
          error: null,
          validationErrors: [],
          status: 'uploading'
        }
      }));

      try {
        // Simulated upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 200));
          setUploadState(prev => ({
            ...prev,
            [docId]: { 
              ...prev[docId], 
              progress,
              status: progress === 100 ? 'completed' : 'uploading'
            }
          }));
        }

        const newDocument: Document = {
          id: docId,
          name: file.name,
          type: file.type,
          size: file.size,
          file,
          uploadDate: new Date().toISOString(),
          status: 'pending',
          workflowState: 'draft',
          history: [{
            state: 'draft',
            timestamp: new Date().toISOString(),
            user: user?.id || 'system'
          }]
        };

        setDocuments(prev => [...prev, newDocument]);
        onDocumentUpdate?.(newDocument);

        return newDocument;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        setUploadState(prev => ({
          ...prev,
          [docId]: { 
            ...prev[docId], 
            error: errorMessage,
            status: 'error'
          }
        }));
        onError?.(error instanceof Error ? error : new Error(errorMessage));
        throw error;
      }
    });

    try {
      await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Some uploads failed:', error);
    }
  }, [validateFiles, onDocumentUpdate, onError, user?.id]);

  // Handle drag and drop
  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  }, [handleFileUpload]);

  // Handle document actions
  const handleDocumentAction = useCallback((documentId: string, action: 'approve' | 'reject' | 'delete') => {
    setDocuments(prev => {
      const updatedDocs = prev.map(doc => {
        if (doc.id === documentId) {
          const newState: WorkflowState = 
            action === 'approve' ? 'approved' :
            action === 'reject' ? 'rejected' : doc.workflowState;

          const updatedDoc = {
            ...doc,
            status: action === 'approve' ? 'valid' as DocumentStatus : doc.status,
            workflowState: newState,
            history: [
              ...doc.history,
              {
                state: newState,
                timestamp: new Date().toISOString(),
                user: user?.id || 'system'
              }
            ]
          };

          onDocumentUpdate?.(updatedDoc);
          return updatedDoc;
        }
        return doc;
      });

      return action === 'delete' 
        ? updatedDocs.filter(doc => doc.id !== documentId)
        : updatedDocs;
    });
  }, [user?.id, onDocumentUpdate]);

  // Status indicator component
  const StatusIndicator: React.FC<{ status: DocumentStatus }> = ({ status }) => {
    const statusConfig = {
      pending: { icon: AlertCircle, className: 'text-yellow-500' },
      valid: { icon: CheckCircle, className: 'text-green-500' },
      invalid: { icon: XCircle, className: 'text-red-500' }
    };

    const { icon: Icon, className } = statusConfig[status as keyof typeof statusConfig] || 
      statusConfig.pending;

    return <Icon className={`w-4 h-4 ${className}`} />;
  };

  return (
    <ErrorBoundary
      fallback={
        <div className="p-4 bg-red-50 rounded-lg">
          <AlertCircle className="w-6 h-6 text-red-500 mb-2" />
          <p className="text-red-700">Error loading document management</p>
        </div>
      }
    >
      <Card>
        <CardContent className="space-y-6 p-6">
          {/* Upload Area */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed rounded-lg p-6 text-center"
          >
            <input
              type="file"
              multiple={allowMultiple}
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
              id="document-upload"
              accept={validation.allowedTypes.join(',')}
            />
            <label
              htmlFor="document-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <span className="text-sm text-gray-600">
                Drag and drop files here or click to upload
              </span>
              <span className="text-xs text-gray-500 mt-2">
                Allowed types: {validation.allowedTypes.map(type => type.split('/')[1]).join(', ')}
              </span>
              <span className="text-xs text-gray-500">
                Max size: {validation.maxSize / (1024 * 1024)}MB
              </span>
            </label>
          </div>

          {/* Document List */}
          <div className="space-y-4">
            {documents.map(doc => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-gray-500">
                        {(doc.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <StatusIndicator status={doc.status} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {role === 'admin' && (
                    <>
                      <button
                        onClick={() => handleDocumentAction(doc.id, 'approve')}
                        className="px-3 py-1 bg-green-600 text-white rounded-md text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleDocumentAction(doc.id, 'reject')}
                        className="px-3 py-1 bg-red-600 text-white rounded-md text-sm"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDocumentAction(doc.id, 'delete')}
                    className="px-3 py-1 bg-gray-600 text-white rounded-md text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Upload Progress */}
          {showProgress && Object.entries(uploadState).map(([docId, state]) => (
            state.progress < 100 && !state.error && (
              <div key={docId} className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-blue-700">Uploading...</span>
                  <span className="text-sm text-blue-700">{state.progress}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${state.progress}%` }}
                  />
                </div>
              </div>
            )
          ))}
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};