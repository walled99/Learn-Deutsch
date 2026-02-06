# 10. Data Flow Documentation

This document explains how data moves through the LernDeutschAI app from user interaction to database and back.

---

## Overview Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER INTERACTION                                │
│                         (tap button, type text, etc.)                       │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                 SCREENS                                      │
│              (LoginScreen, DashboardScreen, LibraryHomeScreen, etc.)        │
│                                                                              │
│  - Capture user input                                                        │
│  - Display data to user                                                      │
│  - Handle loading/error states                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                  HOOKS                                       │
│                       (useAuth, useVocabulary)                              │
│                                                                              │
│  - Manage local state                                                        │
│  - Provide functions to screens                                              │
│  - Handle loading/error states                                               │
│  - Cache data in memory                                                      │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                SERVICES                                      │
│                    (auth.ts, vocabulary.ts, supabase.ts)                    │
│                                                                              │
│  - Format data for API                                                       │
│  - Make API calls                                                            │
│  - Handle responses                                                          │
│  - Transform data                                                            │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SUPABASE (BACKEND)                                 │
│                                                                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                      │
│  │    Auth     │    │  Database   │    │   Storage   │                      │
│  │  (users)    │    │ (vocabulary)│    │  (images)   │                      │
│  └─────────────┘    └─────────────┘    └─────────────┘                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Authentication Flow

### Sign Up Flow

```
User fills form → SignUpScreen → authService.signUp() → Supabase Auth
                                                              │
User logged in ← RootNavigator ← AuthContext updates ← Token stored
```

**Step by step:**

1. **User** types email and password in `SignUpScreen`
2. **SignUpScreen** validates input (email format, password match)
3. **Screen** calls `signUp(email, password)` from `useAuth` hook
4. **useAuth hook** sets `loading: true` and calls `authService.signUp()`
5. **auth.ts service** calls `supabase.auth.signUp()`
6. **Supabase** creates user and returns session with tokens
7. **auth.ts** stores tokens using `SecureStore`
8. **useAuth hook** updates `user` state and `isAuthenticated: true`
9. **RootNavigator** detects auth change and shows `MainTabNavigator`

### Sign In Flow

```
User enters credentials → LoginScreen → authService.signIn() → Supabase Auth
                                                                    │
User sees Dashboard ← MainTabNavigator ← Context updates ← Session returned
```

### Sign Out Flow

```
User taps logout → ProfileScreen → authService.signOut() → Clear tokens
                                                               │
User sees Login ← AuthNavigator ← Context clears ← State reset
```

---

## 2. Vocabulary CRUD Flow

### Create Vocabulary (Adding new word)

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 1. User captures image or fills form                                     │
│    Screen: CameraScreen → ProcessingScreen → ReviewScreen                │
└─────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 2. ReviewScreen submits vocabulary data                                  │
│    const newVocab = { germanWord, translation, example, ... }           │
└─────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 3. useVocabulary hook processes request                                  │
│    - Sets loading: true                                                  │
│    - Calls vocabularyService.create(newVocab)                           │
└─────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 4. vocabulary.ts service sends to Supabase                              │
│    - supabase.from('vocabulary').insert(data)                           │
└─────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 5. Supabase stores in PostgreSQL database                               │
│    - Returns created record with ID                                      │
└─────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 6. Data flows back up                                                    │
│    - Service returns new vocabulary                                      │
│    - Hook adds to local state array                                      │
│    - Screen re-renders with new item                                     │
└─────────────────────────────────────────────────────────────────────────┘
```

### Read Vocabulary (Loading words)

```
Screen mounts → useVocabulary fetches → service calls API → Supabase query
                                                                  │
Screen shows list ← Hook stores in state ← Service returns ← Data returned
```

**With filtering:**

```javascript
// User sets filters
filters = {
  partOfSpeech: "noun",
  difficulty: "A1",
  search: "haus",
};

// Hook applies filters
filteredVocabulary = vocabulary.filter((item) => {
  return (
    matchesPartOfSpeech(item) && matchesDifficulty(item) && matchesSearch(item)
  );
});

// Screen receives filtered list
```

### Update Vocabulary (Editing word)

```
User edits form → EditVocabularyScreen → service.update() → Supabase
                                                               │
Screen shows updated ← Hook updates state ← Service returns ← Row updated
```

### Delete Vocabulary (Removing word)

```
User confirms delete → VocabularyDetailScreen → service.delete() → Supabase
                                                                      │
Item removed from list ← Hook filters state ← Service returns ← Row deleted
```

---

## 3. Image Capture Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│ CaptureHomeScreen                                                        │
│ User chooses: Camera or Gallery                                          │
└─────────────────────────────────────────────────────────────────────────┘
                    │                           │
         ┌──────────┘                           └──────────┐
         ▼                                                 ▼
┌─────────────────────┐                      ┌─────────────────────┐
│    CameraScreen     │                      │   Image Picker      │
│  Uses expo-camera   │                      │ Uses expo-image-    │
│  Live camera view   │                      │ picker from gallery │
└─────────────────────┘                      └─────────────────────┘
         │                                                 │
         └──────────────────┬──────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ ProcessingScreen                                                         │
│ - Displays captured image                                                │
│ - (Future: OCR text extraction)                                          │
│ - (Future: AI translation)                                               │
└─────────────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ ReviewScreen                                                             │
│ - User verifies/edits extracted data                                     │
│ - User fills in missing fields                                           │
│ - User saves vocabulary                                                  │
└─────────────────────────────────────────────────────────────────────────┘
                            │
                            ▼
               [Normal Create Vocabulary Flow]
```

