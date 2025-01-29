import { supabase } from "@/lib/supabase";

export interface ComplianceRecord {
  id: string;
  institution_id: string;
  type: string;
  status: "compliant" | "non_compliant" | "pending";
  due_date?: string;
  completed_at?: string;
}

export const complianceApi = {
  async create(data: Omit<ComplianceRecord, "id">): Promise<ComplianceRecord> {
    const { data: record, error } = await supabase
      .from("compliance_records")
      .insert([data])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return record;
  },

  async update(
    id: string,
    data: Partial<ComplianceRecord>,
  ): Promise<ComplianceRecord> {
    const { data: record, error } = await supabase
      .from("compliance_records")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return record;
  },

  async getByInstitution(institutionId: string): Promise<ComplianceRecord[]> {
    const { data, error } = await supabase
      .from("compliance_records")
      .select("*")
      .eq("institution_id", institutionId);

    if (error) throw new Error(error.message);
    return data;
  },

  async getDashboardStats(): Promise<any> {
    const { data, error } = await supabase.rpc("get_compliance_stats");

    if (error) throw new Error(error.message);
    return data;
  },

  async generateReport(institutionId: string): Promise<any> {
    const { data, error } = await supabase.rpc("generate_compliance_report", {
      institution_id: institutionId,
    });

    if (error) throw new Error(error.message);
    return data;
  },
};
