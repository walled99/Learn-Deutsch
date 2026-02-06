# Theme Folder - Design System

**Location:** `src/theme/`  
**Purpose:** Defines all visual styling (colors, fonts, spacing) for consistent design

---

## Folder Structure

```
theme/
├── colors.ts      # Color palette & helper functions
├── typography.ts  # Font sizes, weights, text styles
├── spacing.ts     # Spacing, radius, shadows
└── index.ts       # Exports everything
```

---

## File: colors.ts

### Purpose

Defines the "Midnight Germany" dark theme color palette.

### Color Categories

#### 1. Background Colors

```typescript
background: {
  primary: "#0F172A",     // Main dark blue
  secondary: "#1E293B",   // Slightly lighter
  gradient: ["#0F172A", "#1E293B"]  // For gradients
}
```

#### 2. Surface Colors (Cards, Panels)

```typescript
surface: {
  primary: "#1E293B",     // Card background
  secondary: "#334155",   // Input background
  tertiary: "#475569",    // Disabled state
  elevated: "#273548"     // Raised cards
}
```

#### 3. Primary Accent (Amber - Actions)

```typescript
primary: {
  default: "#F59E0B",     // Main amber
  light: "#FBBF24",       // Lighter variant
  dark: "#D97706",        // Darker variant
  gradient: ["#F59E0B", "#D97706"]
}
```

Used for: Buttons, active states, primary actions

#### 4. Secondary Accent (Teal - Success)

```typescript
secondary: {
  default: "#14B8A6",
  light: "#2DD4BF",
  dark: "#0D9488",
  gradient: ["#14B8A6", "#0D9488"]
}
```

Used for: Success states, "Mastered" status

#### 5. Status Colors

```typescript
status: {
  success: "#10B981",  // Green - success actions
  warning: "#F59E0B",  // Amber - warnings
  error: "#EF4444",    // Red - errors
  info: "#3B82F6"      // Blue - information
}
```

#### 6. German Grammar Colors (Important!)

```typescript
grammar: {
  masculine: "#3B82F6",  // "der" - Blue
  feminine: "#EC4899",   // "die" - Pink
  neuter: "#10B981",     // "das" - Green
  haben: "#8B5CF6",      // haben verb - Purple
  sein: "#06B6D4"        // sein verb - Cyan
}
```

**Visual representation:**

```
┌─────────────────────────────────────────────────────────────┐
│  German Articles & Helper Verbs - Color Coding              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ●  der (masculine)  - Blue (#3B82F6)                     │
│   ●  die (feminine)   - Pink (#EC4899)                     │
│   ●  das (neuter)     - Green (#10B981)                    │
│                                                             │
│   ●  haben           - Purple (#8B5CF6)                    │
│   ●  sein            - Cyan (#06B6D4)                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 7. Mastery Status Colors

```typescript
mastery: {
  new: "#94A3B8",       // Gray - just added
  learning: "#F59E0B",  // Amber - studying
  reviewing: "#3B82F6", // Blue - reviewing
  mastered: "#10B981"   // Green - learned
}
```

#### 8. Category Colors

```typescript
category: {
  noun: "#3B82F6",      // Blue
  verb: "#8B5CF6",      // Purple
  adjective: "#EC4899", // Pink
  adverb: "#F97316",    // Orange
  phrase: "#06B6D4"     // Cyan
}
```

#### 9. Text Colors

```typescript
text: {
  primary: "#F8FAFC",    // White text
  secondary: "#E2E8F0",  // Slightly dimmed
  muted: "#94A3B8",      // Gray text
  disabled: "#64748B",   // Very dim
  inverse: "#0F172A"     // Dark text on light
}
```

### Helper Functions

```typescript
// Get color for article
getArticleColor("der"); // Returns blue
getArticleColor("die"); // Returns pink
getArticleColor("das"); // Returns green

// Get color for mastery status
getMasteryColor("Mastered"); // Returns green
getMasteryColor("Learning"); // Returns amber

// Get color for category
getCategoryColor("Noun"); // Returns blue
getCategoryColor("Verb"); // Returns purple
```

---

## File: typography.ts

### Purpose

Defines all text-related styling.

### Font Sizes

```typescript
FONT_SIZES = {
  xs: 12, // Very small (captions)
  sm: 14, // Small (labels)
  base: 16, // Default body text
  lg: 18, // Large body
  xl: 20, // Small heading
  "2xl": 24, // Medium heading
  "3xl": 28, // Large heading
  "4xl": 32, // Extra large
  "5xl": 40, // Display text
};
```

### Font Weights

```typescript
FONT_WEIGHTS = {
  regular: "400",
  medium: "500",
  semiBold: "600",
  bold: "700",
};
```

### Typography Presets (Ready-to-Use Styles)

```typescript
TYPOGRAPHY = {
  // Headings
  h1: { fontSize: 28, fontWeight: "bold" },
  h2: { fontSize: 24, fontWeight: "semiBold" },
  h3: { fontSize: 20, fontWeight: "semiBold" },
  h4: { fontSize: 18, fontWeight: "semiBold" },

  // Body text
  body: { fontSize: 16, fontWeight: "regular" },
  bodySmall: { fontSize: 14, fontWeight: "regular" },
  bodyLarge: { fontSize: 18, fontWeight: "regular" },

  // Special
  label: { fontSize: 14, fontWeight: "medium" },
  caption: { fontSize: 12, fontWeight: "regular" },
  button: { fontSize: 16, fontWeight: "semiBold" },
};
```

**Usage:**

```typescript
<Text style={TYPOGRAPHY.h1}>Big Title</Text>
<Text style={TYPOGRAPHY.body}>Regular text</Text>
```

---

## File: spacing.ts

### Purpose

Defines spacing, border radius, shadows, and layout constants.

### Spacing Scale (Based on 4px)

```typescript
SPACING = {
  none: 0,
  xs: 4, // Extra small
  sm: 8, // Small
  md: 12, // Medium
  base: 16, // Default
  lg: 20, // Large
  xl: 24, // Extra large
  "2xl": 32,
  "3xl": 40,
  "4xl": 48,
  "5xl": 64,
};
```

### Border Radius

```typescript
RADIUS = {
  none: 0,
  sm: 4,
  md: 8,
  base: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  full: 9999, // Fully round (circles)
};
```

### Shadow Presets

```typescript
SHADOWS = {
  none: { ... },   // No shadow
  sm: { elevation: 2 },   // Small shadow
  md: { elevation: 4 },   // Medium shadow
  lg: { elevation: 8 },   // Large shadow
  xl: { elevation: 12 }   // Extra large
}
```

### Icon Sizes

```typescript
ICON_SIZES = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 32,
  "2xl": 40,
  "3xl": 48,
};
```

### Layout Constants

```typescript
LAYOUT = {
  screenPadding: 16, // Padding from screen edges
  cardPadding: 16, // Padding inside cards
  headerHeight: 56, // Header bar height
  tabBarHeight: 80, // Bottom tab bar height
  buttonHeight: {
    sm: 36,
    md: 44,
    lg: 52,
  },
  inputHeight: 48, // Text input height
};
```

---

## File: index.ts

### Purpose

Exports everything from the theme folder for easy imports.

```typescript
export * from "./colors";
export * from "./typography";
export * from "./spacing";

// Combined theme object
export const theme = {
  colors: COLORS,
  fonts: FONTS,
  fontSizes: FONT_SIZES,
  // ... everything else
  helpers: {
    getArticleColor,
    getMasteryColor,
    getCategoryColor,
  },
};
```

### How to Import

```typescript
// Import specific items
import { COLORS, TYPOGRAPHY, SPACING } from "@/theme";

// Import helper functions
import { getArticleColor, getMasteryColor } from "@/theme";

// Import combined theme
import { theme } from "@/theme";
```

---

## Visual Design Guide

### Color Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│  BACKGROUND HIERARCHY                                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ████████████████████████████  #0F172A - Deepest (screen)   │
│  ████████████████████████████  #1E293B - Cards/panels       │
│  ████████████████████████████  #334155 - Inputs             │
│  ████████████████████████████  #475569 - Disabled           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Button Colors

```
┌────────────────────┐
│  Primary Button    │  Amber gradient → Main actions
│  ████████████████  │
└────────────────────┘

┌────────────────────┐
│  Secondary Button  │  Teal gradient → Alternative actions
│  ████████████████  │
└────────────────────┘

┌────────────────────┐
│  Outline Button    │  Border only → Subtle actions
│  ────────────────  │
└────────────────────┘
```

---

## Relationship with Components

```
theme/
   │
   ├──▶ components/common/Button.tsx (uses colors, spacing, radius)
   │
   ├──▶ components/common/Input.tsx (uses colors, typography)
   │
   ├──▶ components/common/Card.tsx (uses colors, shadows, radius)
   │
   ├──▶ components/vocabulary/VocabularyCard.tsx (uses grammar colors)
   │
   └──▶ All screens (use typography, spacing, colors)
```

---

## Summary

| File            | What It Defines                     |
| --------------- | ----------------------------------- |
| `colors.ts`     | All colors + helper functions       |
| `typography.ts` | Font sizes, weights, text presets   |
| `spacing.ts`    | Margins, padding, radius, shadows   |
| `index.ts`      | Exports everything for easy imports |

The theme folder ensures:

- Consistent visual design across the app
- Easy to change colors/sizes in one place
- German grammar colors are prominent (der/die/das)
- Dark theme that's easy on the eyes
