//src/config/documentConfig.js
export const documentCategories = {
  INSTITUTIONAL: 'Institutional Documents',
  ACADEMIC: 'Academic Documents',
  COMPLIANCE: 'Compliance Documents',
  FINANCIAL: 'Financial Documents',
  FACILITY: 'Facility Documents'
};

export const documentRequirements = [
  {
    key: 'registrationCertificate',
    label: 'Registration Certificate',
    category: 'INSTITUTIONAL',
    required: true,
    acceptedTypes: ['.pdf'],
    maxSize: 5 * 1024 * 1024, // 5MB
    validityYears: 5,
    description: 'Original institution registration certificate from relevant authorities'
  },
  {
    key: 'taxCompliance',
    label: 'Tax Compliance Certificate',
    category: 'COMPLIANCE',
    required: true,
    acceptedTypes: ['.pdf'],
    maxSize: 2 * 1024 * 1024, // 2MB
    validityYears: 1,
    description: 'Current tax compliance certificate'
  },
  {
    key: 'qmsManual',
    label: 'Quality Management System Manual',
    category: 'INSTITUTIONAL',
    required: true,
    acceptedTypes: ['.pdf', '.doc', '.docx'],
    maxSize: 10 * 1024 * 1024, // 10MB
    description: 'Detailed QMS manual following ISO 9001 standards'
  },
  {
    key: 'courseOutlines',
    label: 'Course Outlines',
    category: 'ACADEMIC',
    required: true,
    acceptedTypes: ['.pdf', '.doc', '.docx'],
    maxSize: 15 * 1024 * 1024, // 15MB
    description: 'Detailed course outlines for all proposed programs'
  },
  {
    key: 'staffQualifications',
    label: 'Staff Qualifications',
    category: 'ACADEMIC',
    required: true,
    acceptedTypes: ['.pdf'],
    maxSize: 10 * 1024 * 1024,
    description: 'CVs and certificates of key academic staff'
  },
  {
    key: 'financialStatements',
    label: 'Financial Statements',
    category: 'FINANCIAL',
    required: true,
    acceptedTypes: ['.pdf'],
    maxSize: 5 * 1024 * 1024,
    validityYears: 1,
    description: 'Audited financial statements for the last financial year'
  },
  {
    key: 'insuranceCertificates',
    label: 'Insurance Certificates',
    category: 'COMPLIANCE',
    required: true,
    acceptedTypes: ['.pdf'],
    maxSize: 5 * 1024 * 1024,
    validityYears: 1,
    description: 'Valid insurance coverage certificates'
  },
  {
    key: 'facilityInspectionReport',
    label: 'Facility Inspection Report',
    category: 'FACILITY',
    required: true,
    acceptedTypes: ['.pdf'],
    maxSize: 8 * 1024 * 1024,
    validityYears: 2,
    description: 'Recent facility inspection report from relevant authorities'
  },
  {
    key: 'safetyManual',
    label: 'Safety and Emergency Procedures Manual',
    category: 'FACILITY',
    required: true,
    acceptedTypes: ['.pdf', '.doc', '.docx'],
    maxSize: 10 * 1024 * 1024,
    description: 'Comprehensive safety procedures and emergency response plans'
  }
];