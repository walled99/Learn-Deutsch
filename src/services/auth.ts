/**
 * LernDeutsch AI - Authentication Service
 */

import { supabase } from "./supabase";
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

      // Fetch profile to include in returned user
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      // Last resort: build profile from provided name if DB fails
      const finalProfile: Profile = profile || {
        id: data.user.id,
        display_name: displayName || null,
        avatar_url: null,
        updated_at: new Date().toISOString(),
      };

      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email || "",
          profile: finalProfile,
        },
      };
    }

    return { success: false, error: "Unknown error during sign up" };
  } catch (error: any) {
    console.error("Sign up error:", error);
    return { success: false, error: error.message };
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
      // Fetch profile to include display_name
      let { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      // If profile doesn't exist yet, create it from auth metadata
      if (!profile) {
        const metaName = data.user.user_metadata?.display_name || null;
        await supabase.from("profiles").upsert({
          id: data.user.id,
          display_name: metaName,
        });
        const { data: newProfile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();
        profile = newProfile;
      }

      // Last resort: build profile from auth metadata if DB still fails
      const finalProfile: Profile = profile || {
        id: data.user.id,
        display_name: data.user.user_metadata?.display_name || null,
        avatar_url: null,
        updated_at: new Date().toISOString(),
      };

      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email || "",
          profile: finalProfile,
        },
      };
    }

    return { success: false, error: "Unknown error during sign in" };
  } catch (error: any) {
    console.error("Sign in error:", error);
    return { success: false, error: error.message };
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
  } catch (error: any) {
    console.error("Sign out error:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Get current session
 */
export const getCurrentSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      // Filter out "Auth session missing!" error
      // The error object might be a structured Supabase error or a simple object
      const isSessionMissing =
        error.message?.includes("Auth session missing") ||
        (error as any).name === "AuthSessionMissingError" ||
        JSON.stringify(error).includes("Auth session missing");

      if (!isSessionMissing) {
        throw error;
      }
      return null;
    }
    return data.session;
  } catch (error: any) {
    const isSessionMissing =
      error?.message?.includes("Auth session missing") ||
      error?.name === "AuthSessionMissingError" ||
      JSON.stringify(error).includes("Auth session missing");

    if (!isSessionMissing) {
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
      const isSessionMissing =
        error.message?.includes("Auth session missing") ||
        (error as any).name === "AuthSessionMissingError" ||
        JSON.stringify(error).includes("Auth session missing");

      if (!isSessionMissing) {
        throw error;
      }
      return null;
    }

    if (user) {
      // Fetch profile
      let { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      // If profile doesn't exist, create it from auth metadata
      if (!profile) {
        const metaName = user.user_metadata?.display_name || null;
        await supabase.from("profiles").upsert({
          id: user.id,
          display_name: metaName,
        });
        const { data: newProfile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        profile = newProfile;
      }

      // Last resort: build profile from auth metadata if DB still fails
      const finalProfile: Profile = profile || {
        id: user.id,
        display_name: user.user_metadata?.display_name || null,
        avatar_url: null,
        updated_at: new Date().toISOString(),
      };

      return {
        id: user.id,
        email: user.email || "",
        profile: finalProfile,
      };
    }
    return null;
  } catch (error: any) {
    const isSessionMissing =
      error?.message?.includes("Auth session missing") ||
      error?.name === "AuthSessionMissingError" ||
      JSON.stringify(error).includes("Auth session missing");

    if (!isSessionMissing) {
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
  } catch (error: any) {
    console.error("Reset password error:", error);
    return { success: false, error: error.message };
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
  } catch (error: any) {
    console.error("Update profile error:", error);
    return { success: false, error: error.message };
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
        callback({
          id: session.user.id,
          email: session.user.email || "",
          profile: {
            id: session.user.id,
            display_name: session.user.user_metadata?.display_name || null,
            avatar_url: null,
            updated_at: new Date().toISOString(),
          },
        });
      }
    } else {
      callback(null);
    }
  });
};
