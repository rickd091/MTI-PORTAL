import { BaseApi } from "./base-api";
import type { InstitutionContact } from "@/types/institution";

export class ContactService extends BaseApi {
  async create(
    data: Omit<InstitutionContact, "id" | "created_at" | "updated_at">,
  ) {
    return this.handleResponse(
      this.supabase
        .from("institution_contacts")
        .insert([data])
        .select()
        .single(),
    );
  }

  async update(id: string, data: Partial<InstitutionContact>) {
    return this.handleResponse(
      this.supabase
        .from("institution_contacts")
        .update(data)
        .eq("id", id)
        .select()
        .single(),
    );
  }

  async getByInstitutionId(institutionId: string) {
    return this.handleResponse(
      this.supabase
        .from("institution_contacts")
        .select("*")
        .eq("institution_id", institutionId),
    );
  }

  async delete(id: string) {
    return this.handleResponse(
      this.supabase.from("institution_contacts").delete().eq("id", id),
    );
  }
}

export const contactService = new ContactService();
