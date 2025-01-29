import { supabase } from "@/lib/supabase";

export interface TrainingProgram {
  id: string;
  institution_id: string;
  name: string;
  code: string;
  type: string;
  duration: string;
  capacity: number;
  status: "draft" | "active" | "suspended" | "archived";
}

export const trainingApi = {
  async create(data: Omit<TrainingProgram, "id">): Promise<TrainingProgram> {
    const { data: program, error } = await supabase
      .from("training_programs")
      .insert([data])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return program;
  },

  async update(
    id: string,
    data: Partial<TrainingProgram>,
  ): Promise<TrainingProgram> {
    const { data: program, error } = await supabase
      .from("training_programs")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return program;
  },

  async getById(id: string): Promise<TrainingProgram> {
    const { data: program, error } = await supabase
      .from("training_programs")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return program;
  },

  async list(institutionId?: string): Promise<TrainingProgram[]> {
    let query = supabase.from("training_programs").select("*");

    if (institutionId) {
      query = query.eq("institution_id", institutionId);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);
    return data;
  },

  async enrollStudent(programId: string, studentData: any): Promise<void> {
    const { error } = await supabase
      .from("students")
      .insert([{ program_id: programId, ...studentData }]);

    if (error) throw new Error(error.message);
  },

  async assignTrainer(programId: string, trainerId: string): Promise<void> {
    const { error } = await supabase
      .from("trainers")
      .update({ program_id: programId })
      .eq("id", trainerId);

    if (error) throw new Error(error.message);
  },
};
