import { useState } from "react";
import { inspectionApi } from "@/services/api/inspectionApi";
import { useNavigate } from "react-router-dom";

export interface InspectionFormData {
  institutionName: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  location: string;
  category: string;
  ownership: string;
  managerName: string;
  principalName: string;

  healthInspection: string;
  leaseAgreement: string;
  financialRecords: string;
  legalDocuments: string;
  internalQualityAssurance: string;
  strategicPlan: string;

  physicalFacilities: string;
  theoryRooms: string;
  laboratories: string;
  library: string;
  sanitation: string;
  waterElectricity: string;

  teachingStaff: string;
  technicalStaff: string;
  administrativeStaff: string;
  guidanceCounselingUnit: string;

  safetyMeasures: string;
  industrialAttachment: string;
  coursesApproved: string;
  licensedCourses: string;
  trainerPreparation: string;
  examinationResults: string;

  assessorName: string;
  assessorSignature: string;
  date: string;
  recommendations: string;
}

const initialFormData: InspectionFormData = {
  institutionName: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  location: "",
  category: "",
  ownership: "",
  managerName: "",
  principalName: "",

  healthInspection: "",
  leaseAgreement: "",
  financialRecords: "",
  legalDocuments: "",
  internalQualityAssurance: "",
  strategicPlan: "",

  physicalFacilities: "",
  theoryRooms: "",
  laboratories: "",
  library: "",
  sanitation: "",
  waterElectricity: "",

  teachingStaff: "",
  technicalStaff: "",
  administrativeStaff: "",
  guidanceCounselingUnit: "",

  safetyMeasures: "",
  industrialAttachment: "",
  coursesApproved: "",
  licensedCourses: "",
  trainerPreparation: "",
  examinationResults: "",

  assessorName: "",
  assessorSignature: "",
  date: "",
  recommendations: "",
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

  return {
    formData,
    handleChange,
    handleSubmit,
    isSubmitting,
    error,
  };
};
