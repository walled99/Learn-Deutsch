/**
 * LernDeutsch AI - AI Service
 * Integration with Gemini 2.5 Flash for vocabulary extraction.
 * Features: retry with exponential backoff, timeout, MIME detection.
 */

import * as FileSystem from "expo-file-system/legacy";
import { GEMINI_API_KEY } from "../config/env";
import type { ExtractedWord, ExtractionResult } from "../types";

const GEMINI_API_URL = (key: string) =>
  `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${key}`;

/** Max retry attempts for transient failures */
const MAX_RETRIES = 3;

/** Request timeout in milliseconds */
const REQUEST_TIMEOUT_MS = 30_000;

/**
 * Detect MIME type from a file URI based on its extension.
 */
const detectMimeType = (uri: string): string => {
  const lower = uri.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".bmp")) return "image/bmp";
  if (lower.endsWith(".heic") || lower.endsWith(".heif")) return "image/heic";
  // Default to JPEG for .jpg, .jpeg, or unknown
  return "image/jpeg";
};

/**
 * Get a user-friendly error message for HTTP status codes.
 */
const getHttpErrorMessage = (status: number): string => {
  switch (status) {
    case 400:
      return "Bad request — the image may be corrupted or unsupported.";
    case 401:
    case 403:
      return "API key is invalid or expired. Please check your Gemini API key.";
    case 404:
      return "AI model not found. The API endpoint may have changed.";
    case 429:
      return "Rate limit exceeded. Please wait a moment and try again.";
    case 500:
    case 502:
    case 503:
      return "AI server is temporarily unavailable. Please try again shortly.";
    default:
      return `AI API returned error ${status}. Please try again.`;
  }
};

/**
 * Check if an HTTP status code is retryable (transient error).
 */
const isRetryableStatus = (status: number): boolean => {
  return status === 429 || status === 500 || status === 502 || status === 503;
};

/**
 * Sleep for a given number of milliseconds.
 */
const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch with a timeout.
 */
const fetchWithTimeout = async (
  url: string,
  options: RequestInit,
  timeoutMs: number,
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
};

/**
 * The system prompt for Gemini to ensure structured JSON output
 */
const SYSTEM_PROMPT = `
You are a German language expert AI. Your task is to extract German vocabulary from images.
For each word or phrase found, return a JSON array of objects.

RULES:
1. Extract the German word, its English translation, and a contextual example sentence.
2. For NOUNS: Include the definite article (der, die, das) and the plural form.
3. For VERBS: Include the helper verb (haben, sein) and the past participle.
4. Categorize each entry as: "Noun", "Verb", "Adjective", "Adverb", or "Phrase".
5. Return ONLY a valid JSON array. No markdown, no triple backticks.

JSON FORMAT:
[
  {
    "word": "Tisch",
    "article": "der",
    "plural": "Tische",
    "category": "Noun",
    "translation": "table",
    "example": "Der Tisch ist aus Holz."
  }
]
`;

/**
 * Extracts vocabulary from an image using Gemini AI.
 * Retries up to 3 times with exponential backoff for transient failures.
 */
export const extractVocabularyFromImage = async (
  imageUri: string,
): Promise<ExtractionResult> => {
  try {
    if (!GEMINI_API_KEY) {
      console.error("AI_ERROR: GEMINI_API_KEY is missing in env config");
      throw new Error(
        "Gemini API Key is not configured. Please check your .env file.",
      );
    }

    console.log("AI_LOG: Starting extraction for image");

    // 1. Convert image to Base64
    const base64Image = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // 2. Detect MIME type from file extension
    const mimeType = detectMimeType(imageUri);

    // 3. Prepare the request body
    const requestBody = {
      contents: [
        {
          parts: [
            { text: SYSTEM_PROMPT },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Image,
              },
            },
          ],
        },
      ],
    };

    // 4. Call Gemini API with retry logic
    let lastError: string = "";

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        if (attempt > 0) {
          const delayMs = Math.pow(2, attempt) * 1000; // 2s, 4s
          console.log(
            `AI_LOG: Retry attempt ${attempt + 1}/${MAX_RETRIES} after ${delayMs}ms`,
          );
          await sleep(delayMs);
        }

        const response = await fetchWithTimeout(
          GEMINI_API_URL(GEMINI_API_KEY),
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
          },
          REQUEST_TIMEOUT_MS,
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error(
            `AI_API_ERROR: ${response.status} (attempt ${attempt + 1})`,
            errorText,
          );

          lastError = getHttpErrorMessage(response.status);

          // Only retry on transient errors
          if (isRetryableStatus(response.status)) {
            continue;
          }

          // Non-retryable error — fail immediately
          throw new Error(lastError);
        }

        const data = await response.json();

        // 5. Parse the AI response
        let jsonString = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!jsonString) {
          console.log("AI_RAW_RESPONSE: No text content in response parts");
          throw new Error("Empty response from AI");
        }

        console.log("AI_RAW_RESPONSE:", jsonString);

        // Failsafe: Remove markdown backticks if AI ignored the JSON mode
        jsonString = jsonString
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

        const words: ExtractedWord[] = JSON.parse(jsonString);

        return {
          success: true,
          words: words,
        };
      } catch (innerError: unknown) {
        if (innerError instanceof Error && innerError.name === "AbortError") {
          lastError =
            "Request timed out. Please check your connection and try again.";
          continue; // Retry on timeout
        }
        throw innerError; // Re-throw non-timeout errors
      }
    }

    // All retries exhausted
    return {
      success: false,
      words: [],
      error: lastError || "Failed after multiple attempts. Please try again.",
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown AI extraction error";
    console.error("AI Extraction Error:", error);
    return {
      success: false,
      words: [],
      error: message,
    };
  }
};
