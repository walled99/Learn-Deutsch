/**
 * LernDeutsch AI - Auth Hook
 */

import React, {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";
import type { User, AuthState, Profile } from "../types";
import {
  signIn as authSignIn,
  signUp as authSignUp,
  signOut as authSignOut,
  getCurrentUser,
  onAuthStateChange,
  resetPassword as authResetPassword,
} from "../services/auth";
import { supabase } from "../services/supabase";

interface AuthContextType extends AuthState {
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  signUp: (
    email: string,
    password: string,
    displayName?: string,
  ) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (
    email: string,
  ) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const useAuthProvider = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    let mounted = true;

    // Use getSession() (local storage only, no network call) for fast init
    const initAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (error || !session?.user) {
          setState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          });
          return;
        }

        // Build user from session data (no network needed)
        const sessionUser = session.user;
        const profile: Profile = {
          id: sessionUser.id,
          display_name: sessionUser.user_metadata?.display_name || null,
          avatar_url: null,
          updated_at: new Date().toISOString(),
        };

        setState({
          user: {
            id: sessionUser.id,
            email: sessionUser.email || "",
            profile,
          },
          isLoading: false,
          isAuthenticated: true,
        });

        // Fetch full profile from DB in background (non-blocking)
        getCurrentUser()
          .then((fullUser) => {
            if (mounted && fullUser) {
              setState((prev) => ({ ...prev, user: fullUser }));
            }
          })
          .catch(() => {});
      } catch (error) {
        console.error("Auth initialization failed:", error);
        if (mounted) {
          setState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      }
    };

    // Safety timeout: if init takes too long, assume not authenticated
    const timeout = setTimeout(() => {
      if (mounted) {
        setState((prev) => {
          if (prev.isLoading) {
            console.warn("Auth initialization timed out after 5s");
            return { user: null, isLoading: false, isAuthenticated: false };
          }
          return prev;
        });
      }
    }, 5000);

    initAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = onAuthStateChange((user) => {
      if (mounted) {
        setState({
          user,
          isLoading: false,
          isAuthenticated: !!user,
        });
      }
    });

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    const result = await authSignIn(email, password);

    if (result.success && result.user) {
      setState({
        user: result.user,
        isLoading: false,
        isAuthenticated: true,
      });
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }

    return { success: result.success, error: result.error };
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, displayName?: string) => {
      setState((prev) => ({ ...prev, isLoading: true }));
      const result = await authSignUp(email, password, displayName);

      if (result.success && result.user) {
        setState({
          user: result.user,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }

      return { success: result.success, error: result.error };
    },
    [],
  );

  const signOut = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    await authSignOut();
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    return await authResetPassword(email);
  }, []);

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };
};

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const auth = useAuthProvider();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export { AuthContext };
