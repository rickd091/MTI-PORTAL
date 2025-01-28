import React, { useState, useEffect } from "react";
import { Clock, Download, Upload } from "lucide-react";
import { DocumentService } from "@/services/DocumentService";

interface Props {
  documentId: string;
  onVersionChange?: (version: any) => void;
}

export default function DocumentVersionControl({
  documentId,
  onVersionChange,
}: Props) {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVersions();
  }, [documentId]);

  const loadVersions = async () => {
    try {
      const data = await DocumentService.getVersions(documentId);
      setVersions(data || []);
    } catch (error) {
      console.error("Failed to load versions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadNewVersion = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const newVersion = await DocumentService.createVersion(documentId, file);
      setVersions((prev) => [newVersion, ...prev]);
      if (onVersionChange) onVersionChange(newVersion);
    } catch (error) {
      console.error("Failed to create version:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-b-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Version History</h3>
        <label className="cursor-pointer">
          <input
            type="file"
            onChange={handleUploadNewVersion}
            className="hidden"
          />
          <div className="flex items-center text-blue-600 hover:text-blue-700">
            <Upload className="w-4 h-4 mr-1" />
            <span>Upload New Version</span>
          </div>
        </label>
      </div>

      <div className="space-y-2">
        {versions.map((version: any) => (
          <div
            key={version.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <Clock className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Version {version.version}</p>
                <p className="text-xs text-gray-500">
                  {new Date(version.created_at).toLocaleString()}
                </p>
              </div>
            </div>
            <button
              onClick={() => window.open(version.url, "_blank")}
              className="p-1 hover:bg-gray-200 rounded-full"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
