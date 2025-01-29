import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { type DocumentInputs } from '@/lib/validation/institutionSchema';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Upload } from 'lucide-react';

const REQUIRED_DOCUMENTS = [
  { type: 'REGISTRATION_CERT', label: 'Registration Certificate' },
  { type: 'LICENSE', label: 'Operating License' },
  { type: 'SAFETY_CERT', label: 'Safety Certificate' },
  { type: 'QUALITY_MANUAL', label: 'Quality Management Manual' },
];

export function DocumentsStep() {
  const { register, control, formState: { errors } } = useFormContext<{ documents: DocumentInputs[] }>();
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

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Required Documents</h3>
      <p className="text-sm text-gray-500">
        Please upload the following documents in PDF, JPEG, PNG, or DOC/DOCX format.
        Maximum file size: 10MB per document.
      </p>

      <div className="space-y-4">
        {REQUIRED_DOCUMENTS.map((doc, index) => {
          const uploadedDoc = fields.find(f => f.document_type === doc.type);
          const error = errors.documents?.find(e => e?.document_type === doc.type);

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
                  {error && (
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
                    className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 border rounded-md hover: