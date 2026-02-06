# 11. Complete Folder Index

A master index of every file and folder in the LernDeutschAI project with one-line descriptions.

---

## Root Level

| File/Folder       | Type   | Description                                                |
| ----------------- | ------ | ---------------------------------------------------------- |
| `App.tsx`         | File   | Main entry point - wraps app with providers and navigation |
| `app.json`        | File   | Expo configuration - app name, version, permissions        |
| `package.json`    | File   | Dependencies and scripts - npm packages used               |
| `tsconfig.json`   | File   | TypeScript settings - strict mode, path aliases            |
| `babel.config.js` | File   | Babel configuration - enables Expo presets                 |
| `assets/`         | Folder | Images, icons, fonts (splash, icon, etc.)                  |
| `redmefiles/`     | Folder | Documentation and project planning files                   |
| `src/`            | Folder | All application source code                                |

---

## assets/

Contains static assets like images and icons.

| File                | Description                             |
| ------------------- | --------------------------------------- |
| `icon.png`          | App icon displayed on home screen       |
| `splash.png`        | Loading screen image shown on app start |
| `favicon.png`       | Web favicon for browser tab             |
| `adaptive-icon.png` | Android adaptive icon background        |

---

## redmefiles/

Documentation and planning files.

| File                         | Description                               |
| ---------------------------- | ----------------------------------------- |
| `README.md`                  | Main project readme with overview         |
| `README1.md`                 | Additional readme information             |
| `FunctionalRequiremnts.md`   | List of app features and requirements     |
| `models.md`                  | Database models and schema design         |
| `phase1_supabase.md`         | Phase 1: Supabase setup instructions      |
| `phase2_mobile_ui.md`        | Phase 2: Mobile UI implementation plan    |
| `phase3_logic_data.md`       | Phase 3: Business logic and data handling |
| `phase4_reliability_sync.md` | Phase 4: Reliability and sync features    |
| `Prompts_For_AI.md`          | AI prompts for development assistance     |
| `explanation/`               | This folder - detailed code documentation |

---

## src/

Main source code folder structure.

| Folder        | Description                          |
| ------------- | ------------------------------------ |
| `components/` | Reusable UI components               |
| `config/`     | App configuration and environment    |
| `hooks/`      | Custom React hooks                   |
| `navigation/` | Screen navigation setup              |
| `screens/`    | App screens/pages                    |
| `services/`   | API and backend services             |
| `theme/`      | Styling: colors, typography, spacing |
| `types/`      | TypeScript type definitions          |

---

## src/components/

### src/components/common/

Reusable UI components used across the app.

| File                  | Description                                                      |
| --------------------- | ---------------------------------------------------------------- |
| `index.ts`            | Exports all common components                                    |
| `Button.tsx`          | Styled button with variants (primary, secondary, outline, ghost) |
| `Card.tsx`            | Container with shadow and rounded corners                        |
| `Chip.tsx`            | Small tag/badge for categories (noun, verb, etc.)                |
| `EmptyState.tsx`      | Placeholder when lists are empty                                 |
| `Header.tsx`          | Screen header with title and optional back button                |
| `Input.tsx`           | Text input field with label and error state                      |
| `LoadingSpinner.tsx`  | Animated loading indicator                                       |
| `ScreenContainer.tsx` | Safe area wrapper with gradient background                       |
| `Select.tsx`          | Dropdown picker for selecting options                            |

### src/components/vocabulary/

Components specific to vocabulary features.

| File                 | Description                                      |
| -------------------- | ------------------------------------------------ |
| `index.ts`           | Exports all vocabulary components                |
| `FilterBar.tsx`      | Filter buttons for part of speech and difficulty |
| `SearchBar.tsx`      | Search input for finding vocabulary words        |
| `VocabularyCard.tsx` | Card displaying single vocabulary item in list   |
| `VocabularyForm.tsx` | Form for creating/editing vocabulary entries     |

---

## src/config/

Application configuration.

| File       | Description                                                  |
| ---------- | ------------------------------------------------------------ |
| `index.ts` | Re-exports all config (env)                                  |
| `env.ts`   | Environment variables - Supabase URL, API key, feature flags |

---

## src/hooks/

Custom React hooks for state and logic.

