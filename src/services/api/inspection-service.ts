import { BaseApi } from "./base-api";
import type { Database } from "@/lib/database.types";

export type Inspection = Database["public"]["Tables"]["inspections"]["Row"];
export type InsertInspection = Database["public"]["Tables"]["inspections"]["Insert"];
export type UpdateInspection = Database["public"]["Tables"]["inspections"]["Update"];

export class InspectionService extends BaseApi {
  async create(data: InsertInspection): Promise<Inspection> {
    return this.handleResponse<Inspection>(
      this.supabase.from("inspections").insert([data]).select().single()
    );
  }

  async update(id: string, data: UpdateInspection): Promise<Inspection> {
    return this.handleResponse<Inspection>(
      this.supabase
        .from("inspections")
        .update(data)
        .eq("id", id)
        .select()
        .single()
    );
  }

  async getById(id: string): Promise<Inspection> {
    return this.handleResponse<Inspection>(
      this.supabase.from("inspections").select("*").eq("id", id).single()
    );
  }

  async getByInstitutionId(institutionId: string): Promise<Inspection[]> {
    return this.handleResponse<Inspection[]>(
      this.supabase
        .from("inspections")
        .select("*, profiles(full_name)")
        .eq("institution_id", institutionId)
        .order("scheduled_date", { ascending: false })
    );
  }

  async getByApplicationId(applicationId: string): Promise<Inspection[]> {
    return this.handleResponse<Inspection[]>(
      this.supabase
        .from("inspections")
        .select("*, profiles(full_name)")
        .eq("application_id", applicationId)
        .order("scheduled_date", { ascending: false })
    );
  }

  async list(filters?: { 
    status?: string; 
    inspector_id?: string;
    from_date?: string;
    to_date?: string;
  }): Promise<Inspection[]> {
    let query = this.supabase
      .from("inspections")
      .select("*, institutions(name), profiles(full_name)");

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }
    if (filters?.inspector_id) {
      query = query.eq("inspector_id", filters.inspector_id);
    }
    if (filters?.from_date) {
      query = query.gte("scheduled_date", filters.from_date);
    }
    if (filters?.to_date) {
      query = query.lte("scheduled_date", filters.to_date);
    }

    return this.handleResponse<Inspection[]>(query);
  }

  async delete(id: string) {
    return this.handleResponse(
      this.supabase.from("inspections").delete().eq("id", id)
    );
  }
}

export const inspectionService = new InspectionService();
