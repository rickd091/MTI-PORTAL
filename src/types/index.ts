//src/types/index.ts
export type UserRole = 'admin' | 'reviewer' | 'institution';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: string[];
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  expiryDate?: string;
  status: 'pending' | 'valid' | 'expired' | 'rejected';
  url?: string;
}

export interface RegistrationFormData {
  basicInfo: {
    institutionName: string;
    contactEmail: string;
    contactPhone: string;
    [key: string]: any;
  };
  premises: {
    premiseStatus: string;
    leaseExpiryDate?: string;
    ownershipDocument?: Document;
    [key: string]: any;
  };
  management: {
    managementType: string;
    members: ManagementMember[];
    [key: string]: any;
  };
  infrastructure: {
    classrooms: Facility[];
    workshops: Facility[];
    labs: Facility[];
    [key: string]: any;
  };
  documents: {
    [key: string]: Document;
  };
}

export interface ManagementMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  bio?: string;
}

export interface Facility {
  id: string;
  area: number;
  condition: number;
  equipment?: string;
}