// src/components/common/FileUpload.js
import { Upload, X, File, Check } from 'lucide-react';
import React, { useState, useRef } from 'react';

const FileUpload = ({
  accept,
  maxSize = 5 * 1024 * 1024, // 5MB default
  multiple = false,
  onUpload,
  validation = {}
}) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    setError(null);

    // Validate files
    for (const file of selectedFiles) {
      // Size validation
      if (file.size > maxSize) {
        setError(`File ${file.name} exceeds maximum size of ${maxSize / 1024 / 1024}MB`);
        return;
      }

      // Type validation
      if (accept && !accept.split(',').some(type => file.type.match(type.trim()))) {
        setError(`File ${file.name} is not of accepted type`);
        return;
      }
    }

    try {
      setUploading(true);
      const uploadedFiles = await Promise.all(
        selectedFiles.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          
          // Handle file upload
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
          });

          if (!response.ok) throw new Error('Upload failed');
          
          const data = await response.json();
          return {
            ...file,
            id: data.fileId,
            url: data.fileUrl
          };
        })
      );

      setFiles(prev => [...prev, ...uploadedFiles]);
      onUpload && onUpload(multiple ? uploadedFiles : uploadedFiles[0]);
    } catch (error) {
      setError('Failed to upload file(s)');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (fileToRemove) => {
    setFiles(prev => prev.filter(file => file.id !== fileToRemove.id));
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-400'
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
        />
        
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-1">Drag and drop or click to select files</p>
          <p className="text-sm text-gray-500">
            {accept ? `Accepted formats: ${accept}` : 'All file types accepted'}
          </p>
          <p className="text-sm text-gray-500">
            Max size: {maxSize / 1024 / 1024}MB
          </p>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600">
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center">
                <File className="w-5 h-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(1)}KB
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFile(file)}
                className="p-1 hover:bg-gray-200 rounded-full"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;