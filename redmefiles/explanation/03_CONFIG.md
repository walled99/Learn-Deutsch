# Config Folder - Environment Configuration

**Location:** `src/config/`  
**Purpose:** Stores environment variables and app settings

---

## Folder Structure

```
config/
├── env.ts      # Environment variables
└── index.ts    # Exports all config
```

---

## File: env.ts

### Purpose

Defines environment-specific configuration values that can change between development and production.

### Configuration Values

#### Supabase Configuration

```typescript
export const SUPABASE_URL = process.env.SUPABASE_URL || "https://...";
export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "eyJ...";
```

| Variable            | Purpose                     |
| ------------------- | --------------------------- |
| `SUPABASE_URL`      | Your Supabase project URL   |
| `SUPABASE_ANON_KEY` | Public API key for Supabase |

#### App Configuration

```typescript
export const APP_NAME = "LernDeutsch AI";
export const APP_VERSION = "1.0.0";
```

#### Feature Flags

```typescript
export const ENABLE_DEBUG_LOGGING = __DEV__; // True in development
export const ENABLE_MOCK_DATA = false; // Use fake data?
```

#### AI Configuration (Phase 3)

```typescript
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
```

---

## File: index.ts

### Purpose

Re-exports everything from env.ts for clean imports.

```typescript
export * from "./env";
```

### Usage in Other Files

```typescript
// Import config values
import { SUPABASE_URL, APP_NAME } from "@/config";
```

---

## How Environment Variables Work

### Development

In development, you can:

1. Create a `.env` file in project root
2. Set values there
3. They're loaded automatically

Example `.env`:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
GEMINI_API_KEY=your-gemini-key
```

### Production

In production builds:

- Values are compiled into the app
- Set via Expo or build configuration

---

## Relationship with Other Files

```
config/env.ts
      │
      ├──▶ src/services/supabase.ts (uses SUPABASE_URL, ANON_KEY)
      │
      └──▶ Future: AI service (uses GEMINI_API_KEY)
```

---

## Security Note

⚠️ **Important:** The fallback values in env.ts contain actual API keys. In a production app:

- Never commit real API keys to git
- Use environment variables instead
- The anon key is safe to expose (it's meant to be public)
- Service role keys should NEVER be in client code

---

## Summary

| File       | Purpose                         |
| ---------- | ------------------------------- |
| `env.ts`   | Define all configuration values |
| `index.ts` | Export config for clean imports |

The config folder keeps all environment-specific values in one place, making it easy to change settings between development and production environments.
