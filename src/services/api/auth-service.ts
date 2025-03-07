import { BaseApi } from "./base-api";

export class AuthService extends BaseApi {
  async signIn(email: string, password: string) {
    return this.handleResponse(
      this.supabase.auth.signInWithPassword({ email, password }),
    );
  }

  async signUp(email: string, password: string) {
    return this.handleResponse(
      this.supabase.auth.signUp({ email, password }),
    );
  }

  async signInWithOAuth(provider: 'github' | 'google') {
    return this.handleResponse(
      this.supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      }),
    );
  }

  async signOut() {
    return this.handleResponse(this.supabase.auth.signOut());
  }

  async getCurrentUser() {
    return this.handleResponse(this.supabase.auth.getUser());
  }

  async getSession() {
    return this.handleResponse(this.supabase.auth.getSession());
  }
  
  getSupabase() {
    return this.supabase;
  }
}

export const authService = new AuthService();
