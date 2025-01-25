//src/types/document.ts
export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  file?: File;
  uploadDate: string;
  status: 'pending' | 'valid' | 'invalid';
  metadata?: Record<string, any>;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface DocumentPreviewProps {
  document: Document;
  showPreview?: boolean;
  onRemove?: () => void;
  onDownload?: () => void;
}

export type WorkflowState = 
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'expired';