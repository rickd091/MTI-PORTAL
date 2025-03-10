import { supabase } from "@/lib/supabase-client";

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

  /**
   * Generic method to handle any Supabase query response
   * This method accepts any thenable object (like Supabase query builders) or Promise
   * and extracts the data from the response based on its structure
   */
  protected async handleResponse<T>(query: any): Promise<T> {
    try {
      // Await the result (works for both Promise and thenable objects like Postgrest builders)
      const response = await query;
      
      // Handle errors from any Supabase response type
      if (response?.error) this.handleError(response.error);
      
      // Handle different response structures
      if (response?.data !== undefined) {
        // Standard Supabase database response
        return response.data as T;
      } else if (response?.user !== undefined || response?.session !== undefined) {
        // Auth responses
        return response as T;
      } else {
        // Other responses like storage or direct data
        return response as T;
      }
    } catch (error) {
      return this.handleError(error);
    }
  }
}
