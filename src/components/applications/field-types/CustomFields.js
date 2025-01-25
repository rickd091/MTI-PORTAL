// src/components/applications/field-types/CustomFields.js
import React from 'react';

export const TableField = ({ value, onChange, columns }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col.key} className="px-4 py-2">{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {value.map((row, index) => (
          <tr key={index}>
            {columns.map(col => (
              <td key={col.key} className="px-4 py-2">
                <input
                  type={col.type || 'text'}
                  value={row[col.key]}
                  onChange={(e) => {
                    const newValue = [...value];
                    newValue[index][col.key] = e.target.value;
                    onChange(newValue);
                  }}
                  className="border rounded px-2 py-1"
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    <button
      onClick={() => onChange([...value, columns.reduce((acc, col) => ({...acc, [col.key]: ''}), {})])}
      className="mt-2 text-blue-600"
    >
      + Add Row
    </button>
  </div>
);

export const FileUploadField = ({ 
  value, 
  onChange, 
  acceptedTypes, 
  maxSize, 
  multiple 
}) => {
  const handleFileChange = (files) => {
    // Validate file types and size
    const validFiles = Array.from(files).filter(file => {
      const isValidType = acceptedTypes.some(type => file.type.includes(type));
      const isValidSize = file.size <= maxSize;
      return isValidType && isValidSize;
    });

    onChange(multiple ? validFiles : validFiles[0]);
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        multiple={multiple}
        accept={acceptedTypes.join(',')}
        onChange={(e) => handleFileChange(e.target.files)}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer inline-block px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
      >
        Choose File(s)
      </label>
      {value && (
        <div className="mt-2">
          {multiple ? (
            <ul className="space-y-1">
              {Array.from(value).map((file, index) => (
                <li key={index} className="text-sm text-gray-600">
                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-sm text-gray-600">
              {value.name} ({(value.size / 1024 / 1024).toFixed(2)} MB)
            </span>
          )}
        </div>
      )}
    </div>
  );
};