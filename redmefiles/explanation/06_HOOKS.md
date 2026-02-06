# Hooks Folder - Custom React Hooks

**Location:** `src/hooks/`  
**Purpose:** Provides reusable state management and logic for screens

---

## What Are Hooks?

Hooks are special React functions that:

- Manage state (data that changes)
- Handle side effects (API calls, subscriptions)
- Share logic between components
- Start with "use" prefix (useAuth, useVocabulary)

---

## Folder Structure

```
hooks/
├── useAuth.tsx      # Authentication state & functions
├── useVocabulary.ts # Vocabulary state & CRUD operations
└── index.ts         # Exports all hooks
```

---

## File: useAuth.tsx

### Purpose

Manages user authentication state and provides login/logout functions.

### What It Provides

```typescript
interface AuthContextType {
  // State
  user: User | null; // Current user (null if logged out)
  isLoading: boolean; // Checking auth status?
  isAuthenticated: boolean; // Is user logged in?

  // Actions
  signIn: (email, password) => Promise<{ success; error? }>;
  signUp: (email, password, name?) => Promise<{ success; error? }>;
  signOut: () => Promise<void>;
  resetPassword: (email) => Promise<{ success; error? }>;
}
```

### How It Works

#### 1. Auth Provider Component

```typescript
export const AuthProvider = ({ children }) => {
  const auth = useAuthProvider();  // Get auth state & functions

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};
```

The AuthProvider wraps the entire app in `App.tsx`, making auth available everywhere.

#### 2. Initial Auth Check

```typescript
useEffect(() => {
  // On app start, check if user is already logged in
  const initAuth = async () => {
    const user = await getCurrentUser(); // From services
    setState({
      user,
      isLoading: false,
      isAuthenticated: !!user,
    });
  };

  initAuth();

  // Listen for auth changes (login/logout from other sources)
  const {
    data: { subscription },
  } = onAuthStateChange((user) => {
    setState({ user, isLoading: false, isAuthenticated: !!user });
  });

  return () => subscription.unsubscribe();
}, []);
```

#### 3. Sign In Function

```typescript
const signIn = useCallback(async (email, password) => {
  setState((prev) => ({ ...prev, isLoading: true }));

  const result = await authSignIn(email, password); // Call service

  if (result.success && result.user) {
    setState({
      user: result.user,
      isLoading: false,
      isAuthenticated: true,
    });
  } else {
    setState((prev) => ({ ...prev, isLoading: false }));
  }

  return { success: result.success, error: result.error };
}, []);
```

### Using the Hook

```typescript
// In any screen or component
const { user, isAuthenticated, signIn, signOut } = useAuth();

// Check if logged in
if (!isAuthenticated) {
  return <LoginScreen />;
}

// Use user data
<Text>Hello, {user.email}</Text>

// Sign out
<Button onPress={signOut} title="Logout" />
```

### Auth Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      APP STARTS                              │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  AuthProvider initializes                                    │
│    → isLoading: true                                        │
│    → Checks stored session                                  │
└─────────────────────────────────────────────────────────────┘
                          │
           ┌──────────────┴──────────────┐
           │                              │
           ▼                              ▼
   ┌───────────────┐            ┌───────────────┐
   │ Session Found │            │ No Session    │
   └───────────────┘            └───────────────┘
           │                              │
           ▼                              ▼
   isAuthenticated: true        isAuthenticated: false
   user: { id, email }          user: null
           │                              │
           ▼                              ▼
   RootNavigator shows          RootNavigator shows
   MainTabNavigator             AuthNavigator
```

---

## File: useVocabulary.ts

### Purpose

Manages vocabulary data, filtering, and CRUD operations.

### What It Provides

```typescript
interface VocabularyHook {
  // State
  vocabulary: Vocabulary[]; // List of vocabulary
  isLoading: boolean; // Fetching data?
  error: string | null; // Error message
  filters: Partial<FilterState>; // Current filters
  stats: VocabularyStats | null; // Statistics

  // Actions
  setFilters: (newFilters) => void;
  addVocabulary: (formData, imageUrl?) => Promise<result>;
  editVocabulary: (id, formData) => Promise<result>;
  removeVocabulary: (id) => Promise<result>;
  refresh: () => Promise<void>;
}
```

### How It Works

#### 1. State Setup

```typescript
const [state, setState] = useState({
  vocabulary: [], // Empty array initially
  isLoading: true, // Loading initially
  error: null,
  stats: null,
});

