export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          auth_id: string;
          email: string;
          full_name: string;
          role: "ADMIN" | "REVIEWER" | "INSTITUTION_USER" | "ASSESSOR";
          phone: string | null;
          avatar_url: string | null;
          active: boolean;
          last_login: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          auth_id: string;
          email: string;
          full_name: string;
          role?: "ADMIN" | "REVIEWER" | "INSTITUTION_USER" | "ASSESSOR";
          phone?: string | null;
          avatar_url?: string | null;
          active?: boolean;
          last_login?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          auth_id?: string;
          email?: string;
          full_name?: string;
          role?: "ADMIN" | "REVIEWER" | "INSTITUTION_USER" | "ASSESSOR";
          phone?: string | null;
          avatar_url?: string | null;
          active?: boolean;
          last_login?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      institutions: {
        Row: {
          id: string;
          profile_id: string;
          name: string;
          registration_number: string | null;
          type: string;
          status: "PENDING" | "ACTIVE" | "SUSPENDED" | "EXPIRED";
          contact_person: string;
          email: string;
          phone: string;
          address: string;
          website: string | null;
          accreditation_status: string;
          accreditation_expiry: string | null;
          last_inspection_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          name: string;
          registration_number?: string | null;
          type: string;
          status?: "PENDING" | "ACTIVE" | "SUSPENDED" | "EXPIRED";
          contact_person: string;
          email: string;
          phone: string;
          address: string;
          website?: string | null;
          accreditation_status?: string;
          accreditation_expiry?: string | null;
          last_inspection_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          name?: string;
          registration_number?: string | null;
          type?: string;
          status?: "PENDING" | "ACTIVE" | "SUSPENDED" | "EXPIRED";
          contact_person?: string;
          email?: string;
          phone?: string;
          address?: string;
          website?: string | null;
          accreditation_status?: string;
          accreditation_expiry?: string | null;
          last_inspection_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      // Add other table types here
    };
  };
}
