//src/components/institution/registration/steps/DocumentsStep.js
import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { documentCategories, documentRequirements } from '../../../../config/documentConfig';
import { FileText, AlertCircle, Eye, Download, X } from 'lucide-react';
import FileUploadHandler from '../../registration/FileUploadHandler';

const DocumentPreview = ({ document, onClose }) => {
  if (!document) return null;

  const isImage = document.type.startsWith('image/');
  const isPDF = document.type === 'application/pdf';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">{document.name}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-auto">
          {isImage && (
            <img
              src={URL.createObjectURL(document)}
              alt={document.name}
              className="max-w-full h-auto"
            />
          )}
          {isPDF && (
            <iframe
              src={URL.createObjectURL(document)}
              className="w-full h-full min-h-[500px]"
              title={document.name}
            />
          )}
          {!isImage && !isPDF && (
            <div className="flex items-center justify-center h-full">
              <p>Preview not available for this file type</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DocumentsStep = ({ formData = { documents: {} }, setFormData }) => {
  const [previewDocument, setPreviewDocument] = useState(null);
  const [errors, setErrors] = useState({});

  const validateDocument = useCallback((file, requirement) => {
    if (!file) return null;

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!requirement.acceptedTypes.includes(fileExtension)) {
      return `Invalid file type. Accepted types: ${requirement.acceptedTypes.join(', ')}`;
    }

    // Check file size
    if (file.size > requirement.maxSize) {
      return `File size exceeds ${requirement.maxSize / (1024 * 1024)}MB limit`;
    }

    return null;
  }, []);

  const handleFileUpload = useCallback((key, file, requirement) => {
    const error = validateDocument(file, requirement);
    
    if (error) {
      setErrors(prev => ({ ...prev, [key]: error }));
      return;
    }

    // Clear error if exists
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });

    // Compress image if needed
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set maximum dimensions
          const maxWidth = 1920;
          const maxHeight = 1080;
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });

            updateFormData(key, compressedFile);
          }, file.type, 0.8); // 80% quality
        };
      };
    } else {
      updateFormData(key, file);
    }
  }, [validateDocument]);

  const updateFormData = useCallback((key, file) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...(prev?.documents || {}),
        [key]: file
      }
    }));
  }, [setFormData]);

  const handleFileRemove = useCallback((key) => {
    setFormData(prev => {
      const newDocuments = { ...prev.documents };
      delete newDocuments[key];
      return {
        ...prev,
        documents: newDocuments
      };
    });

    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });
  }, [setFormData]);

  const renderDocumentsByCategory = useCallback(() => {
    const groupedDocuments = {};
    
    documentRequirements.forEach(doc => {
      if (!groupedDocuments[doc.category]) {
        groupedDocuments[doc.category] = [];
      }
      groupedDocuments[doc.category].push(doc);
    });

    return Object.entries(groupedDocuments).map(([category, docs]) => (
      <div key={category} className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          {documentCategories[category]}
        </h3>
        <div className="grid grid-cols-1 gap-6">
          {docs.map((doc) => (
            <div key={doc.key} className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {doc.label}
                    {doc.required && <span className="text-red-500 ml-1">*</span>}
                  </h4>
                  <p className="text-xs text-gray-500">{doc.description}</p>
                  {doc.validityYears && (
                    <p className="text-xs text-blue-600">
                      Validity: {doc.validityYears} year(s)
                    </p>
                  )}
                </div>
              </div>

              <FileUploadHandler
                onFileUpload={(file) => handleFileUpload(doc.key, file, doc)}
                onFileRemove={() => handleFileRemove(doc.key)}
                acceptedTypes={doc.acceptedTypes.join(',')}
                maxSize={doc.maxSize}
                label={`Upload ${doc.label}`}
                description={`Accepted types: ${doc.acceptedTypes.join(', ')} (up to ${doc.maxSize / (1024 * 1024)}MB)`}
                error={errors[doc.key]}
                currentFile={formData.documents?.[doc.key]}
                onPreview={() => setPreviewDocument(formData.documents?.[doc.key])}
              />
            </div>
          ))}
        </div>
      </div>
    ));
  }, [formData.documents, errors, handleFileUpload, handleFileRemove]);

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Important Note</AlertTitle>
          <AlertDescription>
            Please ensure all documents are clear, legible, and valid. 
            Documents not meeting the requirements may delay your registration process.
          </AlertDescription>
        </Alert>

        {renderDocumentsByCategory()}

        {Object.keys(errors).length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Please correct the following errors before proceeding:
              <ul className="list-disc list-inside mt-2">
                {Object.entries(errors).map(([key, error]) => (
                  <li key={key}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {previewDocument && (
          <DocumentPreview
            document={previewDocument}
            onClose={() => setPreviewDocument(null)}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentsStep;