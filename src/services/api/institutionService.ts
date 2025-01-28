import { supabase } from "../../lib/supabase";
import { Institution } from "../../types/institution";
import { mapInstitutionFromDB, mapInstitutionToDB } from "../../utils/mappers";

export const institutionService = {
  async create(institution: Institution) {
    const dbData = mapInstitutionToDB(institution);
    const { data, error } = await supabase
      .from("institutions")
      .insert([dbData])
      .select()
      .single();

    if (error) throw error;
    return mapInstitutionFromDB(data);
  },

  async get(id: string) {
    const { data, error } = await supabase
      .from("institutions")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return mapInstitutionFromDB(data);
  },

  async list() {
    const { data, error } = await supabase
      .from("institutions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data.map(mapInstitutionFromDB);
  },

  async update(id: string, updates: Partial<Institution>) {
    const dbUpdates = mapInstitutionToDB(updates as Institution);
    const { data, error } = await supabase
      .from("institutions")
      .update(dbUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return mapInstitutionFromDB(data);
  },
};
