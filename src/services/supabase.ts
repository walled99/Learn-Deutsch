/**
 * LernDeutsch AI - Supabase Client Configuration
 */

import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../config/env";

// ============ Supabase Client ============
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// ============ Storage Bucket Names ============
export const STORAGE_BUCKETS = {
  avatars: "avatars",
};

// ============ Helper Functions ============

/**
 * Detect MIME type from a file URI based on its extension.
 */
const detectImageMimeType = (uri: string): string => {
  const lower = uri.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".bmp")) return "image/bmp";
  if (lower.endsWith(".heic") || lower.endsWith(".heif")) return "image/heic";
  return "image/jpeg";
};

/**
 * Upload an image to Supabase Storage
 */
export const uploadImage = async (
  uri: string,
  bucket: string,
  path: string,
): Promise<{ url: string | null; error: Error | null }> => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const mimeType = detectImageMimeType(uri);

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, blob, {
        contentType: mimeType,
        upsert: false,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return { url: urlData.publicUrl, error: null };
  } catch (error: unknown) {
    console.error("Upload error:", error);
    return { url: null, error: error instanceof Error ? error : new Error(String(error)) };
  }
};

/**
 * Get signed URL for private images
 */
export const getSignedUrl = async (
  bucket: string,
  path: string,
  expiresIn: number = 3600,
): Promise<string | null> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) throw error;
    return data.signedUrl;
  } catch (error: unknown) {
    console.error("Signed URL error:", error);
    return null;
  }
};
