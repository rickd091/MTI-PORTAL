import { supabase } from "../../lib/supabase";
import { Program } from "../../types/Program";

export const programApi = {
  async getAll() {
    const { data, error } = await supabase
      .from("programs")
      .select("*, institutions(*)");

    if (error) throw error;
    return data;
  },

  async getByInstitution(institutionId: string) {
    const { data, error } = await supabase
      .from("programs")
      .select("*")
      .eq("institution_id", institutionId);

    if (error) throw error;
    return data;
  },

  async create(program: Omit<Program, "id">) {
    const { data, error } = await supabase
      .from("programs")
      .insert([program])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Program>) {
    const { data, error } = await supabase
      .from("programs")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
