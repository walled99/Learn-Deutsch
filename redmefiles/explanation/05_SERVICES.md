# Services Folder - API & Database Operations

**Location:** `src/services/`  
**Purpose:** Contains all code that talks to external services (Supabase backend)

---

## Folder Structure

```
services/
├── supabase.ts    # Supabase client setup & storage helpers
├── auth.ts        # Authentication operations
├── vocabulary.ts  # Vocabulary CRUD operations
└── index.ts       # Exports all services
```

---

## File: supabase.ts

### Purpose

Sets up the Supabase client connection and provides storage helpers.

### 1. Secure Storage Adapter

The app stores auth tokens securely using Expo SecureStore:

```typescript
const ExpoSecureStoreAdapter = {
  getItem: async (key) => SecureStore.getItemAsync(key),
  setItem: async (key, value) => SecureStore.setItemAsync(key, value),
  removeItem: async (key) => SecureStore.deleteItemAsync(key),
};
```

**Why secure storage?**

- Auth tokens contain sensitive info
- SecureStore uses device encryption
- Tokens survive app restart

### 2. Supabase Client

```typescript
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: ExpoSecureStoreAdapter, // Use secure storage
    autoRefreshToken: true, // Auto-refresh expired tokens
    persistSession: true, // Remember login
    detectSessionInUrl: false, // Not needed for mobile
  },
});
```

### 3. Storage Bucket Names

```typescript
export const STORAGE_BUCKETS = {
  avatars: "avatars", // For profile pictures
};
```

---

## File: auth.ts

### Purpose

Handles all authentication operations (sign up, sign in, sign out, etc.)

### 1. Sign Up

```typescript
export const signUp = async (email, password, displayName?) => {
  // Create user in Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName }
    }
  });

  // Create profile entry in database
  await supabase.from("profiles").insert({
    id: data.user.id,
    display_name: displayName
  });

  return { success: true, user: {...} };
};
```

### 2. Sign In

```typescript
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  return { success: true, user: {...} };
};
```

### 3. Sign Out

```typescript
export const signOut = async () => {
  await supabase.auth.signOut();
  return { success: true };
};
```

### 4. Get Current Session

```typescript
export const getCurrentSession = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session;
};
```

### 5. Get Current User (with Profile)

```typescript
export const getCurrentUser = async () => {
  // Get auth user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get profile from database
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return { id: user.id, email: user.email, profile };
};
```

### 6. Reset Password

```typescript
export const resetPassword = async (email) => {
  await supabase.auth.resetPasswordForEmail(email);
  return { success: true };
};
```

### 7. Listen for Auth Changes

```typescript
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    // Call callback when user logs in/out
    callback(session?.user || null);
  });
};
```

---

## File: vocabulary.ts

### Purpose

CRUD operations for vocabulary (Create, Read, Update, Delete)

### 1. Fetch All Vocabulary (with Filters)

```typescript
export const fetchVocabulary = async (filters?) => {
  let query = supabase
    .from("vocabulary")
    .select("*")
    .order("created_at", { ascending: false });

  // Apply category filter
  if (filters?.category && filters.category !== "All") {
    query = query.eq("category", filters.category);
  }

  // Apply status filter
  if (filters?.status && filters.status !== "All") {
    query = query.eq("status", filters.status);
  }

  // Apply search query
  if (filters?.searchQuery) {
    query = query.or(
      `word.ilike.%${filters.searchQuery}%,translation.ilike.%${filters.searchQuery}%`,
    );
  }

  const { data, error } = await query;
  return { success: true, data };
};
```

### 2. Fetch Single Vocabulary

```typescript
export const fetchVocabularyById = async (id) => {
  const { data } = await supabase
    .from("vocabulary")
    .select("*")
    .eq("id", id)
    .single();

  return { success: true, data };
};
```

### 3. Create Vocabulary

