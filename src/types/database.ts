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
      users: {
        Row: {
          id: string;
          email: string;
          role: "admin" | "reviewer" | "institution";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          role: "admin" | "reviewer" | "institution";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: "admin" | "reviewer" | "institution";
          created_at?: string;
          updated_at?: string;
        };
      };
      institutions: {
        Row: {
          id: string;
          name: string;
          type: string;
          registration_number: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          address: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: string;
          registration_number?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          address?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string;
          registration_number?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          address?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      applications: {
        Row: {
          id: string;
          institution_id: string;
          status: string;
          type: string;
          submitted_by: string;
          submitted_at: string;
          updated_at: string;
          data: Json | null;
        };
        Insert: {
          id?: string;
          institution_id: string;
          status?: string;
          type: string;
          submitted_by: string;
          submitted_at?: string;
          updated_at?: string;
          data?: Json | null;
        };
        Update: {
          id?: string;
          institution_id?: string;
          status?: string;
          type?: string;
          submitted_by?: string;
          submitted_at?: string;
          updated_at?: string;
          data?: Json | null;
        };
      };
      documents: {
        Row: {
          id: string;
          application_id: string;
          name: string;
          type: string;
          status: string;
          url: string;
          uploaded_by: string;
          uploaded_at: string;
          expires_at: string | null;
        };
        Insert: {
          id?: string;
          application_id: string;
          name: string;
          type: string;
          status?: string;
          url: string;
          uploaded_by: string;
          uploaded_at?: string;
          expires_at?: string | null;
        };
        Update: {
          id?: string;
          application_id?: string;
          name?: string;
          type?: string;
          status?: string;
          url?: string;
          uploaded_by?: string;
          uploaded_at?: string;
          expires_at?: string | null;
        };
      };
      inspections: {
        Row: {
          id: string;
          application_id: string;
          inspector_id: string;
          scheduled_date: string | null;
          status: string;
          findings: Json | null;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          application_id: string;
          inspector_id: string;
          scheduled_date?: string | null;
          status?: string;
          findings?: Json | null;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          application_id?: string;
          inspector_id?: string;
          scheduled_date?: string | null;
          status?: string;
          findings?: Json | null;
          created_at?: string;
          completed_at?: string | null;
        };
      };
    };
  };
}