---

## 4. Navigation Flow

### App Start Flow

```
App.tsx loads
     │
     ▼
AuthProvider initializes
     │
     ▼
Check stored session (SecureStore)
     │
     ├─── Session exists ──→ Validate with Supabase ──→ Valid? ──→ MainTabNavigator
     │                                                      │
     │                                                      └─→ Invalid ──→ AuthNavigator
     │
     └─── No session ──→ AuthNavigator
```

### Screen Navigation Data

When navigating between screens, data is passed via:

```javascript
// Navigate with params
navigation.navigate("VocabularyDetail", {
  vocabularyId: "123",
});

// Receive params in target screen
const { vocabularyId } = route.params;

// Fetch specific vocabulary
const vocabulary = vocabularyItems.find((v) => v.id === vocabularyId);
```

---

## 5. State Management Flow

### Global State (Context)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          AuthProvider                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ State: { user, isAuthenticated, loading, error }                 │   │
│  │ Actions: { signIn, signUp, signOut, resetPassword }              │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                               │                                          │
│                               ▼                                          │
│                    All child components                                  │
│                    can access via useAuth()                              │
└─────────────────────────────────────────────────────────────────────────┘
```

### Local State (Hook)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         useVocabulary Hook                               │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ State: { vocabulary[], loading, error, filters }                 │   │
│  │ Actions: { fetch, create, update, delete, setFilters }           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                               │                                          │
│                               ▼                                          │
│              Only used by screens that call hook                         │
│              (LibraryHomeScreen, DashboardScreen, etc.)                  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Error Handling Flow

```
User action → Screen → Hook → Service → Supabase
                                            │
                                      ERROR OCCURS
                                            │
                                            ▼
                              Service catches error
                              Logs error details
                              Throws formatted error
                                            │
                                            ▼
                              Hook catches error
                              Sets error state
                              Sets loading: false
                                            │
                                            ▼
                              Screen displays error
                              Shows retry option
                              User sees message
```

**Error types:**

| Error Source | Example        | User Sees                                 |
| ------------ | -------------- | ----------------------------------------- |
| Network      | No internet    | "Connection error. Check your internet."  |
| Auth         | Wrong password | "Invalid email or password."              |
| Supabase     | Query failed   | "Something went wrong. Please try again." |
| Validation   | Invalid input  | Specific field error message              |

---

## 7. Data Types Flow

How TypeScript types ensure data consistency:

```
┌─────────────────────────────────────────────────────────────────────────┐
│ types/index.ts defines Vocabulary type                                   │
├─────────────────────────────────────────────────────────────────────────┤
│ interface Vocabulary {                                                   │
│   id: string;                                                           │
│   german_word: string;                                                  │
│   translation: string;                                                  │
│   part_of_speech: PartOfSpeech;                                         │
│   ...                                                                   │
│ }                                                                        │
└─────────────────────────────────────────────────────────────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        ▼                      ▼                      ▼
   Services use           Hooks use             Screens use
   same type              same type             same type
        │                      │                      │
        └──────────────────────┴──────────────────────┘
                               │
                               ▼
                   TypeScript ensures all parts
                   use data consistently
```

---

## 8. Practical Examples

### Example 1: User Adds New Word

1. User opens app, sees Dashboard
2. Taps "+" (navigate to CaptureNavigator)
3. Chooses "Take Photo" (navigate to CameraScreen)
4. Takes photo of German text
5. App processes image (ProcessingScreen)
6. User reviews and edits word (ReviewScreen)
7. User fills: "Haus" = "House", noun, A1
8. Taps "Save"
9. `vocabularyService.create()` sends to Supabase
10. Success! Navigate to LibraryHome
11. User sees "Haus" in their vocabulary list

### Example 2: User Searches Vocabulary

1. User is on LibraryHomeScreen
2. Types "auto" in SearchBar
3. `SearchBar` calls `onSearchChange("auto")`
4. `useVocabulary` updates `filters.search = "auto"`
5. Hook filters vocabulary array
6. Only words containing "auto" are shown
7. User sees filtered results instantly

### Example 3: User Signs Out

1. User taps Profile tab
2. Sees ProfileScreen with account info
3. Taps "Sign Out" button
4. `signOut()` from useAuth is called
5. `authService.signOut()` clears tokens
6. AuthContext sets `user: null`
7. RootNavigator detects change
8. User sees LoginScreen

---

## Summary

| Layer    | Responsibility            | Key Files            |
| -------- | ------------------------- | -------------------- |
| Screens  | UI, user input, display   | screens/\*.tsx       |
| Hooks    | State management, logic   | hooks/\*.ts          |
| Services | API calls, data transform | services/\*.ts       |
| Supabase | Storage, auth, database   | services/supabase.ts |
| Types    | Data shape definitions    | types/index.ts       |

**Data always flows:**

- **Down:** User → Screen → Hook → Service → Database
- **Up:** Database → Service → Hook → Screen → User

This consistent pattern makes the app predictable and easy to debug.
