// src/components/applications/DocumentPreview.js
import { FileText, X, Download } from 'lucide-react';
import React from 'react';

const DocumentPreview = ({ document, onRemove }) => {
  return (
    <div className="border rounded-lg p-4 mb-4 bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <FileText className="w-8 h-8 text-blue-600" />
          <div>
            <h4 className="font-medium">{document.name}</h4>
            <p className="text-sm text-gray-500">
              {(document.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => window.open(document.url, '_blank')}
            className="p-2 hover:bg-gray-200 rounded-full"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={onRemove}
            className="p-2 hover:bg-gray-200 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;