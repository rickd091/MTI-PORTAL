//src/components/error/examples/ErrorHandlingExamples.tsx
import React, { useState } from 'react';
import { EnhancedErrorHandling } from '../EnhancedErrorHandling';

// Basic Usage Example
export const BasicExample: React.FC = () => {
  return (
    <EnhancedErrorHandling>
      <div>Protected content</div>
    </EnhancedErrorHandling>
  );
};

// Form Validation Example
export const FormExample: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const validateForm = () => {
    const errors = [];
    if (!formData.email.includes('@')) {
      errors.push('Invalid email format');
    }
    if (formData.password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }
    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
    // Submit form
  };

  return (
    <EnhancedErrorHandling>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={formData.email}
          onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
        />
        <input
          type="password"
          value={formData.password}
          onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
        />
        <button type="submit">Submit</button>
      </form>
    </EnhancedErrorHandling>
  );
};

// API Integration Example
export const ApiExample: React.FC = () => {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setData(data);
    } catch (error) {
      throw error;
    }
  };

  return (
    <EnhancedErrorHandling
      persistentErrors
      autoHideDuration={0}
      theme="dark"
    >
      <button onClick={fetchData}>Fetch Data</button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </EnhancedErrorHandling>
  );
};

// File Upload Example
export const FileUploadExample: React.FC = () => {
  const handleFileUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File too large');
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <EnhancedErrorHandling
      grouped
      position="top-right"
    >
      <input
        type="file"
        onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
      />
    </EnhancedErrorHandling>
  );
};

// Advanced Configuration Example
export const AdvancedExample: React.FC = () => {
  const handleError = (error: Error) => {
    console.error('Error logged:', error);
  };

  const handleClearError = () => {
    console.log('All errors cleared');
  };

  return (
    <EnhancedErrorHandling
      onError={handleError}
      onClearError={handleClearError}
      autoHideDuration={5000}
      maxErrors={3}
      showIcon={true}
      position="top-right"
      grouped={true}
      persistentErrors={false}
      theme="light"
    >
      {/* Your components */}
    </EnhancedErrorHandling>
  );
};

// Real-time Validation Example
export const RealTimeExample: React.FC = () => {
  const [value, setValue] = useState('');
  const [lastValidValue, setLastValidValue] = useState('');

  const validateInRealTime = (value: string) => {
    if (value.length > 10) {
      throw new Error('Input too long');
    }
    if (/[^a-zA-Z]/.test(value)) {
      throw new Error('Only letters allowed');
    }
    setLastValidValue(value);
  };

  return (
    <EnhancedErrorHandling
      autoHideDuration={2000}
    >
      <input
        type="text"
        value={value}
        onChange={e => {
          setValue(e.target.value);
          validateInRealTime(e.target.value);
        }}
      />
      <p>Last valid value: {lastValidValue}</p>
    </EnhancedErrorHandling>
  );
};