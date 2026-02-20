/**
 * LernDeutsch AI - Vocabulary Service
 * CRUD operations for vocabulary management
 */

import { supabase } from "./supabase";
import type { Vocabulary, VocabularyFormData, FilterState } from "../types";

export interface VocabularyResult {
  success: boolean;
  data?: Vocabulary | Vocabulary[];
  error?: string;
}

/**
 * Sanitize user search input to prevent query injection in Supabase .or() filters.
 * Escapes special characters that could break or manipulate the filter string.
 */
const sanitizeSearchInput = (input: string): string => {
  return input
    .replace(/\\/g, "\\\\") // escape backslashes first
    .replace(/%/g, "\\%")   // escape percent (LIKE wildcard)
    .replace(/,/g, "")      // remove commas (Supabase filter separator)
    .replace(/\./g, "")     // remove dots (Supabase operator separator)
    .trim();
};

/**
 * Fetch all vocabulary for current user
 */
export const fetchVocabulary = async (
  filters?: Partial<FilterState>,
): Promise<VocabularyResult> => {
  try {
    let query = supabase
      .from("vocabulary")
      .select("*")
      .order("created_at", { ascending: false });

    // Apply filters
    if (filters?.category && filters.category !== "All") {
      query = query.eq("category", filters.category);
    }

    if (filters?.status && filters.status !== "All") {
      query = query.eq("status", filters.status);
    }

    if (filters?.searchQuery) {
      const safe = sanitizeSearchInput(filters.searchQuery);
      if (safe.length > 0) {
        query = query.or(
          `word.ilike.%${safe}%,translation.ilike.%${safe}%`,
        );
      }
    }

    const { data, error } = await query;

    if (error) throw error;

    return { success: true, data: data as Vocabulary[] };
  } catch (error: unknown) {
    console.error("Fetch vocabulary error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
};

/**
 * Fetch single vocabulary by ID
 */
export const fetchVocabularyById = async (
  id: string,
): Promise<VocabularyResult> => {
  try {
    const { data, error } = await supabase
      .from("vocabulary")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return { success: true, data: data as Vocabulary };
  } catch (error: unknown) {
    console.error("Fetch vocabulary by ID error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
};

/**
 * Create new vocabulary entry
 */
export const createVocabulary = async (
  formData: VocabularyFormData,
): Promise<VocabularyResult> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("vocabulary")
      .insert({
        user_id: user.id,
        word: formData.word.trim(),
        article: formData.article || null,
        plural: formData.plural?.trim() || null,
        helper_verb: formData.helper_verb || null,
        past_participle: formData.past_participle?.trim() || null,
        translation: formData.translation.trim(),
        example: formData.example?.trim() || null,
        category: formData.category,
        status: formData.status || "New",
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data: data as Vocabulary };
  } catch (error: unknown) {
    console.error("Create vocabulary error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
};

/**
 * Update existing vocabulary entry
 */
export const updateVocabulary = async (
  id: string,
  formData: Partial<VocabularyFormData>,
): Promise<VocabularyResult> => {
  try {
    const updateData: any = {};

    if (formData.word !== undefined) updateData.word = formData.word.trim();
    if (formData.article !== undefined) updateData.article = formData.article;
    if (formData.plural !== undefined)
      updateData.plural = formData.plural?.trim() || null;
    if (formData.helper_verb !== undefined)
      updateData.helper_verb = formData.helper_verb;
    if (formData.past_participle !== undefined)
      updateData.past_participle = formData.past_participle?.trim() || null;
    if (formData.translation !== undefined)
      updateData.translation = formData.translation.trim();
    if (formData.example !== undefined)
      updateData.example = formData.example?.trim() || null;
    if (formData.category !== undefined)
      updateData.category = formData.category;
    if (formData.status !== undefined) updateData.status = formData.status;

    const { data, error } = await supabase
      .from("vocabulary")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data: data as Vocabulary };
  } catch (error: unknown) {
    console.error("Update vocabulary error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
};

/**
 * Delete vocabulary entry
 */
export const deleteVocabulary = async (
  id: string,
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.from("vocabulary").delete().eq("id", id);

    if (error) throw error;

    return { success: true };
  } catch (error: unknown) {
    console.error("Delete vocabulary error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
};

/**
 * Bulk create vocabulary entries (for AI extraction)
 */
export const bulkCreateVocabulary = async (
  items: VocabularyFormData[],
): Promise<VocabularyResult> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("User not authenticated");

    const insertData = items.map((item) => ({
      user_id: user.id,
      word: item.word.trim(),
      article: item.article || null,
      plural: item.plural?.trim() || null,
      helper_verb: item.helper_verb || null,
      past_participle: item.past_participle?.trim() || null,
      translation: item.translation.trim(),
      example: item.example?.trim() || null,
      category: item.category,
      status: item.status || "New",
    }));

    const { data, error } = await supabase
      .from("vocabulary")
      .insert(insertData)
      .select();

    if (error) throw error;

    return { success: true, data: data as Vocabulary[] };
  } catch (error: unknown) {
    console.error("Bulk create vocabulary error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
};

/**
 * Check for duplicate vocabulary
 */
export const checkDuplicate = async (
  word: string,
  category: string,
): Promise<{ exists: boolean; existing?: Vocabulary }> => {
  try {
    const { data, error } = await supabase
      .from("vocabulary")
      .select("*")
      .ilike("word", word.trim())
      .eq("category", category)
      .maybeSingle();

    if (error) throw error;

    return { exists: !!data, existing: data as Vocabulary | undefined };
  } catch (error) {
    console.error("Check duplicate error:", error);
    return { exists: false };
  }
};

/**
 * Update mastery status
 */
export const updateMasteryStatus = async (
  id: string,
  status: "New" | "Learning" | "Reviewing" | "Mastered",
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from("vocabulary")
      .update({ status })
      .eq("id", id);

    if (error) throw error;

    return { success: true };
  } catch (error: unknown) {
    console.error("Update mastery status error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
};

/**
 * Get vocabulary statistics
 */
export const getVocabularyStats = async (): Promise<{
  total: number;
  byStatus: Record<string, number>;
  byCategory: Record<string, number>;
  recentCount: number;
}> => {
  try {
    const { data, error } = await supabase
      .from("vocabulary")
      .select("status, category, created_at");

    if (error) throw error;

    const items = data || [];
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const byStatus: Record<string, number> = {
      New: 0,
      Learning: 0,
      Reviewing: 0,
      Mastered: 0,
    };

    const byCategory: Record<string, number> = {
      Noun: 0,
      Verb: 0,
      Adjective: 0,
      Adverb: 0,
      Phrase: 0,
    };

    let recentCount = 0;

    items.forEach((item: any) => {
      byStatus[item.status] = (byStatus[item.status] || 0) + 1;
      byCategory[item.category] = (byCategory[item.category] || 0) + 1;

      if (new Date(item.created_at) > oneWeekAgo) {
        recentCount++;
      }
    });

    return {
      total: items.length,
      byStatus,
      byCategory,
      recentCount,
    };
  } catch (error) {
    console.error("Get vocabulary stats error:", error);
    return {
      total: 0,
      byStatus: {},
      byCategory: {},
      recentCount: 0,
    };
  }
};
