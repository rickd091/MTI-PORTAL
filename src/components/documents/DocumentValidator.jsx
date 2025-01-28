//src/components/documents/DocumentValidator.js
import { Upload, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import React, { useState } from 'react';

const DocumentValidator = ({ 
  document, 
  validationRules, 
  onValidate, 
  onReject 
}) => {
  const [validationStatus, setValidationStatus] = useState('pending');
  const [validationErrors, setValidationErrors] = useState([]);

  const validateDocument = async (file) => {
    const errors = [];

    // File type validation
    if (validationRules.allowedTypes && 
        !validationRules.allowedTypes.includes(file.type)) {
      errors.push(`Invalid file type. Allowed types: ${validationRules.allowedTypes.join(', ')}`);
    }

    // File size validation
    if (validationRules.maxSize && file.size > validationRules.maxSize) {
      errors.push(`File size exceeds maximum allowed size of ${validationRules.maxSize / 1024 / 1024}MB`);
    }

    // Additional custom validations
    if (validationRules.customValidation) {
      try {
        const customErrors = await validationRules.customValidation(file);
        errors.push(...customErrors);
      } catch (error) {
        errors.push('Error performing custom validation');
      }
    }

    setValidationErrors(errors);
    setValidationStatus(errors.length === 0 ? 'valid' : 'invalid');
    return errors.length === 0;
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium">{document?.name}</h4>
          <p className="text-sm text-gray-500">{document?.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          {validationStatus === 'pending' && (
            <button
              onClick={() => validateDocument(document?.file)}
              className="flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-md"
            >
              <Upload className="w-4 h-4 mr-1" />
              Validate
            </button>
          )}
          {validationStatus === 'valid' && (
            <span className="flex items-center text-green-600">
              <CheckCircle className="w-4 h-4 mr-1" />
              Valid
            </span>
          )}
          {validationStatus === 'invalid' && (
            <span className="flex items-center text-red-600">
              <XCircle className="w-4 h-4 mr-1" />
              Invalid
            </span>
          )}
        </div>
      </div>

      {validationErrors.length > 0 && (
        <div className="mt-4 p-3 bg-red-50 rounded-md">
          <div className="flex items-center mb-2">
            <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
            <span className="text-sm font-medium text-red-700">
              Validation Errors
            </span>
          </div>
          <ul className="list-disc list-inside text-sm text-red-600">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DocumentValidator;