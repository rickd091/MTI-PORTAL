import { supabase } from "../../lib/supabase";
import { Institution } from "../../types/Institution";

export const institutionApi = {
  async getAll() {
    const { data, error } = await supabase.from("institutions").select("*");

    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("institutions")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(institution: Omit<Institution, "id">) {
    const { data, error } = await supabase
      .from("institutions")
      .insert([institution])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Institution>) {
    const { data, error } = await supabase
      .from("institutions")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from("institutions").delete().eq("id", id);

    if (error) throw error;
  },
};
