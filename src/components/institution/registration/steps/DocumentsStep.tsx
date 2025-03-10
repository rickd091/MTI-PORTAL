import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { type DocumentInputs } from '@/lib/validation/institutionSchema';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Upload } from 'lucide-react';
import { FieldError } from 'react-hook-form';

// Define interfaces for better type safety
interface DocumentError extends FieldError {
  document_type?: string;
  message?: string;
}

const REQUIRED_DOCUMENTS = [
  { type: 'REGISTRATION_CERT', label: 'Registration Certificate' },
  { type: 'LICENSE', label: 'Operating License' },
  { type: 'SAFETY_CERT', label: 'Safety Certificate' },
  { type: 'QUALITY_MANUAL', label: 'Quality Management Manual' },
];

export function DocumentsStep() {
  const { control, formState: { errors } } = useFormContext<{ documents: DocumentInputs[] }>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'documents'
  });

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // File will be validated by Zod schema
      append({ document_type: REQUIRED_DOCUMENTS[index].type, file });
    }
  };

  // Type guard function to check if an object is a DocumentError
  const isDocumentError = (obj: any): obj is DocumentError => {
    return obj && typeof obj === 'object' && 'document_type' in obj;
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Required Documents</h3>
      <p className="text-sm text-gray-500">
        Please upload the following documents in PDF, JPEG, PNG, or DOC/DOCX format.
        Maximum file size: 10MB per document.
      </p>

      <div className="space-y-4">
        {REQUIRED_DOCUMENTS.map((doc, index) => {
          // Find the uploaded document with proper type assertion
          const uploadedDoc = fields.find(
            (f) => f && typeof f === 'object' && 'document_type' in f && f.document_type === doc.type
          ) as unknown as (DocumentInputs & { file: File }) | undefined;
          
          // Safely handle errors with proper type checking
          const documentErrors = Array.isArray(errors.documents) ? errors.documents : [];
          const error = documentErrors.find(err => isDocumentError(err) && err.document_type === doc.type);

          return (
            <div key={doc.type} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{doc.label}</h4>
                  {uploadedDoc && (
                    <p className="text-sm text-gray-500 mt-1">
                      {uploadedDoc.file.name} ({(uploadedDoc.file.size / 1024 / 1024).toFixed(2)}MB)
                    </p>
                  )}
                  {error && error.message && (
                    <p className="text-sm text-red-600 mt-1">{error.message}</p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    id={`file-${doc.type}`}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(index, e)}
                  />
                  <label
                    htmlFor={`file-${doc.type}`}
                    className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 border rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Upload className="h-4 w-4" />
                    <span>{uploadedDoc ? 'Replace' : 'Upload'}</span>
                  </label>
                  
                  {uploadedDoc && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => remove(fields.findIndex((f: { document_type: string }) => f.document_type === doc.type))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <Button type="button" variant="outline" className="w-full mt-4">
        <Plus className="h-4 w-4 mr-2" />
        Add Additional Document
      </Button>
    </div>
  );
}