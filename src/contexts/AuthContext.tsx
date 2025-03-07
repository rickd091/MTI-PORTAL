import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { authService } from "@/services/api/auth-service";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wrap in try/catch to handle potential errors with Supabase connection
    try {
      authService.getSession().then((sessionData) => {
        setSession(sessionData.session);
        setUser(sessionData.session?.user ?? null);
        setLoading(false);
      })
      .catch(error => {
        console.warn('Error getting session:', error);
        setLoading(false);
      });

      // Use the exported authService.supabase instance
      const { data: { subscription } } = authService.getSupabase().auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } catch (error) {
      console.warn('Error setting up auth listener:', error);
      setLoading(false);
      return () => {}; // Return empty cleanup function
    }
  }, []);

  const value = {
    session,
    user,
    loading,
    signIn: async (email: string, password: string) => {
      try {
        const authData = await authService.signIn(email, password);
        setSession(authData.session);
        setUser(authData.user);
      } catch (error) {
        console.error('Sign in error:', error);
        throw error;
      }
    },
    signOut: async () => {
      try {
        await authService.signOut();
        setSession(null);
        setUser(null);
      } catch (error) {
        console.error('Sign out error:', error);
        // Still clear session and user on error
        setSession(null);
        setUser(null);
      }
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