const [filters, setFilters] = useState({
  category: "All",
  status: "All",
  searchQuery: "",
});
```

#### 2. Load Vocabulary

```typescript
const loadVocabulary = useCallback(async () => {
  setState((prev) => ({ ...prev, isLoading: true, error: null }));

  const result = await fetchVocabulary(filters); // Call service

  if (result.success) {
    setState((prev) => ({
      ...prev,
      vocabulary: result.data,
      isLoading: false,
    }));
  } else {
    setState((prev) => ({
      ...prev,
      error: result.error,
      isLoading: false,
    }));
  }
}, [filters]);

// Auto-load when filters change
useEffect(() => {
  loadVocabulary();
}, [loadVocabulary]);
```

#### 3. CRUD Operations

```typescript
// Add new vocabulary
const addVocabulary = useCallback(
  async (formData, imageUrl?) => {
    const result = await createVocabulary(formData, imageUrl);

    if (result.success) {
      await loadVocabulary(); // Refresh list
      await loadStats(); // Update stats
    }

    return result;
  },
  [loadVocabulary, loadStats],
);

// Edit vocabulary
const editVocabulary = useCallback(
  async (id, formData) => {
    const result = await updateVocabulary(id, formData);

    if (result.success) {
      await loadVocabulary();
      await loadStats();
    }

    return result;
  },
  [loadVocabulary, loadStats],
);

// Delete vocabulary
const removeVocabulary = useCallback(
  async (id) => {
    const result = await deleteVocabulary(id);

    if (result.success) {
      await loadVocabulary();
      await loadStats();
    }

    return result;
  },
  [loadVocabulary, loadStats],
);
```

### Using the Hook

```typescript
// In LibraryHomeScreen
const {
  vocabulary,
  isLoading,
  filters,
  setFilters,
  refresh
} = useVocabulary();

// Apply filters
setFilters({ category: "Noun", status: "Learning" });

// Display vocabulary
<FlatList
  data={vocabulary}
  renderItem={({ item }) => <VocabularyCard vocabulary={item} />}
  refreshing={isLoading}
  onRefresh={refresh}
/>
```

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      SCREEN                                  │
│   LibraryHomeScreen uses useVocabulary()                    │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   useVocabulary                              │
│                                                              │
│   State: { vocabulary, isLoading, error, stats, filters }   │
│                                                              │
│   Actions: setFilters, addVocabulary, editVocabulary,       │
│            removeVocabulary, refresh                         │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                      SERVICES                                │
│   fetchVocabulary(), createVocabulary(), etc.               │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   SUPABASE DATABASE                          │
│               vocabulary table                               │
└─────────────────────────────────────────────────────────────┘
```

---

## File: index.ts

### Purpose

Re-exports all hooks.

```typescript
export * from "./useAuth";
export * from "./useVocabulary";
```

### Importing Hooks

```typescript
import { useAuth, useVocabulary } from "@/hooks";

// Or individual import
import { useAuth } from "@hooks/useAuth";
```

---

## Hook Patterns Used

### 1. Context Pattern (useAuth)

For data that needs to be accessed anywhere:

```
AuthProvider (in App.tsx)
    │
    ├── AuthContext provides { user, signIn, signOut }
    │
    ├── Screen A uses useAuth() → gets same data
    ├── Screen B uses useAuth() → gets same data
    └── Component X uses useAuth() → gets same data
```

### 2. State + Callback Pattern (useVocabulary)

For data specific to a feature:

```
useVocabulary()
    │
    ├── Internal state (vocabulary, filters, loading)
    │
    ├── useCallback for actions (memoized - prevents re-renders)
    │
    ├── useEffect to auto-fetch when filters change
    │
    └── Returns { state, actions } to the screen
```

---

## Relationship with Other Parts

```
┌──────────────┐     uses      ┌──────────────┐
│   SCREENS    │ ─────────────▶│    HOOKS     │
└──────────────┘               └──────────────┘
                                      │
                                      │ call
                                      ▼
                               ┌──────────────┐
                               │   SERVICES   │
                               └──────────────┘
                                      │
                                      │ query
                                      ▼
                               ┌──────────────┐
                               │   DATABASE   │
                               └──────────────┘
```

---

## Summary

| Hook            | Purpose         | Key Features                            |
| --------------- | --------------- | --------------------------------------- |
| `useAuth`       | Authentication  | User state, login/logout, context-based |
| `useVocabulary` | Vocabulary data | CRUD, filtering, statistics             |

Hooks are the **brain** of the app - they manage state, handle logic, and connect screens to services. They keep screen components clean and focused on UI.
