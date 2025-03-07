import { supabase } from "@/lib/supabase-client";
import { PostgrestBuilder, PostgrestFilterBuilder } from "@supabase/supabase-js";

export class BaseApi {
  protected supabase = supabase;

  // Add a method to expose the supabase client
  getSupabase() {
    return this.supabase;
  }

  protected handleError(error: any): never {
    console.error("API Error:", error);
    throw new Error(error.message || "An unexpected error occurred");
  }

  protected async handleResponse<T>(
    query: PostgrestBuilder<T> | PostgrestFilterBuilder<any, any, any, any, any>,
  ): Promise<T> {
    const { data, error } = await query;
    if (error) throw this.handleError(error);
    if (!data) throw new Error("No data returned");
    return data as T;
  }
}