| File               | Description                                     |
| ------------------ | ----------------------------------------------- |
| `index.ts`         | Exports all hooks                               |
| `useAuth.tsx`      | Authentication context provider and hook        |
| `useVocabulary.ts` | Vocabulary CRUD operations and state management |

---

## src/navigation/

Screen navigation configuration.

| File                   | Description                                                |
| ---------------------- | ---------------------------------------------------------- |
| `index.ts`             | Exports all navigators                                     |
| `RootNavigator.tsx`    | Main navigator - decides Auth vs Main based on login state |
| `AuthNavigator.tsx`    | Login, SignUp, ForgotPassword screens (stack)              |
| `MainTabNavigator.tsx` | Bottom tabs: Dashboard, Capture, Library, Profile          |
| `CaptureNavigator.tsx` | Capture flow: Home → Camera → Processing → Review (stack)  |
| `LibraryNavigator.tsx` | Library flow: List → Detail → Edit (stack)                 |

---

## src/screens/

All app screens organized by feature.

### src/screens/ (root)

| File                | Description                                     |
| ------------------- | ----------------------------------------------- |
| `index.ts`          | Exports all screens from subfolders             |
| `LoadingScreen.tsx` | Loading screen shown while checking auth status |

### src/screens/auth/

Authentication screens.

| File                       | Description                   |
| -------------------------- | ----------------------------- |
| `index.ts`                 | Exports auth screens          |
| `LoginScreen.tsx`          | Email/password login form     |
| `SignUpScreen.tsx`         | New account registration form |
| `ForgotPasswordScreen.tsx` | Password reset request form   |

### src/screens/main/

Main app screens (tabs).

| File                  | Description                                  |
| --------------------- | -------------------------------------------- |
| `index.ts`            | Exports main screens                         |
| `DashboardScreen.tsx` | Home screen with stats and recent vocabulary |
| `ProfileScreen.tsx`   | User profile and settings, logout            |

### src/screens/capture/

Vocabulary capture screens.

| File                    | Description                             |
| ----------------------- | --------------------------------------- |
| `index.ts`              | Exports capture screens                 |
| `CaptureHomeScreen.tsx` | Choose camera or gallery for capture    |
| `CameraScreen.tsx`      | Live camera view for taking photos      |
| `ProcessingScreen.tsx`  | Image processing and text extraction    |
| `ReviewScreen.tsx`      | Review and confirm extracted vocabulary |

### src/screens/library/

Vocabulary library screens.

| File                         | Description                                 |
| ---------------------------- | ------------------------------------------- |
| `index.ts`                   | Exports library screens                     |
| `LibraryHomeScreen.tsx`      | List all vocabulary with search and filters |
| `VocabularyDetailScreen.tsx` | View single vocabulary word details         |
| `EditVocabularyScreen.tsx`   | Edit existing vocabulary entry              |

---

## src/services/

Backend API services.

| File            | Description                                                      |
| --------------- | ---------------------------------------------------------------- |
| `index.ts`      | Exports all services                                             |
| `supabase.ts`   | Supabase client initialization                                   |
| `auth.ts`       | Authentication functions: signIn, signUp, signOut, resetPassword |
| `vocabulary.ts` | Vocabulary CRUD: fetch, create, update, delete                   |

---

## src/theme/

Design system and styling.

| File            | Description                                    |
| --------------- | ---------------------------------------------- |
| `index.ts`      | Exports all theme modules                      |
| `colors.ts`     | Color palette - "Midnight Germany" dark theme  |
| `typography.ts` | Font sizes, weights, and text styles           |
| `spacing.ts`    | Consistent spacing values (4, 8, 12, 16, etc.) |

---

## src/types/

TypeScript type definitions.

| File       | Description                                          |
| ---------- | ---------------------------------------------------- |
| `index.ts` | All types: Vocabulary, User, Navigation, FilterState |

---

## Visual Folder Tree

