import { supabase } from "@/lib/supabase";

export interface AuthResponse {
  user: any;
  session: any;
  error?: string;
}

export const authApi = {
  async signIn(email: string, password: string): Promise<AuthResponse> {
    const {
      data: { user, session },
      error,
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);
    return { user, session };
  },

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  },

  async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw new Error(error.message);
  },

  async updatePassword(new_password: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      password: new_password,
    });
    if (error) throw new Error(error.message);
  },

  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw new Error(error.message);
    return user;
  },
};
