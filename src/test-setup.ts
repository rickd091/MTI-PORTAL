import { supabase } from "./lib/supabase";

export const testSetup = async () => {
  try {
    // Test Supabase connection
    const { data, error } = await supabase.from("inspections").select("count");
    if (error) throw error;
    console.log("✅ Supabase connection successful");

    // Test Tempo routes
    if (import.meta.env.VITE_TEMPO) {
      console.log("✅ Tempo environment variable set");
    } else {
      console.warn("⚠️ Tempo environment variable not set");
    }

    // Test error handling
    window.onerror = (msg, url, line, col, error) => {
      console.log("✅ Error handling working:", { msg, url, line, col, error });
      return false;
    };

    return true;
  } catch (error) {
    console.error("❌ Setup test failed:", error);
    return false;
  }
};
