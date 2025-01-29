import { supabase } from "@/lib/supabase-client";
import { Database } from "@/lib/database.types";

export class BaseApi {
  protected supabase = supabase;

  protected handleError(error: any): never {
    console.error("API Error:", error);
    throw new Error(error.message || "An unexpected error occurred");
  }

  protected async handleResponse<T>(
    promise: Promise<{ data: T | null; error: any }>,
  ): Promise<T> {
    const { data, error } = await promise;
    if (error) throw this.handleError(error);
    if (!data) throw new Error("No data returned");
    return data;
  }
}
