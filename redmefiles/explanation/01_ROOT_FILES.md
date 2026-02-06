# Root Configuration Files

This document explains all the configuration files in the project root directory.

---

## 1. App.tsx - Application Entry Point

**Location:** `/App.tsx`  
**Purpose:** The main starting point of the entire application

### What It Does:

```
App.tsx
   │
   ├── Sets up GestureHandlerRootView (for touch gestures)
   │
   ├── Sets up SafeAreaProvider (safe areas on notched phones)
   │
   ├── Sets up AuthProvider (authentication state)
   │
   ├── Sets up NavigationContainer (screen navigation)
   │
   ├── Configures StatusBar (dark theme style)
   │
   └── Renders RootNavigator (decides which screens to show)
```

### Key Components Used:

| Component                | Purpose                             |
| ------------------------ | ----------------------------------- |
| `GestureHandlerRootView` | Enables swipe and touch gestures    |
| `SafeAreaProvider`       | Handles iPhone notch/dynamic island |
| `AuthProvider`           | Provides login state to all screens |
| `NavigationContainer`    | React Navigation wrapper            |
| `RootNavigator`          | Main navigation logic               |

### Code Explanation:

```tsx
// This wraps the entire app and enables gestures
<GestureHandlerRootView style={{ flex: 1 }}>
  // SafeAreaProvider protects content from notches
  <SafeAreaProvider>
    // AuthProvider makes auth state available everywhere
    <AuthProvider>
      // NavigationContainer enables screen navigation
      <NavigationContainer theme={navigationTheme}>
        // StatusBar configures the top bar appearance
        <StatusBar barStyle="light-content" />
        // RootNavigator decides what to show
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  </SafeAreaProvider>
</GestureHandlerRootView>
```

### Relationship with Other Files:

- **Uses:** `src/hooks/useAuth` (AuthProvider)
- **Uses:** `src/navigation/RootNavigator`
- **Uses:** `src/theme` (COLORS)

---

## 2. app.json - Expo Configuration

**Location:** `/app.json`  
**Purpose:** Configures the Expo build and app metadata

### Key Settings:

| Setting              | Value            | Purpose                       |
| -------------------- | ---------------- | ----------------------------- |
| `name`               | "LernDeutsch AI" | App name shown on home screen |
| `slug`               | "lerndeutsch-ai" | URL-friendly app identifier   |
| `version`            | "1.0.0"          | Current app version           |
| `orientation`        | "portrait"       | Lock to portrait mode         |
| `userInterfaceStyle` | "dark"           | Always use dark theme         |

### Platform Settings:

**iOS:**

```json
{
  "supportsTablet": true,
  "bundleIdentifier": "com.lerndeutsch.ai",
  "infoPlist": {
    "NSCameraUsageDescription": "...", // Why we need camera
    "NSPhotoLibraryUsageDescription": "..." // Why we need photos
  }
}
```

**Android:**

```json
{
  "package": "com.lerndeutsch.ai",
  "permissions": [
    "android.permission.CAMERA", // Camera access
    "android.permission.READ_EXTERNAL_STORAGE" // Photo access
  ]
}
```

### Plugin Configuration:

Expo plugins are configured here:

- `expo-camera` - Camera permissions and setup
- `expo-image-picker` - Photo library access

---

## 3. package.json - Dependencies & Scripts

**Location:** `/package.json`  
**Purpose:** Defines project dependencies and npm scripts

### Scripts Available:

| Script        | Command                | What It Does             |
| ------------- | ---------------------- | ------------------------ |
| `start`       | `expo start`           | Start development server |
| `start:clear` | `expo start -c`        | Start with cleared cache |
| `android`     | `expo start --android` | Start on Android         |
| `ios`         | `expo start --ios`     | Start on iOS             |
| `lint`        | `eslint .`             | Check code for errors    |

### Key Dependencies:

**UI Framework:**

```json
{
  "expo": "~52.0.0", // Expo SDK
  "react": "18.3.1", // React library
  "react-native": "^0.76.9" // React Native
}
```

**Navigation:**

```json
{
  "@react-navigation/native": "^7.0.14", // Base navigation
  "@react-navigation/bottom-tabs": "^7.2.0", // Tab bar
  "@react-navigation/native-stack": "^7.2.0" // Stack navigation
}
```

**Backend:**

```json
{
  "@supabase/supabase-js": "^2.47.10" // Supabase client
}
```

**Camera & Images:**

```json
{
  "expo-camera": "~16.0.10", // Camera access
  "expo-image-picker": "~16.0.3" // Photo picker
}
```

**UI Enhancements:**

```json
{
  "expo-linear-gradient": "~14.0.1", // Gradient backgrounds
  "@expo/vector-icons": "^14.0.4", // Icon library
  "react-native-gesture-handler": "~2.20.2" // Touch gestures
}
```

---

## 4. tsconfig.json - TypeScript Configuration

**Location:** `/tsconfig.json`  
**Purpose:** Configures TypeScript compiler options

### Important Settings:

| Setting            | Value        | Purpose                     |
| ------------------ | ------------ | --------------------------- |
| `target`           | ES2020       | Output JavaScript version   |
| `strict`           | true         | Enable strict type checking |
| `jsx`              | react-native | JSX transformation format   |
| `moduleResolution` | node         | How to find modules         |

### Path Aliases:

Path aliases let you use short imports instead of long paths:

```typescript
// Instead of this:
import { Button } from "../../../components/common/Button";

// You can write this:
import { Button } from "@components";
```

**Configured Aliases:**

| Alias           | Maps To            |
| --------------- | ------------------ |
| `@/*`           | `src/*`            |
| `@components/*` | `src/components/*` |
| `@screens/*`    | `src/screens/*`    |
| `@navigation/*` | `src/navigation/*` |
| `@theme/*`      | `src/theme/*`      |
| `@services/*`   | `src/services/*`   |
| `@hooks/*`      | `src/hooks/*`      |
| `@types/*`      | `src/types/*`      |

---

## 5. babel.config.js - Babel Configuration

**Location:** `/babel.config.js`  
**Purpose:** Configures JavaScript transpilation

### What It Does:

1. **Preset:** Uses `babel-preset-expo` for Expo compatibility

2. **Plugins:**
   - `react-native-reanimated/plugin` - Animation library support
   - `module-resolver` - Makes path aliases work at runtime

### Module Resolver Configuration:

This plugin makes the TypeScript path aliases actually work:

```javascript
{
  alias: {
    "@": "./src",
    "@components": "./src/components",
    "@screens": "./src/screens",
    // ... etc
  }
}
```

### Why Both tsconfig.json and babel.config.js?

- **tsconfig.json** - Tells TypeScript editor/compiler about aliases
- **babel.config.js** - Makes aliases work at runtime when app runs

---

## File Relationship Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         App Start                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ app.json - Configures Expo (name, permissions, plugins)     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ package.json - Loads dependencies                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ babel.config.js - Transpiles code with aliases              │
│ tsconfig.json - Provides type checking                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ App.tsx - Starts the application                             │
│   → Sets up providers (Auth, Navigation, SafeArea)          │
│   → Renders RootNavigator                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Summary Table

| File              | Type   | Main Purpose                               |
| ----------------- | ------ | ------------------------------------------ |
| `App.tsx`         | Code   | Application entry point, sets up providers |
| `app.json`        | Config | Expo build settings, permissions           |
| `package.json`    | Config | Dependencies, npm scripts                  |
| `tsconfig.json`   | Config | TypeScript compiler settings, path aliases |
| `babel.config.js` | Config | JavaScript transpilation, runtime aliases  |
