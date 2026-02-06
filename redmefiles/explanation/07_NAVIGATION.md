# Navigation Folder - Screen Navigation Setup

**Location:** `src/navigation/`  
**Purpose:** Defines how users move between screens in the app

---

## Folder Structure

```
navigation/
├── RootNavigator.tsx      # Main navigator (decides auth vs main)
├── AuthNavigator.tsx      # Login/SignUp screens
├── MainTabNavigator.tsx   # Bottom tab bar
├── CaptureNavigator.tsx   # Capture flow stack
├── LibraryNavigator.tsx   # Library flow stack
└── index.ts               # Exports all navigators
```

---

## Navigation Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      RootNavigator                           │
│                                                              │
│   Checks: isAuthenticated?                                   │
│                                                              │
│      ├── NO  → AuthNavigator (Login, SignUp)                │
│      │                                                       │
│      └── YES → MainTabNavigator (Tab Bar)                   │
│                   │                                          │
│                   ├── Dashboard                              │
│                   ├── Library → LibraryNavigator            │
│                   │              ├── LibraryHome            │
│                   │              ├── VocabularyDetail       │
│                   │              └── EditVocabulary         │
│                   ├── Capture → CaptureNavigator            │
│                   │              ├── CaptureHome            │
│                   │              ├── Camera                 │
│                   │              ├── Processing             │
│                   │              └── Review                 │
│                   └── Profile                                │
└─────────────────────────────────────────────────────────────┘
```

---

## File: RootNavigator.tsx

### Purpose

The main navigator that decides whether to show auth screens or main app.

### How It Works

```typescript
const RootNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading while checking auth
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        // User is logged in → show main app
        <Stack.Screen name="Main" component={MainTabNavigator} />
      ) : (
        // User is NOT logged in → show auth screens
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};
```

### Navigation Type

Uses **Native Stack Navigator** - optimal performance for root-level navigation.

---

## File: AuthNavigator.tsx

### Purpose

Handles navigation between authentication screens.

### Screens Included

| Screen           | Purpose              |
| ---------------- | -------------------- |
| `Login`          | Email/password login |
| `SignUp`         | Create new account   |
| `ForgotPassword` | Reset password       |

### Structure

```typescript
const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,           // No header
        contentStyle: { backgroundColor: COLORS.background.primary },
        animation: "slide_from_right" // Slide animation
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};
```

### Navigation Flow

```
Login Screen
    │
    ├── Tap "Sign Up" → navigate("SignUp")
    │
    ├── Tap "Forgot Password" → navigate("ForgotPassword")
    │
    └── Successful login → RootNavigator shows MainTabNavigator
```

---

## File: MainTabNavigator.tsx

### Purpose

Creates the bottom tab bar for main app navigation.

### Tabs Included

| Tab     | Screen           | Icon                       |
| ------- | ---------------- | -------------------------- |
| Home    | DashboardScreen  | 🏠 home                    |
| Library | LibraryNavigator | 📚 book                    |
| Capture | CaptureNavigator | 📷 camera (special button) |
| Profile | ProfileScreen    | 👤 person                  |

### Special Capture Button

The capture button is designed differently (center, raised):

```typescript
const CaptureButton = ({ focused }) => {
  return (
    <View style={styles.captureButtonContainer}>
      <LinearGradient
        colors={focused ? COLORS.primary.gradient : COLORS.surface.secondary}
        style={styles.captureButton}
      >
        <Ionicons name="camera" size={28} />
      </LinearGradient>
    </View>
  );
};
```

### Visual Layout

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│                    SCREEN CONTENT                            │
│                                                              │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   🏠        📚         📷         👤                        │
│  Home    Library    Capture    Profile                      │
│                        ▲                                     │
│                   (raised button)                            │
└─────────────────────────────────────────────────────────────┘
```

---

## File: CaptureNavigator.tsx

### Purpose

Handles the capture flow (taking/selecting photos, processing, reviewing).

### Screens Included

| Screen        | Purpose                   | Parameters                     |
| ------------- | ------------------------- | ------------------------------ |
| `CaptureHome` | Choose camera or gallery  | None                           |
| `Camera`      | Camera view for capturing | None                           |
| `Processing`  | Shows while AI processes  | `{ imageUri: string }`         |
| `Review`      | Review extracted words    | `{ extractedWords, imageUri }` |

### Navigation Flow

```
CaptureHome
    │
    ├── Tap "Camera" → Camera Screen
    │       │
    │       └── Capture Photo → Processing Screen
    │                               │
    │                               └── AI Done → Review Screen
    │                                               │
    │                                               └── Save → Library
    │
    └── Tap "Gallery" → Pick Image → Processing Screen → ...
```

