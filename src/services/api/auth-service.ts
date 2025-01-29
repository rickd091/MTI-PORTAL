import { BaseApi } from "./base-api";

export class AuthService extends BaseApi {
  async signIn(email: string, password: string) {
    return this.handleResponse(
      this.supabase.auth.signInWithPassword({ email, password }),
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
}

export const authService = new AuthService();
