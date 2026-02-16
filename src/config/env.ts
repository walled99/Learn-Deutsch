/**
 * LernDeutsch AI - Environment Configuration
 *
 * These values are loaded from environment variables at build time.
 * In development, set them in .env file with the EXPO_PUBLIC_ prefix.
 *
 */

// Supabase Configuration
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Validate required env vars at startup
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    "[LernDeutsch] Missing Supabase environment variables. " +
      "Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file.",
  );
}

// App Configuration
export const APP_NAME = "LernDeutsch AI";
export const APP_VERSION = "1.0.0";

// Feature Flags
declare const __DEV__: boolean;
export const ENABLE_DEBUG_LOGGING =
  typeof __DEV__ !== "undefined" ? __DEV__ : true;
export const ENABLE_MOCK_DATA = false;

// AI Configuration (for Phase 3)
export const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? "";
