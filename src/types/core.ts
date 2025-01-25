//src/types/core.ts
export type UserRole = 'admin' | 'reviewer' | 'institution' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  metadata: Record<string, any>;
}

export interface WorkflowEvent {
  state: WorkflowState;
  timestamp: string;
  comment?: string;
  user?: string;
}

export type WorkflowState = 
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'needs_revision'
  | 'approved'
  | 'rejected'
  | 'expired'
  | 'deleted';

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  file: File;
  uploadDate: string;
  expiryDate?: string;
  status: DocumentStatus;
  workflowState: WorkflowState;
  validationResult?: ValidationResult;
  history: WorkflowEvent[];
  metadata: Record<string, any>;
}

export type DocumentStatus = 
  | 'pending'
  | 'validating'
  | 'valid'
  | 'invalid'
  | 'expired';

export interface DocumentRequirement {
  key: string;
  label: string;
  description?: string;
  required: boolean;
  acceptedTypes: string[];
  maxSize: number;
  validityYears?: number;
  category: DocumentCategory;
}

export type DocumentCategory = 
  | 'INSTITUTIONAL'
  | 'ACADEMIC'
  | 'COMPLIANCE'
  | 'FINANCIAL'
  | 'FACILITY';

export interface WorkflowStep {
  icon: React.ComponentType;
  color: string;
  bgColor: string;
  label: string;
  allowedTransitions: WorkflowState[];
}