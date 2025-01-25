//src/components/registration/BatchUploadHandler.js
import React, { useState, useCallback } from 'react';
import { Upload, X, AlertCircle, Check } from 'lucide-react';
import { Alert } from '@/components/ui/alert';

const BatchUploadHandler = ({ 
  acceptedTypes,
  maxFiles = 10,
  maxSizePerFile = 10 * 1024 * 1024, // 10MB
  onUploadComplete
}) => {
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const validateFile = (file) => {
    const errors = [];
    
    // Check file type
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      errors.push(`Invalid file type: ${file.name}. Accepted types: ${acceptedTypes.join(', ')}`);
    }

    // Check file size
    if (file.size > maxSizePerFile) {
      errors.push(`File too large: ${file.name}. Maximum size: ${maxSizePerFile / (1024 * 1024)}MB`);
    }

    return errors;
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    
    if (droppedFiles.length > maxFiles) {
      setErrors([`Maximum ${maxFiles} files allowed`]);
      return;
    }

    let newErrors = [];
    const validFiles = droppedFiles.filter(file => {
      const fileErrors = validateFile(file);
      if (fileErrors.length > 0) {
        newErrors = [...newErrors, ...fileErrors];
        return false;
      }
      return true;
    });

    setErrors(newErrors);
    setFiles(prev => [...prev, ...validFiles]);
  }, [maxFiles, acceptedTypes, maxSizePerFile]);

  const handleFileSelect = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (selectedFiles.length > maxFiles) {
      setErrors([`Maximum ${maxFiles} files allowed`]);
      return;
    }

    let newErrors = [];
    const validFiles = selectedFiles.filter(file => {
      const fileErrors = validateFile(file);
      if (fileErrors.length > 0) {
        newErrors = [...newErrors, ...fileErrors];
        return false;
      }
      return true;
    });

    setErrors(newErrors);
    setFiles(prev => [...prev, ...validFiles]);
  }, [maxFiles, acceptedTypes, maxSizePerFile]);

  const uploadFiles = async () => {
    setUploading(true);
    const uploadPromises = files.map(async (file) => {
      try {
        // Simulate file upload with progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 200));
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: progress
          }));
        }

        return {
          success: true,
          file: file,
          url: URL.createObjectURL(file)
        };
      } catch (error) {
        return {
          success: false,
          file: file,
          error: error.message
        };
      }
    });

    const results = await Promise.all(uploadPromises);
    setUploading(false);
    onUploadComplete(results);
  };

  const removeFile = (fileName) => {
    setFiles(prev => prev.filter(file => file.name !== fileName));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileName];
      return newProgress;
    });
  };

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed rounded-lg p-6 text-center"
      >
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          accept={acceptedTypes.join(',')}
          className="hidden"
          id="batch-file-upload"
        />
        
        <label 
          htmlFor="batch-file-upload"
          className="cursor-pointer flex flex-col items-center space-y-2"
        >
          <Upload className="w-8 h-8 text-gray-400" />
          <span className="text-sm text-gray-600">
            Drag and drop files here or click to select
          </span>
          <span className="text-xs text-gray-500">
            Maximum {maxFiles} files (up to {maxSizePerFile / (1024 * 1024)}MB each)
          </span>
        </label>
      </div>

      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <div className="ml-2">
            <h5 className="font-medium">Upload Errors</h5>
            <ul className="list-disc list-inside mt-1">
              {errors.map((error, index) => (
                <li key={index} className="text-sm">{error}</li>
              ))}
            </ul>
          </div>
        </Alert>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.name}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="text-sm">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {uploadProgress[file.name] !== undefined && (
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${uploadProgress[file.name]}%` }}
                    />
                  </div>
                )}
                <button
                  onClick={() => removeFile(file.name)}
                  className="p-1 hover:bg-gray-200 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <button
              onClick={uploadFiles}
              disabled={uploading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload All Files'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchUploadHandler;