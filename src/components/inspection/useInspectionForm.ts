import { useState } from "react";
import { inspectionApi } from "@/services/api/inspectionApi";
import { useNavigate } from "react-router-dom";

export interface InspectionFormData {
  // ... (previous interface remains the same)
}

const initialFormData: InspectionFormData = {
  // ... (previous initial data remains the same)
};

export const useInspectionForm = (inspectionId?: string) => {
  const [formData, setFormData] = useState<InspectionFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (inspectionId) {
        await inspectionApi.update(inspectionId, formData);
      } else {
        const inspection = await inspectionApi.create(formData);
        navigate(`/inspections/${inspection.id}`);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit inspection form",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (file: File, type: string) => {
    if (!inspectionId) {
      setError("Please save the inspection first before uploading documents");
      return;
    }

    try {
      await inspectionApi.uploadDocument(inspectionId, file, type);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to upload document",
      );
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    handleFileUpload,
    isSubmitting,
    error,
  };
};
