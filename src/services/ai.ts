/**
 * LernDeutsch AI - AI Service
 * Integration with Gemini 1.5 Flash for vocabulary extraction
 */

import * as FileSystem from 'expo-file-system/legacy'
import { GEMINI_API_KEY } from '../config/env';
import type { ExtractedWord, ExtractionResult } from '../types';

const GEMINI_API_URL = (key: string) => `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${key}`;

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
 * Extracts vocabulary from an image using Gemini AI
 */
export const extractVocabularyFromImage = async (imageUri: string): Promise<ExtractionResult> => {
  try {
    if (!GEMINI_API_KEY) {
      console.error("AI_ERROR: GEMINI_API_KEY is missing in env config");
      throw new Error("Gemini API Key is not configured. Please check your .env file.");
    }

    console.log("AI_LOG: Starting extraction for image (SDK 54 Tunnel Mode)");

    // 1. Convert image to Base64
    const base64Image = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // 2. Prepare the request body
    const requestBody = {
      contents: [
        {
          parts: [
            { text: SYSTEM_PROMPT },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: base64Image,
              },
            },
          ],
        },
      ],
    };

    // 3. Call Gemini API
    const response = await fetch(GEMINI_API_URL(GEMINI_API_KEY), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI_API_ERROR_BODY:", errorText);
      throw new Error(`AI API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    // 4. Parse the AI response
    let jsonString = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!jsonString) {
      console.log("AI_RAW_RESPONSE: No text content in response parts");
      throw new Error("Empty response from AI");
    }

    console.log("AI_RAW_RESPONSE:", jsonString);

    // Failsafe: Remove markdown backticks if AI ignored the JSON mode
    jsonString = jsonString.replace(/```json/g, "").replace(/```/g, "").trim();

    const words: ExtractedWord[] = JSON.parse(jsonString);
    
    return {
      success: true,
      words: words,
    };
  } catch (error: any) {
    console.error("AI Extraction Error:", error);
    return {
      success: false,
      words: [],
      error: error.message,
    };
  }
};
