import { supabase } from "@/lib/supabase";

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  status: "pending" | "valid" | "invalid" | "expired";
  version: number;
  createdAt: string;
  expiryDate?: string;
  metadata?: Record<string, any>;
}

export class DocumentService {
  private static BUCKET_NAME = "documents";

  static async upload(file: File, metadata: Record<string, any> = {}) {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .upload(fileName, file);

    if (error) throw error;

    const { data: document } = await supabase
      .from("documents")
      .insert({
        name: file.name,
        type: file.type,
        size: file.size,
        url: data.path,
        status: "pending",
        version: 1,
        metadata,
      })
      .select()
      .single();

    return document;
  }

  static async getSignedUrl(path: string) {
    const { data } = await supabase.storage
      .from(this.BUCKET_NAME)
      .createSignedUrl(path, 3600);

    return data?.signedUrl;
  }

  static async search(query: string) {
    const { data: documents } = await supabase
      .from("documents")
      .select()
      .ilike("name", `%${query}%`);

    return documents;
  }

  static async getVersions(documentId: string) {
    const { data: versions } = await supabase
      .from("document_versions")
      .select()
      .eq("document_id", documentId)
      .order("version", { ascending: false });

    return versions;
  }

  static async validate(documentId: string) {
    const { data: document } = await supabase
      .from("documents")
      .update({ status: "valid" })
      .eq("id", documentId)
      .select()
      .single();

    return document;
  }

  static async createVersion(documentId: string, file: File) {
    const { data: currentDoc } = await supabase
      .from("documents")
      .select("version")
      .eq("id", documentId)
      .single();

    if (!currentDoc) throw new Error("Document not found");

    const fileName = `${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(this.BUCKET_NAME)
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: version } = await supabase
      .from("document_versions")
      .insert({
        document_id: documentId,
        version: currentDoc.version + 1,
        url: uploadData.path,
      })
      .select()
      .single();

    await supabase
      .from("documents")
      .update({ version: currentDoc.version + 1 })
      .eq("id", documentId);

    return version;
  }
}
