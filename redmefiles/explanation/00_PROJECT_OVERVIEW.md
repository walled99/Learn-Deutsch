# LernDeutsch AI - Complete Project Overview

## What is This Project?

**LernDeutsch AI** is a mobile application built for learning German vocabulary. It uses AI technology to extract German words from images (like photos of books, menus, or signs) and automatically organizes them into a personal vocabulary library.

---

## Main Purpose

1. **Capture** - Take photos containing German text
2. **Extract** - AI analyzes images and finds German words
3. **Organize** - Words are saved with grammar info (articles, plurals)
4. **Learn** - Track your progress from "New" to "Mastered"

---

## Technology Stack

| Technology           | What It Does                                |
| -------------------- | ------------------------------------------- |
| **React Native**     | Framework for building mobile apps          |
| **Expo SDK 52**      | Tools to simplify React Native development  |
| **TypeScript**       | JavaScript with type safety                 |
| **Supabase**         | Backend (database, authentication, storage) |
| **React Navigation** | Screen navigation in the app                |

---

## Project Architecture

```
LernDeutschAI/
│
├── App.tsx                    # Entry point - starts the app
├── app.json                   # Expo configuration
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript settings
├── babel.config.js            # Babel/module aliases
│
└── src/                       # All source code
    ├── types/                 # TypeScript type definitions
    ├── config/                # Environment variables
    ├── theme/                 # Colors, fonts, spacing
    ├── services/              # API and database calls
    ├── hooks/                 # Custom React hooks
    ├── navigation/            # Screen navigation setup
    ├── components/            # Reusable UI pieces
    └── screens/               # App screens/pages
```

---

## How the App Works (User Flow)

### 1. Authentication Flow

```
App Opens → Loading Screen →
    ├── Not Logged In → Auth Navigator (Login/SignUp)
    └── Logged In → Main App (Dashboard)
```

### 2. Capture Flow

```
Dashboard → Capture Tab → Choose Camera/Gallery →
    → Take Photo → Processing (AI) → Review Words →
    → Edit/Confirm → Save to Library
```

### 3. Library Flow

```
Library Tab → View All Words →
    ├── Search/Filter Words
    ├── View Word Details
    └── Edit/Delete Words
```

---

## Key Features Explained

### 1. Smart Image Capture

- Use phone camera or select from gallery
- AI extracts German text automatically
- Supports books, signs, menus, documents

### 2. German Grammar Support

- **Nouns**: Includes article (der/die/das) and plural form
- **Verbs**: Includes helper verb (haben/sein) and past participle
- **All words**: English translation and example sentences

### 3. Progress Tracking

Words move through 4 mastery levels:

- **New** → Just added, not studied yet
- **Learning** → Currently studying
- **Reviewing** → Know it, but need practice
- **Mastered** → Fully learned

### 4. Dark Theme Design

Called "Midnight Germany" - a beautiful dark blue theme that's easy on the eyes for studying.

---

## Folder Relationships

```
types/ ←─────────────── Defines data shapes used everywhere
   ↓
services/ ←──────────── Uses types for API calls
   ↓
hooks/ ←─────────────── Uses services, provides data to screens
   ↓
screens/ ←───────────── Uses hooks and components
   ↑
components/ ←────────── Reusable UI used by screens
   ↑
theme/ ←─────────────── Colors/fonts used by components
```

---

## Development Phases

| Phase   | Status     | Description                |
| ------- | ---------- | -------------------------- |
| Phase 1 | ✅ Done    | Supabase backend setup     |
| Phase 2 | ✅ Done    | Mobile UI implementation   |
| Phase 3 | 🔲 Pending | AI integration (Gemini)    |
| Phase 4 | 🔲 Pending | Offline sync & reliability |

---

## Quick Reference: Color Code

| Color               | Usage                                |
| ------------------- | ------------------------------------ |
| **Amber (#F59E0B)** | Primary buttons, actions             |
| **Teal (#14B8A6)**  | Success, "Mastered" status           |
| **Blue (#3B82F6)**  | "der" (masculine nouns), "Reviewing" |
| **Pink (#EC4899)**  | "die" (feminine nouns)               |
| **Green (#10B981)** | "das" (neuter nouns), success        |

---

## How to Run This Project

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm start

# 3. Open on device
# Press 'a' for Android or 'i' for iOS
```

---

## Next Documentation Files

See the following files for detailed explanations:

- [01_ROOT_FILES.md](./01_ROOT_FILES.md) - Root configuration files
- [02_TYPES.md](./02_TYPES.md) - TypeScript types
- [03_CONFIG.md](./03_CONFIG.md) - Environment configuration
- [04_THEME.md](./04_THEME.md) - Design system
- [05_SERVICES.md](./05_SERVICES.md) - API services
- [06_HOOKS.md](./06_HOOKS.md) - Custom React hooks
- [07_NAVIGATION.md](./07_NAVIGATION.md) - Navigation setup
- [08_COMPONENTS.md](./08_COMPONENTS.md) - UI components
- [09_SCREENS.md](./09_SCREENS.md) - App screens
