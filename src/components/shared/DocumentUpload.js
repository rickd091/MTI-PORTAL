//src/components/shared/DocumentUpload.js

import React, { useState } from 'react';
import { Upload, X, CheckCircle, AlertTriangle } from 'lucide-react';

const REQUIRED_DOCUMENTS = {
  mti_application: [
    { id: 'paq', name: 'Pre-Audit Questionnaire', required: true },
    { id: 'facility_photos', name: 'Facility Photos', required: true },
    { id: 'staff_cvs', name: 'Staff CVs', required: true },
    { id: 'course_materials', name: 'Course Materials', required: true },
    { id: 'quality_manual', name: 'Quality Manual', required: true }
  ],
  instructor: [
    { id: 'cv', name: 'Curriculum Vitae', required: true },
    { id: 'certificates', name: 'Professional Certificates', required: true },
    { id: 'experience_letter', name: 'Experience Letters', required: true }
  ]
};

const DocumentUpload = ({ type, onUpload, onRemove }) => {
  const [documents, setDocuments] = useState({});
  const [errors, setErrors] = useState({});

  const handleFileChange = (docId, file) => {
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          [docId]: 'File size should not exceed 5MB'
        }));
        return;
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          [docId]: 'Only PDF, JPEG, and PNG files are allowed'
        }));
        return;
      }

      setDocuments(prev => ({
        ...prev,
        [docId]: file
      }));
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[docId];
        return newErrors;
      });
      onUpload(docId, file);
    }
  };

  const handleRemove = (docId) => {
    setDocuments(prev => {
      const newDocs = { ...prev };
      delete newDocs[docId];
      return newDocs;
    });
    onRemove(docId);
  };

  const requiredDocs = REQUIRED_DOCUMENTS[type] || [];

  return (
    <div className="space-y-4">
      {requiredDocs.map(doc => (
        <div key={doc.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="font-medium">
                {doc.name}
                {doc.required && <span className="text-red-500 ml-1">*</span>}
              </p>
              {errors[doc.id] && (
                <p className="text-sm text-red-500 mt-1">{errors[doc.id]}</p>
              )}
            </div>
            {documents[doc.id] ? (
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <button
                  onClick={() => handleRemove(doc.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(doc.id, e.target.files[0])}
                />
                <div className="flex items-center text-blue-600 hover:text-blue-700">
                  <Upload className="w-5 h-5 mr-1" />
                  <span>Upload</span>
                </div>
              </label>
            )}
          </div>
          {documents[doc.id] && (
            <p className="text-sm text-gray-500">
              {documents[doc.id].name}
            </p>
          )}
        </div>
      ))}

      {Object.keys(documents).length === requiredDocs.length ? (
        <div className="flex items-center text-green-600 mt-4">
          <CheckCircle className="w-5 h-5 mr-2" />
          <span>All required documents uploaded</span>
        </div>
      ) : (
        <div className="flex items-center text-yellow-600 mt-4">
          <AlertTriangle className="w-5 h-5 mr-2" />
          <span>Please upload all required documents</span>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;