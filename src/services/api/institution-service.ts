import { BaseApi } from "./base-api";
import type { Database } from "@/lib/database.types";

type Institution = Database["public"]["Tables"]["institutions"]["Row"];
type InsertInstitution = Database["public"]["Tables"]["institutions"]["Insert"];
type UpdateInstitution = Database["public"]["Tables"]["institutions"]["Update"];

export class InstitutionService extends BaseApi {
  async create(data: InsertInstitution) {
    return this.handleResponse(
      this.supabase.from("institutions").insert([data]).select().single(),
    );
  }

  async update(id: string, data: UpdateInstitution) {
    return this.handleResponse(
      this.supabase
        .from("institutions")
        .update(data)
        .eq("id", id)
        .select()
        .single(),
    );
  }

  async getById(id: string) {
    return this.handleResponse(
      this.supabase.from("institutions").select("*").eq("id", id).single(),
    );
  }

  async list(filters?: { status?: string; type?: string }) {
    let query = this.supabase.from("institutions").select("*");

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }
    if (filters?.type) {
      query = query.eq("type", filters.type);
    }

    return this.handleResponse(query);
  }

  async delete(id: string) {
    return this.handleResponse(
      this.supabase.from("institutions").delete().eq("id", id),
    );
  }
}

export const institutionService = new InstitutionService();
