import { supabase } from "@/lib/supabase";

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

export const notificationApi = {
  async create(
    data: Omit<Notification, "id" | "created_at">,
  ): Promise<Notification> {
    const { data: notification, error } = await supabase
      .from("notifications")
      .insert([data])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return notification;
  },

  async markAsRead(id: string): Promise<void> {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", id);

    if (error) throw new Error(error.message);
  },

  async getUnread(userId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .eq("read", false)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  async getAll(userId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },
};
