import { supabase } from "@/lib/supabase";

export interface Program {
  id: string;
  institution_id: string;
  name: string;
  code: string;
  type: string;
  duration: string;
  capacity: number;
  status: "draft" | "active" | "suspended" | "archived";
  approval_status: "pending" | "approved" | "rejected";
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export const programApi = {
  async create(
    data: Omit<Program, "id" | "created_at" | "updated_at">,
  ): Promise<Program> {
    const { data: program, error } = await supabase
      .from("programs")
      .insert([data])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return program;
  },

  async update(id: string, data: Partial<Program>): Promise<Program> {
    const { data: program, error } = await supabase
      .from("programs")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return program;
  },

  async getById(id: string): Promise<Program> {
    const { data: program, error } = await supabase
      .from("programs")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return program;
  },

  async list(institutionId?: string): Promise<Program[]> {
    let query = supabase.from("programs").select("*");

    if (institutionId) {
      query = query.eq("institution_id", institutionId);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);
    return data;
  },

  async approve(id: string): Promise<Program> {
    const { data: program, error } = await supabase
      .from("programs")
      .update({
        approval_status: "approved",
        approved_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return program;
  },

  async reject(id: string): Promise<Program> {
    const { data: program, error } = await supabase
      .from("programs")
      .update({
        approval_status: "rejected",
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return program;
  },
};
