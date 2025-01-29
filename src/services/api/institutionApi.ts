import { supabase } from "@/lib/supabase";

export interface Institution {
  id: string;
  name: string;
  registration_number: string;
  status: "pending" | "active" | "suspended" | "expired";
  type: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  accreditation_expiry?: string;
}

export const institutionApi = {
  async create(data: Omit<Institution, "id">): Promise<Institution> {
    const { data: institution, error } = await supabase
      .from("institutions")
      .insert([data])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return institution;
  },

  async update(id: string, data: Partial<Institution>): Promise<Institution> {
    const { data: institution, error } = await supabase
      .from("institutions")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return institution;
  },

  async getById(id: string): Promise<Institution> {
    const { data: institution, error } = await supabase
      .from("institutions")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return institution;
  },

  async list(filters?: {
    status?: string;
    type?: string;
  }): Promise<Institution[]> {
    let query = supabase.from("institutions").select("*");

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }
    if (filters?.type) {
      query = query.eq("type", filters.type);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("institutions").delete().eq("id", id);

    if (error) throw new Error(error.message);
  },
};
