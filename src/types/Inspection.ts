export interface Inspection {
  inspectionId: string;
  institutionId: string;
  assignedInspectorId: string; // reference to user
  inspectionType:
    | "Initial"
    | "Annual"
    | "Follow-up"
    | "Renewal"
    | "Quality Assurance";
  scheduledDate: string; // ISO date string
  status: "Scheduled" | "In-Progress" | "Completed" | "Postponed";

  checklist?: {
    safetyStandardsRating?: number;
    facilityStandardsRating?: number;
    facultyStaffRating?: number;
    equipmentConditionRating?: number;
    documentComplianceRating?: number;
    additionalComments?: string;
  };

  outcome?: "Pass" | "Fail" | "Conditional";
  correctiveActionsRequired?: string;
  followUpInspectionDate?: string;
}
