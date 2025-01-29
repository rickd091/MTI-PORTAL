import { BaseApi } from "./base-api";
import type { Facility } from "@/types/institution";

export class FacilityService extends BaseApi {
  async create(data: Omit<Facility, "id" | "created_at" | "updated_at">) {
    return this.handleResponse(
      this.supabase.from("facilities").insert([data]).select().single(),
    );
  }

  async update(id: string, data: Partial<Facility>) {
    return this.handleResponse(
      this.supabase
        .from("facilities")
        .update(data)
        .eq("id", id)
        .select()
        .single(),
    );
  }

  async getByInstitutionId(institutionId: string) {
    return this.handleResponse(
      this.supabase
        .from("facilities")
        .select("*")
        .eq("institution_id", institutionId),
    );
  }

  async delete(id: string) {
    return this.handleResponse(
      this.supabase.from("facilities").delete().eq("id", id),
    );
  }
}

export const facilityService = new FacilityService();
