import { BaseApi } from "./base-api";
import type { Staff } from "@/types/institution";

export class StaffService extends BaseApi {
  async create(data: Omit<Staff, "id" | "created_at" | "updated_at">) {
    return this.handleResponse(
      this.supabase.from("staff").insert([data]).select().single(),
    );
  }

  async update(id: string, data: Partial<Staff>) {
    return this.handleResponse(
      this.supabase.from("staff").update(data).eq("id", id).select().single(),
    );
  }

  async getByInstitutionId(institutionId: string) {
    return this.handleResponse(
      this.supabase
        .from("staff")
        .select("*")
        .eq("institution_id", institutionId),
    );
  }

  async delete(id: string) {
    return this.handleResponse(
      this.supabase.from("staff").delete().eq("id", id),
    );
  }
}

export const staffService = new StaffService();
