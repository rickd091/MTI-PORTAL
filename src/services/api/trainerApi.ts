import { supabase } from "../../lib/supabase";
import { Trainer } from "../../types/Trainer";

export const trainerApi = {
  async getAll() {
    const { data, error } = await supabase.from("trainers").select("*");

    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("trainers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(trainer: Omit<Trainer, "id">) {
    const { data, error } = await supabase
      .from("trainers")
      .insert([trainer])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Trainer>) {
    const { data, error } = await supabase
      .from("trainers")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateLicense(id: string, licenseData: Trainer["license"]) {
    const { data, error } = await supabase
      .from("trainers")
      .update({ license: licenseData })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
