import { supabase } from "@/lib/supabase";

export const auditLog = async (
  userId: string,
  action: string,
  entityType: string,
  entityId: string,
  changes: any,
  ipAddress: string,
) => {
  try {
    await supabase.from("audit_logs").insert([
      {
        user_id: userId,
        action,
        entity_type: entityType,
        entity_id: entityId,
        changes,
        ip_address: ipAddress,
      },
    ]);
  } catch (error) {
    console.error("Error creating audit log:", error);
  }
};
