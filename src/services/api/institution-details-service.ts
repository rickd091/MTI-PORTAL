import { BaseApi } from "./base-api";
import type { InstitutionDetails } from "@/types/institution";

export class InstitutionDetailsService extends BaseApi {
  async create(
    data: Omit<InstitutionDetails, "id" | "created_at" | "updated_at">,
  ) {
    return this.handleResponse(
      this.supabase
        .from("institution_details")
        .insert([data])
        .select()
        .single(),
    );
  }

  async update(id: string, data: Partial<InstitutionDetails>) {
    return this.handleResponse(
      this.supabase
        .from("institution_details")
        .update(data)
        .eq("id", id)
        .select()
        .single(),
    );
  }

  async getByInstitutionId(institutionId: string) {
    return this.handleResponse(
      this.supabase
        .from("institution_details")
        .select("*")
        .eq("institution_id", institutionId)
        .single(),
    );
  }
}

export const institutionDetailsService = new InstitutionDetailsService();
