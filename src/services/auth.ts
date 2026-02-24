/**
 * LernDeutsch AI - Authentication Service
 * Refactored to use shared profile helper — no more duplicated logic.
 */

import { supabase } from "./supabase";
import { getOrCreateProfile, buildUserFromProfile } from "./profileHelper";
import type { User, Profile } from "../types";

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

/**
 * Sign up with email and password
 */
export const signUp = async (
  email: string,
  password: string,
  displayName?: string,
): Promise<AuthResult> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });

    if (error) throw error;

    if (data.user) {
      // Create profile entry
      await supabase.from("profiles").insert({
        id: data.user.id,
        display_name: displayName || null,
      });

      const profile = await getOrCreateProfile(data.user.id, {
        display_name: displayName || null,
      });

      return {
        success: true,
        user: buildUserFromProfile(
          data.user.id,
          data.user.email || "",
          profile,
        ),
      };
    }

    return { success: false, error: "Unknown error during sign up" };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown sign up error";
    console.error("Sign up error:", error);
    return { success: false, error: message };
  }
};

/**
 * Sign in with email and password
 */
export const signIn = async (
  email: string,
  password: string,
): Promise<AuthResult> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      const profile = await getOrCreateProfile(data.user.id, {
        display_name: data.user.user_metadata?.display_name || null,
      });

      return {
        success: true,
        user: buildUserFromProfile(
          data.user.id,
          data.user.email || "",
          profile,
        ),
      };
    }

    return { success: false, error: "Unknown error during sign in" };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown sign in error";
    console.error("Sign in error:", error);
    return { success: false, error: message };
  }
};

/**
 * Sign out current user
 */
export const signOut = async (): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown sign out error";
    console.error("Sign out error:", error);
    return { success: false, error: message };
  }
};

/**
 * Helper: Check if error is a harmless "session missing" error
 */
const isSessionMissingError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return (
      error.message?.includes("Auth session missing") ||
      (error as any).name === "AuthSessionMissingError"
    );
  }
  try {
    return JSON.stringify(error).includes("Auth session missing");
  } catch {
    return false;
  }
};

/**
 * Get current session
 */
export const getCurrentSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      if (!isSessionMissingError(error)) throw error;
      return null;
    }
    return data.session;
  } catch (error: unknown) {
    if (!isSessionMissingError(error)) {
      console.error("Get session error:", error);
    }
    return null;
  }
};

/**
 * Get current user
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      if (!isSessionMissingError(error)) throw error;
      return null;
    }

    if (user) {
      const profile = await getOrCreateProfile(user.id, {
        display_name: user.user_metadata?.display_name || null,
      });

      return buildUserFromProfile(user.id, user.email || "", profile);
    }
    return null;
  } catch (error: unknown) {
    if (!isSessionMissingError(error)) {
      console.error("Get user error:", error);
    }
    return null;
  }
};

/**
 * Reset password
 */
export const resetPassword = async (
  email: string,
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return { success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown reset error";
    console.error("Reset password error:", error);
    return { success: false, error: message };
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (
  userId: string,
  updates: Partial<Profile>,
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from("profiles")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) throw error;
    return { success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown profile update error";
    console.error("Update profile error:", error);
    return { success: false, error: message };
  }
};

/**
 * Listen to auth state changes
 */
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      try {
        const user = await getCurrentUser();
        callback(user);
      } catch {
        // Fallback: build user from session data if getCurrentUser fails
        const profile = {
          id: session.user.id,
          display_name: session.user.user_metadata?.display_name || null,
          avatar_url: null,
          updated_at: new Date().toISOString(),
        };
        callback(
          buildUserFromProfile(
            session.user.id,
            session.user.email || "",
            profile,
          ),
        );
      }
    } else {
      callback(null);
    }
  });
};
