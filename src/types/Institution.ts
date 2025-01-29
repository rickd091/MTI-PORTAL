import { Database } from "./database";

export interface InstitutionDetails {
  id: string;
  institution_id: string;
  ownership_type: string;
  establishment_date?: string;
  license_number?: string;
  license_expiry_date?: string;
  total_area?: number;
  infrastructure_details?: Record<string, any>;
  quality_management_system?: string;
  created_at: string;
  updated_at: string;
}

export interface Facility {
  id: string;
  institution_id: string;
  facility_type: "CLASSROOM" | "LABORATORY" | "WORKSHOP" | "LIBRARY" | "OTHER";
  name: string;
  capacity?: number;
  area_size?: number;
  equipment_details?: Record<string, any>;
  status: "OPERATIONAL" | "MAINTENANCE" | "INACTIVE";
  last_inspection_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Staff {
  id: string;
  institution_id: string;
  first_name: string;
  last_name: string;
  role: "INSTRUCTOR" | "ADMINISTRATOR" | "SUPPORT_STAFF" | "OTHER";
  qualification: string;
  certification_details?: Record<string, any>;
  email?: string;
  phone?: string;
  status: string;
  joining_date: string;
  created_at: string;
  updated_at: string;
}

export interface InstitutionContact {
  id: string;
  institution_id: string;
  contact_type: string;
  name: string;
  position: string;
  email?: string;
  phone?: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export type Tables = Database["public"]["Tables"];
export type Institution = Tables["institutions"]["Row"];
