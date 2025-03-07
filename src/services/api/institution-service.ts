import { BaseApi } from "./base-api";
import type { Database } from "@/lib/database.types";

export type Institution = Database["public"]["Tables"]["institutions"]["Row"];
export type InsertInstitution = Database["public"]["Tables"]["institutions"]["Insert"];
export type UpdateInstitution = Database["public"]["Tables"]["institutions"]["Update"];

export class InstitutionService extends BaseApi {
  async create(data: InsertInstitution): Promise<Institution> {
    return this.handleResponse<Institution>(
      this.supabase.from("institutions").insert([data]).select().single()
    );
  }

  async update(id: string, data: UpdateInstitution): Promise<Institution> {
    return this.handleResponse<Institution>(
      this.supabase
        .from("institutions")
        .update(data)
        .eq("id", id)
        .select()
        .single()
    );
  }

  async getById(id: string): Promise<Institution> {
    return this.handleResponse<Institution>(
      this.supabase.from("institutions").select("*").eq("id", id).single()
    );
  }

  async list(filters?: { status?: string; type?: string }): Promise<Institution[]> {
    let query = this.supabase.from("institutions").select("*");

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }
    if (filters?.type) {
      query = query.eq("type", filters.type);
    }

    return this.handleResponse<Institution[]>(query);
  }

  async delete(id: string) {
    return this.handleResponse(
      this.supabase.from("institutions").delete().eq("id", id)
    );
  }
}

export const institutionService = new InstitutionService();
