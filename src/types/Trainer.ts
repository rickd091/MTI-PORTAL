export interface Trainer {
  trainerId: string;
  fullName: string;
  dateOfBirth?: string;
  nationality?: string;
  gender?: "Male" | "Female" | "Other";
  idNumber: string; // national ID or passport
  email: string;
  phone: string;
  photoUrl?: string;

  workExperience: {
    institutionName: string;
    role: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }[];

  qualifications: {
    title: string; // e.g., "BSc in Maritime Studies"
    institutionName: string;
    startDate?: string;
    endDate?: string;
    certificateUrl?: string;
  }[];

  license: {
    applicationId: string;
    status: "Pending" | "Approved" | "Rejected" | "Suspended";
    issueDate?: string;
    expiryDate?: string;
    licenseDocumentUrl?: string;
  };
}
