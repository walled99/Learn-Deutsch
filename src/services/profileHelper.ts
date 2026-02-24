/**
 * LernDeutsch AI - Profile Helper
 * Shared logic for fetching/creating user profiles from Supabase.
 * Eliminates duplication across auth.ts functions.
 */

import { supabase } from "./supabase";
import type { User, Profile } from "../types";

/**
 * Fetch a user's profile from the DB, or create one if it doesn't exist.
 * Falls back to auth metadata if DB operations fail.
 */
export const getOrCreateProfile = async (
    userId: string,
    metadata?: { display_name?: string | null },
): Promise<Profile> => {
    // Try fetching existing profile
    let { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

    // If no profile exists, create one from metadata
    if (!profile) {
        const displayName = metadata?.display_name || null;
        await supabase.from("profiles").upsert({
            id: userId,
            display_name: displayName,
        });
        const { data: newProfile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();
        profile = newProfile;
    }

    // Last resort: build profile from metadata if DB still fails
    return (
        profile || {
            id: userId,
            display_name: metadata?.display_name || null,
            avatar_url: null,
            updated_at: new Date().toISOString(),
        }
    );
};

/**
 * Build a full User object from a Supabase auth user + profile.
 */
export const buildUserFromProfile = (
    userId: string,
    email: string,
    profile: Profile,
): User => ({
    id: userId,
    email,
    profile,
});
