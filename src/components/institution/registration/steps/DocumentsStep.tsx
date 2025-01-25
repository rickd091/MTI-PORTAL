//src/components/institution/registration/steps/DocumentsStep.tsx
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { Document } from '../../../../types/core';

interface DocumentsStepProps {
  formData: { documents: Record<string, Document> };
  setFormData: (data: any) => void;
}

const requiredDocuments = [
  {
    key: 'registrationCertificate',
    title: 'Registration Certificate',
    description: 'Official business registration certificate',
    required: true
  },
  {
    key: 'taxCompliance',
    title: 'Tax Compliance Certificate',
    description: 'Valid tax compliance certificate',
    required: true
  },
  {
    key: 'qualityManual',
    title: 'Quality Management Manual',
    description: 'Detailed quality management procedures',
    required: true
  },
  {
    key: 'staffCertifications',
    title: 'Staff Certifications',
    description: 'Trainer and staff qualification certificates',
    required: true
  },
  {
    key: 'facilityInspection',
    title: 'Facility Inspection Report',
    description: 'Recent facility inspection report',
    required: true
  }
];

const DocumentsStep: React.FC<DocumentsStepProps> = ({ formData, setFormData }) => {
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateFile = (file: File, documentKey: string) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];

    if (file.size > maxSize) {
      setErrors(prev => ({
        ...prev,
        [documentKey]: `File size must not exceed 10MB`
      }));
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({
        ...prev,
        [documentKey]: `Only PDF and images are allowed`
      }));
      return false;
    }

    return true;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, documentKey: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Clear previous error
    setErrors(prev => ({ ...prev, [documentKey]: '' }));

    if (!validateFile(file, documentKey)) {
      return;
    }

    // Simulate upload progress
    setUploadProgress(prev => ({ ...prev, [documentKey]: 0 }));
    
    try {
      // Simulate file upload with progress
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setUploadProgress(prev => ({ ...prev, [documentKey]: progress }));
      }

      // Update form data
      setFormData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [documentKey]: {
            id: documentKey,
            name: file.name,
            size: file.size,
            type: file.type,
            file,
            uploadDate: new Date().toISOString()
          }
        }
      }));
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        [documentKey]: 'Upload failed. Please try again.'
      }));
    }
  };

  const handleRemoveFile = (documentKey: string) => {
    setFormData(prev => {
      const newDocuments = { ...prev.documents };
      delete newDocuments[documentKey];
      return { ...prev, documents: newDocuments };
    });
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[documentKey];
      return newProgress;
    });
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[documentKey];
      return newErrors;
    });
  };

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Required Documents</h3>
          <p className="text-sm text-gray-500">
            Please upload all required documentation for your institution registration.
            Files must be in PDF or image format and not exceed 10MB.
          </p>
        </div>

        <div className="space-y-6">
          {requiredDocuments.map((doc) => (
            <div key={doc.key} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {doc.title}
                    {doc.required && <span className="text-red-500 ml-1">*</span>}
                  </h4>
                  <p className="text-sm text-gray-500">{doc.description}</p>
                </div>
              </div>

              {!formData.documents[doc.key] ? (
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  <input
                    type="file"
                    id={`file-${doc.key}`}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload(e, doc.key)}
                  />
                  <label
                    htmlFor={`file-${doc.key}`}
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Click to upload or drag and drop</span>
                    <span className="text-xs text-gray-500 mt-1">PDF or images up to 10MB</span>
                  </label>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">{formData.documents[doc.key].name}</p>
                      <p className="text-xs text-gray-500">
                        {(formData.documents[doc.key].size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFile(doc.key)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Upload Progress */}
              {uploadProgress[doc.key] !== undefined && uploadProgress[doc.key] < 100 && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress[doc.key]}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Uploading... {uploadProgress[doc.key]}%
                  </p>
                </div>
              )}

              {/* Error Message */}
              {errors[doc.key] && (
                <div className="mt-2 flex items-center text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors[doc.key]}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentsStep;