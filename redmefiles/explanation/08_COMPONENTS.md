# Components Folder - Reusable UI Elements

**Location:** `src/components/`  
**Purpose:** Contains reusable UI building blocks used across screens

---

## Folder Structure

```
components/
├── common/                  # General-purpose components
│   ├── Button.tsx          # Pressable button with variants
│   ├── Input.tsx           # Text input field
│   ├── Card.tsx            # Container card
│   ├── Chip.tsx            # Small tag/badge
│   ├── Select.tsx          # Dropdown selector
│   ├── Header.tsx          # Screen header with back button
│   ├── ScreenContainer.tsx # Screen wrapper with gradient
│   ├── LoadingSpinner.tsx  # Loading animation
│   ├── EmptyState.tsx      # Empty list placeholder
│   └── index.ts            # Exports all common components
│
├── vocabulary/              # Vocabulary-specific components
│   ├── VocabularyCard.tsx  # Displays a vocabulary word
│   ├── VocabularyForm.tsx  # Form for creating/editing words
│   ├── SearchBar.tsx       # Search input for library
│   ├── FilterBar.tsx       # Category/status filters
│   └── index.ts            # Exports vocabulary components
│
└── index.ts                 # Exports everything
```

---

## Common Components

### 1. Button.tsx

**Purpose:** Clickable button with multiple visual styles.

**Variants:**
| Variant | Appearance | Use Case |
|---------|------------|----------|
| `primary` | Amber gradient | Main actions (Save, Submit) |
| `secondary` | Teal gradient | Alternative actions |
| `outline` | Border only | Subtle actions |
| `ghost` | No background | Text-like buttons |
| `danger` | Red | Delete actions |

**Sizes:** `sm` (36px), `md` (44px), `lg` (52px)

**Props:**

```typescript
interface ButtonProps {
  title: string; // Button text
  onPress: () => void; // Click handler
  variant?: ButtonVariant; // Visual style
  size?: ButtonSize; // Button height
  disabled?: boolean; // Disable interaction
  loading?: boolean; // Show spinner
  fullWidth?: boolean; // Fill container width
  leftIcon?: ReactNode; // Icon before text
  rightIcon?: ReactNode; // Icon after text
}
```

**Usage:**

```tsx
<Button title="Save" onPress={handleSave} variant="primary" />
<Button title="Delete" onPress={handleDelete} variant="danger" />
```

---

### 2. Input.tsx

**Purpose:** Text input field with label, icons, and validation.

**Features:**

- Optional label above input
- Left/right icons
- Password visibility toggle
- Error message display
- Focus highlighting

**Props:**

```typescript
interface InputProps extends TextInputProps {
  label?: string; // Label text
  error?: string; // Error message
  hint?: string; // Help text
  leftIcon?: string; // Icon name (Ionicons)
  rightIcon?: string; // Right icon name
  showPasswordToggle?: boolean; // Toggle password visibility
}
```

**Usage:**

```tsx
<Input
  label="Email"
  placeholder="Enter your email"
  leftIcon="mail-outline"
  error={errors.email}
  keyboardType="email-address"
/>

<Input
  label="Password"
  secureTextEntry
  showPasswordToggle
  leftIcon="lock-closed-outline"
/>
```

---

### 3. Card.tsx

**Purpose:** Container with background, border radius, and optional shadow.

**Variants:**

- `default` - Standard card
- `elevated` - With shadow
- `outline` - Border only

**Padding options:** `none`, `sm`, `md`, `lg`

**Props:**

```typescript
interface CardProps {
  children: ReactNode; // Card content
  onPress?: () => void; // Makes card clickable
  variant?: "default" | "elevated" | "outline";
  padding?: "none" | "sm" | "md" | "lg";
}
```

**Usage:**

```tsx
<Card variant="elevated" padding="lg">
  <Text>Card content here</Text>
</Card>

<Card onPress={() => navigate("Details")}>
  <Text>Tap me!</Text>
</Card>
```

---

### 4. Chip.tsx

**Purpose:** Small badge/tag for displaying categories or status.

**Variants:** `default`, `primary`, `success`, `warning`, `error`, `info`

**States:** Normal or `selected` (filled background)

**Props:**

```typescript
interface ChipProps {
  label: string; // Chip text
  onPress?: () => void; // Optional click handler
  variant?: ChipVariant; // Color variant
  selected?: boolean; // Filled vs outlined
  icon?: string; // Optional icon
  size?: "sm" | "md"; // Size variant
}
```

**Usage:**

```tsx
<Chip label="Noun" variant="primary" selected />
<Chip label="Learning" variant="warning" />
```

---

### 5. Select.tsx

**Purpose:** Dropdown picker with modal on mobile.

**Props:**

```typescript
interface SelectProps {
  label?: string;
  placeholder?: string;
  options: { label: string; value: string; color?: string }[];
  value: string | null;
  onChange: (value: string) => void;
  error?: string;
}
```

**Usage:**

```tsx
<Select
  label="Article"
  placeholder="Select article"
  options={[
    { label: "der", value: "der", color: COLORS.grammar.masculine },
    { label: "die", value: "die", color: COLORS.grammar.feminine },
    { label: "das", value: "das", color: COLORS.grammar.neuter },
  ]}
  value={article}
  onChange={setArticle}
/>
```

---

### 6. Header.tsx

**Purpose:** Screen header with optional back button and action.

**Props:**

```typescript
interface HeaderProps {
  title?: string; // Header title
  subtitle?: string; // Secondary text
  showBack?: boolean; // Show back arrow
  onBackPress?: () => void; // Custom back action
  rightAction?: {
    // Right side icon button
    icon: string;
    onPress: () => void;
  };
  transparent?: boolean; // No background
}
```

**Usage:**

```tsx
<Header
  title="Vocabulary Library"
  showBack
  rightAction={{ icon: "add", onPress: handleAdd }}
/>
```

---

### 7. ScreenContainer.tsx

**Purpose:** Wrapper for screens with gradient background and safe area.

**Features:**

- Gradient background (Midnight Germany theme)
- SafeAreaView support
- Optional scroll behavior
- Keyboard avoiding behavior

**Props:**

```typescript
interface ScreenContainerProps {
  children: ReactNode;
  scrollable?: boolean; // Wrap in ScrollView
  safeArea?: boolean; // Use SafeAreaView
  padding?: boolean; // Add horizontal padding
  gradient?: boolean; // Use gradient background
  keyboardAvoiding?: boolean; // Move content when keyboard opens
}
```

**Usage:**

```tsx
<ScreenContainer scrollable keyboardAvoiding>
  <Header title="Settings" />
  <Input label="Name" />
  <Button title="Save" />
</ScreenContainer>
```

---

### 8. LoadingSpinner.tsx

**Purpose:** Animated loading indicator.

**Props:**

```typescript
interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"; // Spinner size
  color?: string; // Spinner color
  message?: string; // Text below spinner
}
```

---

### 9. EmptyState.tsx

**Purpose:** Placeholder when a list is empty.

**Props:**

```typescript
interface EmptyStateProps {
  icon?: string; // Large icon
  title: string; // Main message
  message?: string; // Secondary text
  actionLabel?: string; // Button text
  onAction?: () => void; // Button handler
}
```

**Usage:**

```tsx
<EmptyState
  icon="book-outline"
  title="No Vocabulary Yet"
  message="Start by capturing an image"
  actionLabel="Capture Now"
  onAction={() => navigate("Capture")}
/>
```

---

## Vocabulary Components

### 1. VocabularyCard.tsx

**Purpose:** Displays a vocabulary word with all its details.

**Features:**

- Shows word, article (colored), translation
- Category badge
- Mastery status indicator
- Example sentence preview
- Compact mode for lists

**Props:**

```typescript
interface VocabularyCardProps {
  vocabulary: Vocabulary; // Word data
  onPress: () => void; // Tap handler
  onLongPress?: () => void; // Long press handler
  compact?: boolean; // Compact display mode
}
```

**Visual:**

```
┌───────────────────────────────────────────────┐
│  🔵 Noun                           ● Learning │ ← Category & Status
│                                               │
│  der Tisch                                    │ ← Article (blue) + Word
│  table                                        │ ← Translation
│                                               │
│  💬 "Der Tisch ist aus Holz."                │ ← Example
│                                            ▶ │
└───────────────────────────────────────────────┘
```

---

### 2. VocabularyForm.tsx

**Purpose:** Dynamic form for creating/editing vocabulary.

**Features:**

- Word category selection (Noun, Verb, etc.)
- Dynamic fields based on category:
  - Nouns: Article (der/die/das), Plural
  - Verbs: Helper verb (haben/sein), Past participle
- Translation input (required)
- Example sentence (optional)
- Mastery status (in edit mode)

**Props:**

```typescript
interface VocabularyFormProps {
  formData: VocabularyFormData; // Current form values
  onChange: (field, value) => void; // Update handler
  errors?: Record<string, string>; // Validation errors
  mode?: "create" | "edit"; // Form mode
}
```

---

### 3. SearchBar.tsx

**Purpose:** Search input for finding vocabulary.

**Features:**

- Search icon
- Clear button
- Focus highlighting
- Submit on return key

**Props:**

```typescript
interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  autoFocus?: boolean;
}
```

---

### 4. FilterBar.tsx

**Purpose:** Filter vocabulary by category and status.

**Features:**

- Horizontal scrollable chip list
- Category filters (All, Noun, Verb, etc.)
- Status filters (All, New, Learning, etc.)
- Selected state highlighting

**Props:**

```typescript
interface FilterBarProps {
  filters: Partial<FilterState>;
  onFilterChange: (filters) => void;
  showCategoryFilter?: boolean;
  showStatusFilter?: boolean;
}
```

---

## Component Hierarchy

```
ScreenContainer (wrapper)
    │
    ├── Header (top bar)
    │
    ├── Content Area
    │       │
    │       ├── Input / Select (forms)
    │       │
    │       ├── SearchBar / FilterBar (lists)
    │       │
    │       ├── Card (containers)
    │       │       │
    │       │       └── VocabularyCard (specialized)
    │       │
    │       ├── Chip (tags/badges)
    │       │
    │       ├── VocabularyForm (complex form)
    │       │
    │       ├── LoadingSpinner (loading state)
    │       │
    │       └── EmptyState (empty lists)
    │
    └── Button (actions)
```

---

## Component Relationships

```
VocabularyCard
    └── uses → Chip (category badge)
    └── uses → getArticleColor, getMasteryColor (from theme)

VocabularyForm
    └── uses → Input, Select, Chip
    └── uses → COLORS (grammar colors)

FilterBar
    └── uses → Chip (selectable filters)

ScreenContainer
    └── uses → SafeAreaView, LinearGradient, KeyboardAvoidingView

All components
    └── use → theme/ (COLORS, TYPOGRAPHY, SPACING, RADIUS)
```

---

## Importing Components

```typescript
// Import common components
import { Button, Input, Card, Header, ScreenContainer } from "@/components";

// Import vocabulary components
import {
  VocabularyCard,
  VocabularyForm,
  SearchBar,
  FilterBar,
} from "@/components";

// Or specific imports
import { Button } from "@/components/common/Button";
import { VocabularyCard } from "@/components/vocabulary/VocabularyCard";
```

---

## Summary

| Component         | Category   | Purpose                         |
| ----------------- | ---------- | ------------------------------- |
| `Button`          | Common     | Clickable buttons with variants |
| `Input`           | Common     | Text input with validation      |
| `Card`            | Common     | Container with styling          |
| `Chip`            | Common     | Small tags/badges               |
| `Select`          | Common     | Dropdown picker                 |
| `Header`          | Common     | Screen headers                  |
| `ScreenContainer` | Common     | Screen wrapper                  |
| `LoadingSpinner`  | Common     | Loading indicator               |
| `EmptyState`      | Common     | Empty list placeholder          |
| `VocabularyCard`  | Vocabulary | Word display card               |
| `VocabularyForm`  | Vocabulary | Word create/edit form           |
| `SearchBar`       | Vocabulary | Search input                    |
| `FilterBar`       | Vocabulary | Category/status filters         |

Components are the **building blocks** - small, reusable pieces that combine to create screens.
