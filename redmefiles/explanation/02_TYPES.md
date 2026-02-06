# Types Folder - TypeScript Type Definitions

**Location:** `src/types/`  
**Purpose:** Defines the shape of all data used throughout the application

---

## Why Types Matter

TypeScript types:

1. **Prevent bugs** - Catch errors before running the code
2. **Improve editor support** - Auto-complete suggestions
3. **Document data** - Show exactly what fields exist
4. **Match database** - Types mirror Supabase database schema

---

## File: index.ts

This single file contains all type definitions for the project.

---

## 1. Enum Types (Fixed Value Options)

These types can only have specific predefined values.

### WordCategory

```typescript
export type WordCategory = "Noun" | "Verb" | "Adjective" | "Adverb" | "Phrase";
```

**Used for:** Classifying vocabulary words by type

| Value         | Description     | Example              |
| ------------- | --------------- | -------------------- |
| `"Noun"`      | Things/objects  | der Tisch (table)    |
| `"Verb"`      | Actions         | gehen (to go)        |
| `"Adjective"` | Describes nouns | schnell (fast)       |
| `"Adverb"`    | Describes verbs | sehr (very)          |
| `"Phrase"`    | Multiple words  | Guten Tag (Good day) |

### MasteryStatus

```typescript
export type MasteryStatus = "New" | "Learning" | "Reviewing" | "Mastered";
```

**Used for:** Tracking learning progress

| Status        | Meaning                         |
| ------------- | ------------------------------- |
| `"New"`       | Just added, not studied         |
| `"Learning"`  | Currently studying              |
| `"Reviewing"` | Know it, reviewing periodically |
| `"Mastered"`  | Fully learned                   |

### GenderArticle

```typescript
export type GenderArticle = "der" | "die" | "das";
```

**Used for:** German noun genders

| Article | Gender    | Color in UI |
| ------- | --------- | ----------- |
| `"der"` | Masculine | Blue        |
| `"die"` | Feminine  | Pink        |
| `"das"` | Neuter    | Green       |

### HelperVerb

```typescript
export type HelperVerb = "haben" | "sein";
```

**Used for:** German verbs in perfect tense

| Verb      | Usage                 | Example          |
| --------- | --------------------- | ---------------- |
| `"haben"` | Most verbs            | Ich habe gemacht |
| `"sein"`  | Movement/state change | Ich bin gegangen |

---

## 2. Database Model Types

These match the Supabase database tables exactly.

### Vocabulary (Main Data Model)

```typescript
export interface Vocabulary {
  id: string; // Unique ID (UUID)
  user_id: string; // Who owns this word
  word: string; // German word
  article: GenderArticle | null; // der/die/das (for nouns)
  plural: string | null; // Plural form (for nouns)
  helper_verb: HelperVerb | null; // haben/sein (for verbs)
  past_participle: string | null; // Past form (for verbs)
  translation: string; // English meaning
  example: string | null; // Example sentence
  category: WordCategory; // Noun/Verb/etc.
  status: MasteryStatus; // Learning progress
  image_url: string | null; // Source image URL
  created_at: string; // When added
  updated_at?: string; // Last modified
}
```

**Relationship diagram:**

```
┌──────────────────────────────────────────────────────────────┐
│                      Vocabulary                               │
├──────────────────────────────────────────────────────────────┤
│ id: string (primary key)                                      │
│ user_id: string ───────────────────▶ belongs to one User     │
│                                                               │
│ word: string ──────────── "Tisch"                            │
│ translation: string ───── "table"                             │
│ category: WordCategory ── "Noun"                              │
│                                                               │
│ IF category == "Noun":                                        │
│   article: "der" | "die" | "das"                             │
│   plural: "Tische"                                           │
│                                                               │
│ IF category == "Verb":                                        │
│   helper_verb: "haben" | "sein"                              │
│   past_participle: "gegangen"                                │
│                                                               │
│ status: MasteryStatus ─── Learning progress                  │
│ image_url: string ─────── Source image reference             │
└──────────────────────────────────────────────────────────────┘
```

### Profile

```typescript
export interface Profile {
  id: string; // Same as user ID
  display_name: string | null; // User's chosen name
  avatar_url: string | null; // Profile picture URL
  updated_at: string; // Last update time
}
```

---

## 3. Form Types

Types used when creating or editing data.

### VocabularyFormData

```typescript
export interface VocabularyFormData {
  word: string; // Required: German word
  article?: GenderArticle | null; // Optional: for nouns
  plural?: string; // Optional: for nouns
  helper_verb?: HelperVerb | null; // Optional: for verbs
  past_participle?: string; // Optional: for verbs
  translation: string; // Required: English meaning
  example?: string; // Optional: example sentence
  category: WordCategory; // Required: word type
  status: MasteryStatus; // Required: learning level
}
```