```
LernDeutschAI/
│
├── App.tsx                    # Entry point
├── app.json                   # Expo config
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── babel.config.js            # Babel config
│
├── assets/                    # Static assets
│   ├── icon.png
│   ├── splash.png
│   ├── favicon.png
│   └── adaptive-icon.png
│
├── redmefiles/                # Documentation
│   ├── README.md
│   ├── FunctionalRequiremnts.md
│   ├── models.md
│   ├── phase1_supabase.md
│   ├── phase2_mobile_ui.md
│   ├── phase3_logic_data.md
│   ├── phase4_reliability_sync.md
│   ├── Prompts_For_AI.md
│   └── explanation/           # This documentation
│       ├── 00_PROJECT_OVERVIEW.md
│       ├── 01_ROOT_FILES.md
│       ├── 02_TYPES.md
│       ├── 03_CONFIG.md
│       ├── 04_THEME.md
│       ├── 05_SERVICES.md
│       ├── 06_HOOKS.md
│       ├── 07_NAVIGATION.md
│       ├── 08_COMPONENTS.md
│       ├── 09_SCREENS.md
│       ├── 10_DATA_FLOW.md
│       ├── 11_FOLDER_INDEX.md
│       └── 12_GLOSSARY.md
│
└── src/                       # Source code
    │
    ├── components/
    │   ├── index.ts
    │   ├── common/
    │   │   ├── index.ts
    │   │   ├── Button.tsx
    │   │   ├── Card.tsx
    │   │   ├── Chip.tsx
    │   │   ├── EmptyState.tsx
    │   │   ├── Header.tsx
    │   │   ├── Input.tsx
    │   │   ├── LoadingSpinner.tsx
    │   │   ├── ScreenContainer.tsx
    │   │   └── Select.tsx
    │   └── vocabulary/
    │       ├── index.ts
    │       ├── FilterBar.tsx
    │       ├── SearchBar.tsx
    │       ├── VocabularyCard.tsx
    │       └── VocabularyForm.tsx
    │
    ├── config/
    │   ├── index.ts
    │   └── env.ts
    │
    ├── hooks/
    │   ├── index.ts
    │   ├── useAuth.tsx
    │   └── useVocabulary.ts
    │
    ├── navigation/
    │   ├── index.ts
    │   ├── RootNavigator.tsx
    │   ├── AuthNavigator.tsx
    │   ├── MainTabNavigator.tsx
    │   ├── CaptureNavigator.tsx
    │   └── LibraryNavigator.tsx
    │
    ├── screens/
    │   ├── index.ts
    │   ├── LoadingScreen.tsx
    │   ├── auth/
    │   │   ├── index.ts
    │   │   ├── LoginScreen.tsx
    │   │   ├── SignUpScreen.tsx
    │   │   └── ForgotPasswordScreen.tsx
    │   ├── main/
    │   │   ├── index.ts
    │   │   ├── DashboardScreen.tsx
    │   │   └── ProfileScreen.tsx
    │   ├── capture/
    │   │   ├── index.ts
    │   │   ├── CaptureHomeScreen.tsx
    │   │   ├── CameraScreen.tsx
    │   │   ├── ProcessingScreen.tsx
    │   │   └── ReviewScreen.tsx
    │   └── library/
    │       ├── index.ts
    │       ├── LibraryHomeScreen.tsx
    │       ├── VocabularyDetailScreen.tsx
    │       └── EditVocabularyScreen.tsx
    │
    ├── services/
    │   ├── index.ts
    │   ├── supabase.ts
    │   ├── auth.ts
    │   └── vocabulary.ts
    │
    ├── theme/
    │   ├── index.ts
    │   ├── colors.ts
    │   ├── typography.ts
    │   └── spacing.ts
    │
    └── types/
        └── index.ts
```

---

## Quick Reference by Feature

### To work on Authentication:

- `src/screens/auth/` - UI screens
- `src/hooks/useAuth.tsx` - State management
- `src/services/auth.ts` - API calls
- `src/navigation/AuthNavigator.tsx` - Screen flow

### To work on Vocabulary:

- `src/screens/library/` - List, detail, edit screens
- `src/screens/capture/` - Adding new vocabulary
- `src/hooks/useVocabulary.ts` - State management
- `src/services/vocabulary.ts` - API calls
- `src/components/vocabulary/` - UI components

### To change styling:

- `src/theme/colors.ts` - Colors
- `src/theme/typography.ts` - Fonts
- `src/theme/spacing.ts` - Margins/padding

### To add new screen:

1. Create screen in `src/screens/[feature]/`
2. Add to navigator in `src/navigation/`
3. Add type to `src/types/index.ts`
4. Export from screen's `index.ts`

### To add new component:

1. Create in `src/components/common/` or `vocabulary/`
2. Export from folder's `index.ts`
3. Import in screens as needed
