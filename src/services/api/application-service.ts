import { BaseApi } from "./base-api";
import type { Database } from "@/lib/database.types";

export type Application = Database["public"]["Tables"]["applications"]["Row"];
export type InsertApplication = Database["public"]["Tables"]["applications"]["Insert"];
export type UpdateApplication = Database["public"]["Tables"]["applications"]["Update"];

export class ApplicationService extends BaseApi {
  async create(data: InsertApplication): Promise<Application> {
    return this.handleResponse<Application>(
      this.supabase.from("applications").insert([data]).select().single()
    );
  }

  async update(id: string, data: UpdateApplication): Promise<Application> {
    return this.handleResponse<Application>(
      this.supabase
        .from("applications")
        .update(data)
        .eq("id", id)
        .select()
        .single()
    );
  }

  async getById(id: string): Promise<Application> {
    return this.handleResponse<Application>(
      this.supabase.from("applications").select("*").eq("id", id).single()
    );
  }

  async getByInstitutionId(institutionId: string): Promise<Application[]> {
    return this.handleResponse<Application[]>(
      this.supabase
        .from("applications")
        .select("*")
        .eq("institution_id", institutionId)
        .order("created_at", { ascending: false })
    );
  }

  async list(filters?: { 
    status?: string; 
    application_type?: string;
    payment_status?: string;
  }): Promise<Application[]> {
    let query = this.supabase.from("applications").select("*, institutions(name)");

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }
    if (filters?.application_type) {
      query = query.eq("application_type", filters.application_type);
    }
    if (filters?.payment_status) {
      query = query.eq("payment_status", filters.payment_status);
    }

    return this.handleResponse<Application[]>(query);
  }

  async delete(id: string) {
    return this.handleResponse(
      this.supabase.from("applications").delete().eq("id", id)
    );
  }
}

export const applicationService = new ApplicationService();
