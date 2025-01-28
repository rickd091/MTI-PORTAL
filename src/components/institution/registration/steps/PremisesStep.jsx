// src/components/institution/registration/steps/PremisesStep.js
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Upload } from 'lucide-react';

const FilePreview = ({ document, onRemove }) => (
  <div className="border rounded-lg p-4 mb-4 bg-gray-50">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div>
          <h4 className="font-medium">{document.name}</h4>
          <p className="text-sm text-gray-500">
            {(document.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={onRemove}
          className="px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md"
        >
          Remove
        </button>
      </div>
    </div>
  </div>
);

const PremisesStep = ({ formData = { premises: {} }, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      premises: {
        ...(prev?.premises || {}),
        [name]: value
      }
    }));
  };

  const handleFileUpload = (e) => {
    const { name, files } = e.target;
    if (files?.length) {
      const file = files[0];
      const fileData = {
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file)
      };
      
      setFormData(prev => ({
        ...prev,
        premises: {
          ...(prev?.premises || {}),
          [name]: fileData
        }
      }));
    }
  };

  const handleFileRemove = (fieldName) => {
    setFormData(prev => ({
      ...prev,
      premises: {
        ...(prev?.premises || {}),
        [fieldName]: null
      }
    }));
  };

  const premises = formData?.premises || {};

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Premise Status
            </label>
            <select
              name="premiseStatus"
              value={premises.premiseStatus || ''}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Status</option>
              <option value="OWNED">Owned</option>
              <option value="LEASED">Leased</option>
            </select>
          </div>

          {premises.premiseStatus === 'LEASED' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lease Expiry Date
              </label>
              <input
                type="date"
                name="leaseExpiryDate"
                value={premises.leaseExpiryDate || ''}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Ownership Documentation</h4>
          
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <input
              type="file"
              name="ownershipDocument"
              onChange={handleFileUpload}
              className="hidden"
              id="ownershipDocument"
              accept=".pdf,.doc,.docx"
            />
            <label 
              htmlFor="ownershipDocument"
              className="cursor-pointer flex flex-col items-center space-y-2"
            >
              <Upload className="w-8 h-8 text-gray-400" />
              <span className="text-sm text-gray-600">
                Upload ownership documentation
              </span>
              <span className="text-xs text-gray-500">
                (PDF, DOC, DOCX up to 10MB)
              </span>
            </label>
          </div>

          {premises.ownershipDocument && (
            <FilePreview
              document={premises.ownershipDocument}
              onRemove={() => handleFileRemove('ownershipDocument')}
            />
          )}
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Additional Information</h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Description
            </label>
            <textarea
              name="propertyDescription"
              value={premises.propertyDescription || ''}
              onChange={handleChange}
              rows={4}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the property and its facilities"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PremisesStep;