import { supabase } from "../../lib/supabase";
import { Inspection } from "../../types/Inspection";

export const inspectionApi = {
  async getAll() {
    const { data, error } = await supabase
      .from("inspections")
      .select("*, institutions(*)");

    if (error) throw error;
    return data;
  },

  async getByInstitution(institutionId: string) {
    const { data, error } = await supabase
      .from("inspections")
      .select("*")
      .eq("institution_id", institutionId);

    if (error) throw error;
    return data;
  },

  async create(inspection: Omit<Inspection, "id">) {
    const { data, error } = await supabase
      .from("inspections")
      .insert([inspection])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Inspection>) {
    const { data, error } = await supabase
      .from("inspections")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateChecklist(id: string, checklist: Inspection["checklist"]) {
    const { data, error } = await supabase
      .from("inspections")
      .update({ checklist })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
