import { supabase } from "@/lib/supabase";

export const requireAuth = async (req: any, res: any, next: any) => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session) {
      throw new Error("Not authenticated");
    }

    req.user = session.user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Not authenticated" });
  }
};

export const requireRole = (roles: string[]) => {
  return async (req: any, res: any, next: any) => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        throw new Error("Not authenticated");
      }

      const { data: userRole } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!roles.includes(userRole.role)) {
        throw new Error("Unauthorized");
      }

      next();
    } catch (error) {
      res.status(403).json({ error: "Unauthorized" });
    }
  };
};