### Processing Screen - Gestures Disabled

```typescript
<Stack.Screen
  name="Processing"
  component={ProcessingScreen}
  options={{ gestureEnabled: false }}  // Can't swipe back during AI processing
/>
```

---

## File: LibraryNavigator.tsx

### Purpose

Handles navigation in the vocabulary library.

### Screens Included

| Screen             | Purpose             | Parameters                   |
| ------------------ | ------------------- | ---------------------------- |
| `LibraryHome`      | List all vocabulary | None                         |
| `VocabularyDetail` | View single word    | `{ vocabularyId: string }`   |
| `EditVocabulary`   | Edit a word         | `{ vocabulary: Vocabulary }` |

### Navigation Flow

```
LibraryHome
    │
    └── Tap word card → VocabularyDetail
                            │
                            └── Tap "Edit" → EditVocabulary
                                                │
                                                └── Save → Back to LibraryHome
```

---

## File: index.ts

### Purpose

Exports all navigators.

```typescript
export { default as RootNavigator } from "./RootNavigator";
export { default as AuthNavigator } from "./AuthNavigator";
export { default as MainTabNavigator } from "./MainTabNavigator";
export { default as CaptureNavigator } from "./CaptureNavigator";
export { default as LibraryNavigator } from "./LibraryNavigator";
```

---

## Navigation Types Explained

### 1. Stack Navigator

Screens stack on top of each other:

- New screen slides in from right
- Going back slides screen out
- Used in: Auth, Capture, Library flows

### 2. Tab Navigator

Shows tabs at bottom:

- Instant switching between tabs
- Each tab can have its own stack
- Used in: MainTabNavigator

---

## How to Navigate

### Basic Navigation

```typescript
const navigation = useNavigation();

// Go to a screen
navigation.navigate("ScreenName");

// Go to a screen with params
navigation.navigate("VocabularyDetail", { vocabularyId: "123" });

// Go back
navigation.goBack();

// Go to top of stack
navigation.popToTop();
```

### Nested Navigation

```typescript
// Navigate to screen in another tab's stack
navigation.navigate("Library", {
  screen: "VocabularyDetail",
  params: { vocabularyId: "123" },
});

// Get parent navigator
navigation.getParent()?.navigate("Capture");
```

### Accessing Route Params

```typescript
const route = useRoute();
const { vocabularyId } = route.params; // Access passed params
```

---

## Type-Safe Navigation

Navigation is type-safe using `types/index.ts`:

```typescript
// Define param types
type LibraryStackParamList = {
  LibraryHome: undefined; // No params
  VocabularyDetail: { vocabularyId: string }; // Required param
  EditVocabulary: { vocabulary: Vocabulary }; // Complex param
};

// Use in screen
type DetailNavigationProp = NativeStackNavigationProp<
  LibraryStackParamList,
  "VocabularyDetail"
>;

const navigation = useNavigation<DetailNavigationProp>();
```

TypeScript will error if you:

- Navigate to wrong screen name
- Forget required parameters
- Pass wrong parameter types

---

## Complete Navigation Map

```
App Start
    │
    ▼
RootNavigator
    │
    ├── isLoading: true ──────▶ LoadingScreen
    │
    ├── isAuthenticated: false
    │         │
    │         ▼
    │    AuthNavigator
    │         ├── Login
    │         ├── SignUp
    │         └── ForgotPassword
    │
    └── isAuthenticated: true
              │
              ▼
         MainTabNavigator
              │
              ├── Dashboard ─────────────────────────────────▶ single screen
              │
              ├── Library ───▶ LibraryNavigator
              │                    ├── LibraryHome
              │                    ├── VocabularyDetail
              │                    └── EditVocabulary
              │
              ├── Capture ───▶ CaptureNavigator
              │                    ├── CaptureHome
              │                    ├── Camera
              │                    ├── Processing
              │                    └── Review
              │
              └── Profile ───────────────────────────────────▶ single screen
```

---

## Summary

| Navigator          | Type  | Contains                             |
| ------------------ | ----- | ------------------------------------ |
| `RootNavigator`    | Stack | Auth or Main (conditional)           |
| `AuthNavigator`    | Stack | Login, SignUp, ForgotPassword        |
| `MainTabNavigator` | Tab   | Dashboard, Library, Capture, Profile |
| `CaptureNavigator` | Stack | Capture flow screens                 |
| `LibraryNavigator` | Stack | Library flow screens                 |

Navigation is the **skeleton** of the app - it defines how users move between screens and the overall structure of the application.
