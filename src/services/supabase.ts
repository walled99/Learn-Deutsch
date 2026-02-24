/**
 * LernDeutsch AI - Supabase Client Configuration
 */

import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../config/env";

// ============ SecureStore Chunked Adapter for Auth ============
// SecureStore has a 2048-byte limit per key, but Supabase session
// JSON can be larger. This adapter splits values into chunks.
const CHUNK_SIZE = 1800; // stay safely under 2048 bytes

function getChunkKey(key: string, index: number): string {
  return index === 0 ? key : `${key}__chunk_${index}`;
}

const SecureStoreAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      const firstChunk = await SecureStore.getItemAsync(key);
      if (firstChunk === null) return null;

      // Check if there are additional chunks
      let result = firstChunk;
      let index = 1;
      while (true) {
        const chunk = await SecureStore.getItemAsync(getChunkKey(key, index));
        if (chunk === null) break;
        result += chunk;
        index++;
      }
      return result;
    } catch (error) {
      console.error("SecureStore getItem error:", error);
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      // Split value into chunks that fit within SecureStore limits
      const chunks: string[] = [];
      for (let i = 0; i < value.length; i += CHUNK_SIZE) {
        chunks.push(value.slice(i, i + CHUNK_SIZE));
      }

      // Write all chunks
      for (let i = 0; i < chunks.length; i++) {
        await SecureStore.setItemAsync(getChunkKey(key, i), chunks[i]);
      }

      // Clean up any leftover chunks from a previously longer value
      let cleanupIndex = chunks.length;
      while (true) {
        const old = await SecureStore.getItemAsync(
          getChunkKey(key, cleanupIndex),
        );
        if (old === null) break;
        await SecureStore.deleteItemAsync(getChunkKey(key, cleanupIndex));
        cleanupIndex++;
      }
    } catch (error) {
      console.error("SecureStore setItem error:", error);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      // Remove base key and all chunks
      await SecureStore.deleteItemAsync(key);
      let index = 1;
      while (true) {
        const chunk = await SecureStore.getItemAsync(getChunkKey(key, index));
        if (chunk === null) break;
        await SecureStore.deleteItemAsync(getChunkKey(key, index));
        index++;
      }
    } catch (error) {
      console.error("SecureStore removeItem error:", error);
    }
  },
};

// ============ Supabase Client ============
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: SecureStoreAdapter,
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