**How it's used:**

```typescript
// Creating a new noun
const newNoun: VocabularyFormData = {
  word: "Haus",
  article: "das",
  plural: "Häuser",
  translation: "house",
  category: "Noun",
  status: "New",
};

// Creating a new verb
const newVerb: VocabularyFormData = {
  word: "gehen",
  helper_verb: "sein",
  past_participle: "gegangen",
  translation: "to go",
  category: "Verb",
  status: "New",
};
```

---

## 4. AI Extraction Types

Types for AI-processed vocabulary data.

### ExtractedWord

```typescript
export interface ExtractedWord {
  word: string;
  article?: GenderArticle;
  plural?: string;
  helper_verb?: HelperVerb;
  past_participle?: string;
  translation: string;
  example?: string;
  category: WordCategory;
  confidence?: number; // AI confidence (0-1)
}
```

### ExtractionResult

```typescript
export interface ExtractionResult {
  success: boolean; // Did extraction work?
  words: ExtractedWord[]; // Extracted words
  rawText?: string; // Original text found
  error?: string; // Error message if failed
}
```

---

## 5. Navigation Types

Define what parameters each screen receives.

### Stack Parameter Lists

```typescript
// Root Navigator
export type RootStackParamList = {
  Auth: undefined; // No params
  Main: undefined; // No params
};

// Auth Navigator
export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

// Main Tab Navigator
export type MainTabParamList = {
  Dashboard: undefined;
  Capture: undefined;
  Library: undefined;
  Profile: undefined;
};

// Capture Navigator
export type CaptureStackParamList = {
  CaptureHome: undefined;
  Camera: undefined;
  Processing: { imageUri: string }; // Needs image path
  Review: {
    extractedWords: ExtractedWord[]; // AI results
    imageUri: string; // Source image
  };
};

// Library Navigator
export type LibraryStackParamList = {
  LibraryHome: undefined;
  VocabularyDetail: { vocabularyId: string }; // Word ID
  EditVocabulary: { vocabulary: Vocabulary }; // Full word data
};
```

**How navigation types work:**

```typescript
// Navigating with parameters
navigation.navigate("Processing", { imageUri: "file://..." });

// TypeScript will error if you forget parameters:
navigation.navigate("Processing"); // ❌ Error: missing imageUri

// Or if you pass wrong type:
navigation.navigate("Processing", { imageUri: 123 }); // ❌ Error: number not string
```

---

## 6. UI State Types

### FilterState

```typescript
export interface FilterState {
  category: WordCategory | "All"; // Filter by category
  status: MasteryStatus | "All"; // Filter by status
  searchQuery: string; // Search text
}
```

### SyncState (for future offline support)

```typescript
export interface SyncState {
  isSyncing: boolean; // Currently syncing?
  lastSyncTime: string | null; // When last synced
  pendingChanges: number; // Unsynced changes count
  isOnline: boolean; // Network connected?
}
```

---

## 7. User Types

### User

```typescript
export interface User {
  id: string;
  email: string;
  profile?: Profile; // Optional profile data
}
```

### AuthState

```typescript
export interface AuthState {
  user: User | null; // Current user (null if logged out)
  isLoading: boolean; // Checking auth status?
  isAuthenticated: boolean; // Is user logged in?
}
```

---

## Type Relationship Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     TYPE RELATIONSHIPS                       │
└─────────────────────────────────────────────────────────────┘

  User ──────────┬────────────────────────▶ Profile
                 │
                 │ owns many
                 ▼
           ┌──────────┐
           │Vocabulary│ ◀────── VocabularyFormData (create/edit)
           └──────────┘
                 ▲
                 │ extracted from
                 │
           ExtractedWord ◀────── ExtractionResult (AI output)


  FilterState ────────▶ Used by Library screen to filter Vocabulary


  Navigation Types ────▶ Define what data screens receive

```

---

## How Types Are Used Throughout the App

| Location   | Types Used                                 |
| ---------- | ------------------------------------------ |
| Services   | Vocabulary, User, AuthResult               |
| Hooks      | AuthState, FilterState, VocabularyFormData |
| Screens    | Navigation types, Vocabulary               |
| Components | Vocabulary, ExtractedWord                  |

---

## Summary

The `types/index.ts` file:

- Defines all data shapes used in the app
- Mirrors the database schema from Supabase
- Enables TypeScript checking for safety
- Provides auto-completion in editor
- Documents what fields each object has
