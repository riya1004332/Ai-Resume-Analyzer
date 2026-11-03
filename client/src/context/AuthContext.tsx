import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient, Session, User } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'dev-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  register: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check initial session
    const initAuth = async () => {
      try {
        const isLive = SUPABASE_URL.startsWith('https://') && SUPABASE_ANON_KEY !== 'dev-anon-key';
        if (isLive) {
          const { data: { session } } = await supabase.auth.getSession();
          setSession(session);
          setUser(session?.user ?? null);
          if (session?.access_token) {
            localStorage.setItem('auth_token', session.access_token);
          }
        } else {
          // Check if local dev token exists
          const savedToken = localStorage.getItem('auth_token');
          const savedUser = localStorage.getItem('auth_user');
          if (savedToken && savedUser) {
            try {
              setUser(JSON.parse(savedUser));
            } catch {
              // Ignore
            }
          }
        }
      } catch (err) {
        console.error('Error restoring auth session:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.access_token) {
        localStorage.setItem('auth_token', session.access_token);
      } else if (!session && SUPABASE_URL.startsWith('https://')) {
        localStorage.removeItem('auth_token');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const isLive = SUPABASE_URL.startsWith('https://') && SUPABASE_ANON_KEY !== 'dev-anon-key';
      if (isLive) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { error: error.message };
        setUser(data.user);
        setSession(data.session);
        if (data.session?.access_token) {
          localStorage.setItem('auth_token', data.session.access_token);
        }
        return { error: null };
      }

      // Standalone development login
      const mockUser: any = {
        id: '00000000-0000-0000-0000-000000000001',
        email,
        user_metadata: { full_name: email.split('@')[0] }
      };
      setUser(mockUser);
      localStorage.setItem('auth_token', 'dev-token');
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, fullName: string) => {
    setIsLoading(true);
    try {
      const isLive = SUPABASE_URL.startsWith('https://') && SUPABASE_ANON_KEY !== 'dev-anon-key';
      if (isLive) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName }
          }
        });
        if (error) return { error: error.message };
        if (data.user && !data.session) {
          return { error: null }; // Signup successful, confirmation email may be required
        }
        setUser(data.user);
        setSession(data.session);
        if (data.session?.access_token) {
          localStorage.setItem('auth_token', data.session.access_token);
        }
        return { error: null };
      }

      // Standalone development registration
      const mockUser: any = {
        id: '00000000-0000-0000-0000-000000000001',
        email,
        user_metadata: { full_name: fullName }
      };
      setUser(mockUser);
      localStorage.setItem('auth_token', 'dev-token');
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      const isLive = SUPABASE_URL.startsWith('https://') && SUPABASE_ANON_KEY !== 'dev-anon-key';
      if (isLive) {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/dashboard`
          }
        });
        if (error) return { error: error.message };
        return { error: null };
      }

      // Standalone development mock Google sign-in
      const mockUser: any = {
        id: '00000000-0000-0000-0000-000000000001',
        email: 'google.dev@example.com',
        user_metadata: { full_name: 'Google User', avatar_url: 'https://lh3.googleusercontent.com/a/default' }
      };
      setUser(mockUser);
      localStorage.setItem('auth_token', 'dev-token');
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'Google sign-in failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const isLive = SUPABASE_URL.startsWith('https://') && SUPABASE_ANON_KEY !== 'dev-anon-key';
      if (isLive) {
        await supabase.auth.signOut();
      }
    } finally {
      setUser(null);
      setSession(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const isLive = SUPABASE_URL.startsWith('https://') && SUPABASE_ANON_KEY !== 'dev-anon-key';
      if (isLive) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`
        });
        if (error) return { error: error.message };
      }
      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'Password reset request failed' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        login,
        register,
        signInWithGoogle,
        logout,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

