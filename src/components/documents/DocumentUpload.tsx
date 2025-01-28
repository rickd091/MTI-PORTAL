import React, { useState, useCallback } from "react";
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react";
import { DocumentService } from "@/services/DocumentService";

interface Props {
  onUpload: (document: any) => void;
  accept?: string;
  maxSize?: number;
  metadata?: Record<string, any>;
}

export default function DocumentUpload({
  onUpload,
  accept = ".pdf,.doc,.docx",
  maxSize = 10 * 1024 * 1024,
  metadata = {},
}: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      setError(null);

      const file = e.dataTransfer.files[0];
      if (!file) return;

      // Validate file type
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
      if (!accept.split(",").includes(fileExtension)) {
        setError(`Invalid file type. Accepted types: ${accept}`);
        return;
      }

      // Validate file size
      if (file.size > maxSize) {
        setError(`File too large. Maximum size: ${maxSize / (1024 * 1024)}MB`);
        return;
      }

      try {
        setUploading(true);
        const document = await DocumentService.upload(file, metadata);
        onUpload(document);
      } catch (error) {
        setError("Failed to upload file");
        console.error("Upload error:", error);
      } finally {
        setUploading(false);
      }
    },
    [accept, maxSize, metadata, onUpload],
  );

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        setUploading(true);
        setError(null);
        const document = await DocumentService.upload(file, metadata);
        onUpload(document);
      } catch (error) {
        setError("Failed to upload file");
        console.error("Upload error:", error);
      } finally {
        setUploading(false);
      }
    },
    [metadata, onUpload],
  );

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : error
              ? "border-red-300 bg-red-50"
              : "border-gray-300 hover:border-blue-400"
        }`}
      >
        <input
          type="file"
          onChange={handleFileSelect}
          accept={accept}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center space-y-2"
        >
          <Upload className="w-8 h-8 text-gray-400" />
          <span className="text-sm text-gray-600">
            Drag and drop or click to select
          </span>
          <span className="text-xs text-gray-500">
            {accept} (up to {maxSize / (1024 * 1024)}MB)
          </span>
        </label>
      </div>

      {error && (
        <div className="flex items-center text-red-600 text-sm">
          <AlertCircle className="w-4 h-4 mr-2" />
          {error}
        </div>
      )}

      {uploading && (
        <div className="flex items-center text-blue-600 text-sm">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent mr-2" />
          Uploading...
        </div>
      )}
    </div>
  );
}
