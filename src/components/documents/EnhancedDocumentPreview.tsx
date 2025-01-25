//src/components/documents/EnhancedDocumentPreview.tsx
import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Image, 
  File, 
  Download, 
  Eye, 
  Trash2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Document, 
  DocumentPreviewProps,
  ValidationResult 
} from '../../types/document';

interface PreviewModalProps {
  document: Document;
  onClose: () => void;
}

interface EnhancedDocumentPreviewProps {
  document: Document;
  onRemove: () => void;
  onDownload: () => void;
  validationStatus: 'valid' | 'invalid' | 'pending';
  workflowState?: string;
  validationResult?: ValidationResult;
  showPreview?: boolean;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ document, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!document.file) return;

    const url = URL.createObjectURL(document.file);
    setPreviewUrl(url);
    setLoading(false);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [document.file]);

  const renderPreview = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-64 text-red-500">
          <AlertCircle className="w-6 h-6 mr-2" />
          {error}
        </div>
      );
    }

    if (!previewUrl) return null;

    if (document.type.startsWith('image/')) {
      return (
        <img
          src={previewUrl}
          alt={document.name}
          className="max-w-full max-h-[70vh] object-contain"
          onError={() => setError('Failed to load image')}
        />
      );
    }

    if (document.type === 'application/pdf') {
      return (
        <iframe
          src={previewUrl}
          className="w-full h-[70vh]"
          title={document.name}
        />
      );
    }

    return (
      <div className="flex items-center justify-center h-64">
        <File className="w-16 h-16 text-gray-400" />
        <p className="mt-2">Preview not available</p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium">{document.name}</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
            type="button"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {renderPreview()}
        </div>

        <div className="p-4 border-t">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">
                Size: {(document.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <p className="text-sm text-gray-500">
                Type: {document.type}
              </p>
            </div>
            <button
              onClick={() => {
                if (previewUrl) {
                  const a = document.createElement('a');
                  a.href = previewUrl;
                  a.download = document.name;
                  a.click();
                }
              }}
              className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md"
              type="button"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EnhancedDocumentPreview: React.FC<EnhancedDocumentPreviewProps> = ({
  document,
  onRemove,
  onDownload,
  validationStatus,
  workflowState,
  validationResult,
  showPreview = false
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(showPreview);

  const getIcon = () => {
    if (document.type.startsWith('image/')) return Image;
    return FileText;
  };

  const StatusIcon = validationStatus === 'valid' ? CheckCircle : AlertCircle;
  const Icon = getIcon();

  return (
    <>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <Icon className="w-8 h-8 text-blue-600 mt-1" />
              <div>
                <h4 className="font-medium text-gray-900">{document.name}</h4>
                <p className="text-sm text-gray-500">
                  {(document.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <div className="flex items-center mt-1">
                  <StatusIcon 
                    className={`w-4 h-4 mr-1 ${
                      validationStatus === 'valid' 
                        ? 'text-green-500' 
                        : validationStatus === 'invalid'
                        ? 'text-red-500'
                        : 'text-yellow-500'
                    }`} 
                  />
                  <span className="text-sm capitalize">
                    {validationStatus}
                  </span>
                </div>
                {workflowState && (
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-full mt-2 inline-block">
                    {workflowState}
                  </span>
                )}
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setIsPreviewOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-full"
                title="Preview"
                type="button"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={onDownload}
                className="p-2 hover:bg-gray-100 rounded-full"
                title="Download"
                type="button"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={onRemove}
                className="p-2 hover:bg-gray-100 rounded-full text-red-500"
                title="Remove"
                type="button"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {validationResult && validationResult.errors.length > 0 && (
            <div className="mt-4 p-3 bg-red-50 rounded-md">
              <div className="flex items-center text-red-700">
                <AlertCircle className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Validation Errors</span>
              </div>
              <ul className="mt-2 text-sm text-red-600 list-disc list-inside">
                {validationResult.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {isPreviewOpen && (
        <PreviewModal
          document={document}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}
    </>
  );
};

export default EnhancedDocumentPreview;