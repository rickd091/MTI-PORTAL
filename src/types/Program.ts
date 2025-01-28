export interface Program {
  programId: string;
  institutionId: string; // FK reference to Institution
  programName: string;
  programLevel: string; // e.g., "Diploma", "Craft", "Artisan"
  curriculumType: string; // "TVET CDACC", "KNEC", "NITA", etc.
  occupationalStandards?: string; // file URL or ID for CBET standards
  programDuration: string; // e.g. "6 months"
  licenseStatus: "Pending" | "Licensed" | "Rejected" | "Suspended";
  licenseIssueDate?: string;
  licenseValidUntil?: string;
}
