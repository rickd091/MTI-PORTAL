import * as z from "zod";

export const inspectionSchema = z.object({
  institutionName: z.string().min(1, "Institution name is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  website: z.string().url("Invalid website URL").optional(),
  location: z.string().min(1, "Location is required"),
  category: z.string().min(1, "Category is required"),
  ownership: z.string().min(1, "Ownership information is required"),
  managerName: z.string().min(1, "Manager name is required"),
  principalName: z.string().min(1, "Principal name is required"),

  // Documentation
  healthInspection: z.string().min(1, "Health inspection details are required"),
  leaseAgreement: z.string().min(1, "Lease agreement details are required"),
  financialRecords: z.string().min(1, "Financial records are required"),
  legalDocuments: z.string().min(1, "Legal documents are required"),
  internalQualityAssurance: z
    .string()
    .min(1, "Quality assurance details are required"),
  strategicPlan: z.string().min(1, "Strategic plan is required"),

  // Facilities
  physicalFacilities: z
    .string()
    .min(1, "Physical facilities details are required"),
  theoryRooms: z.string().min(1, "Theory rooms details are required"),
  laboratories: z.string().min(1, "Laboratories details are required"),
  library: z.string().min(1, "Library details are required"),
  sanitation: z.string().min(1, "Sanitation details are required"),
  waterElectricity: z
    .string()
    .min(1, "Water and electricity details are required"),

  // Staffing
  teachingStaff: z.string().min(1, "Teaching staff details are required"),
  technicalStaff: z.string().min(1, "Technical staff details are required"),
  administrativeStaff: z
    .string()
    .min(1, "Administrative staff details are required"),
  guidanceCounselingUnit: z
    .string()
    .min(1, "Guidance and counseling details are required"),

  // Safety & Training
  safetyMeasures: z.string().min(1, "Safety measures details are required"),
  industrialAttachment: z
    .string()
    .min(1, "Industrial attachment details are required"),
  coursesApproved: z.string().min(1, "Approved courses details are required"),
  licensedCourses: z.string().min(1, "Licensed courses details are required"),
  trainerPreparation: z
    .string()
    .min(1, "Trainer preparation details are required"),
  examinationResults: z.string().min(1, "Examination results are required"),

  // Assessment
  assessorName: z.string().min(1, "Assessor name is required"),
  assessorSignature: z.string().min(1, "Assessor signature is required"),
  date: z.string().min(1, "Date is required"),
  recommendations: z.string().min(1, "Recommendations are required"),
});

export type InspectionSchema = z.infer<typeof inspectionSchema>;
