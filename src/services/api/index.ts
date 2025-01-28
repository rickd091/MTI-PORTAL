import { supabase } from "../../lib/supabase";
import { Database } from "../../types/database";

import { Institution } from "../../types/institution";

type InstitutionRow = Database["public"]["Tables"]["institutions"]["Row"];
type Application = Database["public"]["Tables"]["applications"]["Row"];
type Document = Database["public"]["Tables"]["documents"]["Row"];

export const institutionService = {
  async create(data: Omit<InstitutionRow, "id" | "created_at">) {
    const { data: institution, error } = await supabase
      .from("institutions")
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return institution;
  },

  async get(id: string) {
    const { data: institution, error } = await supabase
      .from("institutions")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return institution;
  },

  async list() {
    const { data: institutions, error } = await supabase
      .from("institutions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return institutions;
  },

  async update(id: string, updates: Partial<InstitutionRow>) {
    const { data: institution, error } = await supabase
      .from("institutions")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return institution;
  },
};

export const applicationService = {
  async create(data: Omit<Application, "id" | "created_at">) {
    const { data: application, error } = await supabase
      .from("applications")
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return application;
  },

  async get(id: string) {
    const { data: application, error } = await supabase
      .from("applications")
      .select("*, institution:institutions(*)")
      .eq("id", id)
      .single();

    if (error) throw error;
    return application;
  },

  async list(filters?: { status?: string; type?: string }) {
    let query = supabase
      .from("applications")
      .select("*, institution:institutions(*)")
      .order("created_at", { ascending: false });

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }
    if (filters?.type) {
      query = query.eq("type", filters.type);
    }

    const { data: applications, error } = await query;

    if (error) throw error;
    return applications;
  },

  async update(id: string, updates: Partial<Application>) {
    const { data: application, error } = await supabase
      .from("applications")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return application;
  },
};

export const documentService = {
  async upload(file: File, path: string) {
    const { data, error } = await supabase.storage
      .from("documents")
      .upload(path, file);

    if (error) throw error;
    return data;
  },

  async create(data: Omit<Document, "id" | "created_at">) {
    const { data: document, error } = await supabase
      .from("documents")
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return document;
  },

  async list(institutionId: string) {
    const { data: documents, error } = await supabase
      .from("documents")
      .select("*")
      .eq("institution_id", institutionId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return documents;
  },

  async update(id: string, updates: Partial<Document>) {
    const { data: document, error } = await supabase
      .from("documents")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return document;
  },
};
