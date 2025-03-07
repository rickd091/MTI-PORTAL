import { BaseApi } from "./base-api";
import type { Database } from "@/lib/database.types";

export type Document = Database["public"]["Tables"]["documents"]["Row"];
export type InsertDocument = Database["public"]["Tables"]["documents"]["Insert"];
export type UpdateDocument = Database["public"]["Tables"]["documents"]["Update"];

interface FileUploadResult {
  fileName: string;
  filePath: string;
  publicUrl: string;
}

export class DocumentService extends BaseApi {
  async create(data: InsertDocument): Promise<Document> {
    return this.handleResponse<Document>(
      this.supabase.from("documents").insert([data]).select().single()
    );
  }

  async update(id: string, data: UpdateDocument): Promise<Document> {
    return this.handleResponse<Document>(
      this.supabase
        .from("documents")
        .update(data)
        .eq("id", id)
        .select()
        .single()
    );
  }

  async getById(id: string): Promise<Document> {
    return this.handleResponse<Document>(
      this.supabase.from("documents").select("*").eq("id", id).single()
    );
  }

  async getByInstitutionId(institutionId: string): Promise<Document[]> {
    return this.handleResponse<Document[]>(
      this.supabase
        .from("documents")
        .select("*")
        .eq("institution_id", institutionId)
        .order("created_at", { ascending: false })
    );
  }

  async getByApplicationId(applicationId: string): Promise<Document[]> {
    return this.handleResponse<Document[]>(
      this.supabase
        .from("documents")
        .select("*")
        .eq("application_id", applicationId)
        .order("created_at", { ascending: false })
    );
  }

  async list(filters?: { 
    status?: string; 
    document_type?: string;
  }): Promise<Document[]> {
    let query = this.supabase.from("documents").select("*, institutions(name)");

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }
    if (filters?.document_type) {
      query = query.eq("document_type", filters.document_type);
    }

    return this.handleResponse<Document[]>(query);
  }

  async delete(id: string) {
    return this.handleResponse(
      this.supabase.from("documents").delete().eq("id", id)
    );
  }

  async uploadFile(file: File, path: string): Promise<FileUploadResult> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { error } = await this.supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (error) {
      throw this.handleError(error);
    }

    const { data: publicUrlData } = this.supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    return {
      fileName,
      filePath,
      publicUrl: publicUrlData.publicUrl,
    };
  }
}

export const documentService = new DocumentService();
