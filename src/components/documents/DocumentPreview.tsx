import React, { useState } from "react";
import { FileText, Download, Eye, X } from "lucide-react";
import { DocumentService } from "@/services/DocumentService";

interface Props {
  document: any;
  onRemove?: () => void;
}

export default function DocumentPreview({ document, onRemove }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handlePreview = async () => {
    try {
      const url = await DocumentService.getSignedUrl(document.url);
      if (url) setPreviewUrl(url);
    } catch (error) {
      console.error("Failed to get preview URL:", error);
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start">
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
            onClick={handlePreview}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => window.open(previewUrl || document.url, "_blank")}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Download className="w-4 h-4" />
          </button>
          {onRemove && (
            <button
              onClick={onRemove}
              className="p-2 hover:bg-gray-100 rounded-full text-red-500"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {previewUrl && document.type.startsWith("image/") && (
        <div className="mt-4">
          <img
            src={previewUrl}
            alt={document.name}
            className="max-w-full h-auto rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
