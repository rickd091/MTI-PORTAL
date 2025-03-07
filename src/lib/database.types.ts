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
      applications: {
        Row: {
          id: string;
          institution_id: string;
          application_type: "INITIAL" | "RENEWAL" | "AMENDMENT";
          status: "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
          submission_date: string | null;
          review_date: string | null;
          approval_date: string | null;
          rejection_reason: string | null;
          payment_status: "PENDING" | "PAID" | "FAILED";
          payment_reference: string | null;
          payment_amount: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          institution_id: string;
          application_type: "INITIAL" | "RENEWAL" | "AMENDMENT";
          status?: "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
          submission_date?: string | null;
          review_date?: string | null;
          approval_date?: string | null;
          rejection_reason?: string | null;
          payment_status?: "PENDING" | "PAID" | "FAILED";
          payment_reference?: string | null;
          payment_amount?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          institution_id?: string;
          application_type?: "INITIAL" | "RENEWAL" | "AMENDMENT";
          status?: "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
          submission_date?: string | null;
          review_date?: string | null;
          approval_date?: string | null;
          rejection_reason?: string | null;
          payment_status?: "PENDING" | "PAID" | "FAILED";
          payment_reference?: string | null;
          payment_amount?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      inspections: {
        Row: {
          id: string;
          institution_id: string;
          application_id: string | null;
          inspector_id: string;
          status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
          scheduled_date: string;
          completion_date: string | null;
          report_submitted: boolean;
          report_url: string | null;
          findings: Json | null;
          recommendations: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          institution_id: string;
          application_id?: string | null;
          inspector_id: string;
          status?: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
          scheduled_date: string;
          completion_date?: string | null;
          report_submitted?: boolean;
          report_url?: string | null;
          findings?: Json | null;
          recommendations?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          institution_id?: string;
          application_id?: string | null;
          inspector_id?: string;
          status?: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
          scheduled_date?: string;
          completion_date?: string | null;
          report_submitted?: boolean;
          report_url?: string | null;
          findings?: Json | null;
          recommendations?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          institution_id: string;
          application_id: string | null;
          document_type: string;
          file_name: string;
          file_path: string;
          file_size: number;
          mime_type: string;
          status: "PENDING" | "VERIFIED" | "REJECTED";
          verification_date: string | null;
          verified_by: string | null;
          rejection_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          institution_id: string;
          application_id?: string | null;
          document_type: string;
          file_name: string;
          file_path: string;
          file_size: number;
          mime_type: string;
          status?: "PENDING" | "VERIFIED" | "REJECTED";
          verification_date?: string | null;
          verified_by?: string | null;
          rejection_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          institution_id?: string;
          application_id?: string | null;
          document_type?: string;
          file_name?: string;
          file_path?: string;
          file_size?: number;
          mime_type?: string;
          status?: "PENDING" | "VERIFIED" | "REJECTED";
          verification_date?: string | null;
          verified_by?: string | null;
          rejection_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