```typescript
export const createVocabulary = async (formData, imageUrl?) => {
  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Insert new vocabulary
  const { data } = await supabase
    .from("vocabulary")
    .insert({
      user_id: user.id,
      word: formData.word,
      article: formData.article,
      plural: formData.plural,
      helper_verb: formData.helper_verb,
      past_participle: formData.past_participle,
      translation: formData.translation,
      example: formData.example,
      category: formData.category,
      status: formData.status || "New",
    })
    .select()
    .single();

  return { success: true, data };
};
```

### 4. Update Vocabulary

```typescript
export const updateVocabulary = async (id, formData) => {
  const { data } = await supabase
    .from("vocabulary")
    .update(formData)
    .eq("id", id)
    .select()
    .single();

  return { success: true, data };
};
```

### 5. Delete Vocabulary

```typescript
export const deleteVocabulary = async (id) => {
  await supabase.from("vocabulary").delete().eq("id", id);

  return { success: true };
};
```

### 6. Bulk Create (AI Extraction)

```typescript
export const bulkCreateVocabulary = async (items) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const insertData = items.map((item) => ({
    user_id: user.id,
    ...item,
  }));

  const { data } = await supabase
    .from("vocabulary")
    .insert(insertData)
    .select();

  return { success: true, data };
};
```

### 7. Check for Duplicates

```typescript
export const checkDuplicate = async (word, category) => {
  const { data } = await supabase
    .from("vocabulary")
    .select("*")
    .ilike("word", word)
    .eq("category", category)
    .maybeSingle();

  return { exists: !!data, existing: data };
};
```

### 8. Update Mastery Status

```typescript
export const updateMasteryStatus = async (id, status) => {
  await supabase.from("vocabulary").update({ status }).eq("id", id);

  return { success: true };
};
```

### 9. Get Statistics

```typescript
export const getVocabularyStats = async () => {
  const { data } = await supabase
    .from("vocabulary")
    .select("status, category, created_at");

  // Calculate stats
  return {
    total: data.length,
    byStatus: { New: X, Learning: Y, ... },
    byCategory: { Noun: X, Verb: Y, ... },
    recentCount: wordsAddedThisWeek
  };
};
```

---

## File: index.ts

### Purpose

Re-exports everything for clean imports.

```typescript
export * from "./supabase";
export * from "./auth";
export * from "./vocabulary";
```

---

## Service Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       SCREENS                                │
│   (UI Components that users see and interact with)          │
└─────────────────────────────────────────────────────────────┘
                         │ use
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                        HOOKS                                 │
│       (useAuth, useVocabulary - manage state)               │
└─────────────────────────────────────────────────────────────┘
                         │ call
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      SERVICES                                │
│  (auth.ts, vocabulary.ts - talk to backend)                 │
└─────────────────────────────────────────────────────────────┘
                         │ use
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   SUPABASE CLIENT                            │
│            (supabase.ts - connection setup)                 │
└─────────────────────────────────────────────────────────────┘
                         │ connects to
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   SUPABASE BACKEND                           │
│         (PostgreSQL, Auth, Storage - cloud)                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Row Level Security (RLS)

Services automatically respect RLS policies:

```
User A queries vocabulary
        │
        ▼
┌─────────────────────────────────────────┐
│  SELECT * FROM vocabulary               │
│  WHERE user_id = auth.uid()  ◀── auto   │
│                                         │
│  Result: Only User A's words            │
└─────────────────────────────────────────┘
```

Users can ONLY see their own data - enforced at database level.

---

## Error Handling Pattern

All service functions follow this pattern:

```typescript
export const someOperation = async () => {
  try {
    const { data, error } = await supabase...

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Operation error:", error);
    return { success: false, error: error.message };
  }
};
```

---

## Summary

| File            | Purpose               | Key Functions                               |
| --------------- | --------------------- | ------------------------------------------- |
| `supabase.ts`   | Client setup, storage | `supabase` client, `STORAGE_BUCKETS`        |
| `auth.ts`       | Authentication        | `signIn`, `signUp`, `signOut`               |
| `vocabulary.ts` | CRUD operations       | `fetchVocabulary`, `createVocabulary`, etc. |
| `index.ts`      | Export all            | Re-exports everything                       |

The services folder is the **data layer** - it handles all communication with the backend, keeping UI code clean and simple.
