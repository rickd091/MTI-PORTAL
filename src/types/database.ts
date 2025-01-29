export interface Institution {
  id: string;
  name: string;
  registration_number: string;
  status: "pending" | "active" | "suspended" | "expired";
  type: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  created_at: string;
  updated_at: string;
  accreditation_expiry?: string;
  last_inspection_date?: string;
}

export interface Facility {
  id: string;
  institution_id: string;
  facility_type: string;
  name: string;
  capacity?: number;
  area_size?: number;
  equipment_details?: Record<string, any>;
  status: "operational" | "maintenance" | "inactive";
  last_inspection_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Staff {
  id: string;
  institution_id: string;
  first_name: string;
  last_name: string;
  role: string;
  qualification: string;
  certification_details?: Record<string, any>;
  email?: string;
  phone?: string;
  status: "active" | "inactive" | "pending";
  joining_date: string;
  created_at: string;
  updated_at: string;
}

export interface Program {
  id: string;
  institution_id: string;
  name: string;
  code: string;
  type: string;
  duration: string;
  capacity: number;
  description?: string;
  requirements?: string[];
  status: "draft" | "active" | "suspended" | "archived";
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  institution_id: string;
  document_type: string;
  name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  status: "pending" | "verified" | "rejected" | "expired";
  expiry_date?: string;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}

export interface Inspection {
  id: string;
  institution_id: string;
  inspector_id: string;
  inspection_date: string;
  type: string;
  findings?: Record<string, any>;
  recommendations?: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
}

export interface ComplianceRecord {
  id: string;
  institution_id: string;
  type: string;
  status: "compliant" | "non_compliant" | "pending";
  details?: Record<string, any>;
  due_date?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}
