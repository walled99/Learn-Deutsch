# Screens Folder - App Screens/Pages

**Location:** `src/screens/`  
**Purpose:** Contains all the user-facing screens of the application

---

## Folder Structure

```
screens/
├── LoadingScreen.tsx        # Initial app loading
├── auth/                    # Authentication screens
│   ├── LoginScreen.tsx      # Email/password login
│   ├── SignUpScreen.tsx     # New account creation
│   ├── ForgotPasswordScreen.tsx # Password reset
│   └── index.ts
│
├── main/                    # Main app screens (tabs)
│   ├── DashboardScreen.tsx  # Home/overview
│   ├── ProfileScreen.tsx    # User profile & settings
│   └── index.ts
│
├── capture/                 # Capture flow screens
│   ├── CaptureHomeScreen.tsx # Camera/gallery choice
│   ├── CameraScreen.tsx      # Camera view
│   ├── ProcessingScreen.tsx  # AI processing state
│   ├── ReviewScreen.tsx      # Review extracted words
│   └── index.ts
│
├── library/                 # Library screens
│   ├── LibraryHomeScreen.tsx     # Vocabulary list
│   ├── VocabularyDetailScreen.tsx # Single word view
│   ├── EditVocabularyScreen.tsx   # Edit word form
│   └── index.ts
│
└── index.ts                 # Exports all screens
```

---

## Loading Screen

### LoadingScreen.tsx

**Purpose:** Displayed while app checks authentication status.

**Features:**

- App logo with animation
- "LernDeutsch AI" branding
- Animated loading dots
- Gradient background

**When shown:** Only during initial app load when `useAuth().isLoading` is true.

---

## Authentication Screens

### 1. LoginScreen.tsx

**Purpose:** Allows existing users to sign in.

**Features:**

- App logo and welcome message
- Email input with validation
- Password input with visibility toggle
- "Forgot Password?" link
- Sign In button with loading state
- "Sign Up" link for new users

**Form Validation:**

- Email: Required, valid format
- Password: Required, min 6 characters

**Flow:**

```
Enter credentials → Tap Sign In → Loading →
    ├── Success → Navigate to Dashboard
    └── Error → Show alert
```

---

### 2. SignUpScreen.tsx

**Purpose:** Allows new users to create an account.

**Features:**

- Back navigation
- Display name input
- Email input
- Password input (with hint "At least 6 characters")
- Confirm password input
- "Create Account" button
- "Sign In" link for existing users

**Form Validation:**

- Display name: Required
- Email: Required, valid format
- Password: Required, min 6 characters
- Confirm password: Must match password

---

### 3. ForgotPasswordScreen.tsx

**Purpose:** Allows users to reset their password.

**Features:**

- Back navigation
- Email input
- "Send Reset Link" button
- Success state with confirmation message

**Flow:**

```
Enter email → Tap Send → Loading →
    ├── Success → Shows "Check your email" message
    └── Error → Show alert
```

---

## Main Screens

### 1. DashboardScreen.tsx

**Purpose:** Main home screen with overview and quick actions.

**Sections:**

**1. Header:**

- Greeting based on time ("Good Morning/Afternoon/Evening")
- User's display name
- Profile button

**2. Quick Actions:**

- Large "New Capture" button with gradient
- Navigates to Capture tab

**3. Progress Stats:**

- Total words count
- Mastered count
- Learning count
- This week count

**4. Category Distribution:**

- Visual icons for each category (Noun, Verb, etc.)
- Count per category

**5. Recent Vocabulary:**

- Last 5 added words (compact cards)
- "View All" link to Library

**Data:**

- Uses `useVocabulary()` for vocabulary and stats
- Uses `useAuth()` for user info
- Pull-to-refresh supported

---

### 2. ProfileScreen.tsx

**Purpose:** User profile and app settings.

**Sections:**

**1. Profile Header:**

- Avatar with first letter
- Display name
- Email
- Mini stats:
  - Total Words (gradient card)
  - New, Learning, Reviewing, Mastered (status grid)

**2. Account Settings:**

- Edit Profile (coming soon)
- Change Password (coming soon)

**3. Preferences:**

- Notifications toggle
- Dark Mode toggle (always on)

**4. Data & Sync:**

- Sync status
- Export Data (coming soon)

**5. About:**

- App version
- Terms of Service
- Privacy Policy

**6. Sign Out Button:**

- Confirmation alert before signing out

---

## Capture Screens

### 1. CaptureHomeScreen.tsx

**Purpose:** Choose between camera and gallery for image capture.

**Sections:**

**1. Hero Section:**

- AI sparkles icon
- "AI-Powered Extraction" title
- Description

**2. Capture Options:**

- "Take Photo" - Amber gradient card, navigates to Camera
- "Choose from Gallery" - Outlined card, opens image picker

**3. Tips Card:**

- Best practices for image capture
- Clear text, good lighting, etc.

---

### 2. CameraScreen.tsx

**Purpose:** Camera interface for capturing photos.

**Features:**

- Full-screen camera view
- Close button (top left)
- Camera flip button (top right)
- Viewfinder overlay with corner markers
- Instruction text "Position German text within the frame"
- Large capture button (amber gradient)

**Permissions:**

- Handles camera permission request
- Shows permission denied state with "Grant Permission" button

**Flow:**

```
Grant permission → Frame text → Tap capture →
    Navigate to Processing with imageUri
```

---

### 3. ProcessingScreen.tsx

**Purpose:** Shows AI processing progress.

**Features:**

- Image preview at top (with gradient overlay)
- Animated pulsing icon
- Progress steps display:
  1. "Uploading image..."
  2. "Analyzing with AI..."
  3. "Extracting German text..."
  4. "Translating & categorizing..."
  5. "Preparing results..."
- Progress bar with percentage
- Step indicators (checkmarks for completed)

**Current Implementation:**

- Simulated processing (mock data)
- Real AI integration planned for Phase 3

**After Processing:**

- Navigates to Review screen with extracted words

---

### 4. ReviewScreen.tsx

**Purpose:** Review and edit AI-extracted words before saving.

**Features:**

**1. Image Preview:**

- Captured image thumbnail
- "X words extracted" badge

**2. Selection Controls:**

- "X of Y selected" counter
- "Select All / Deselect All" toggle

**3. Word Cards:**

- Checkbox for selection
- Category chip
- Edit button (pencil icon)
- Delete button (trash icon)
- Word with article (colored)
- Translation
- Example sentence

**4. Edit Mode:**

- Full VocabularyForm for editing
- "Done" button to return to list

**5. Save Action:**

- "Save Selected (X)" button
- Success alert with options:
  - "View Library"
  - "Capture More"

---

## Library Screens

### 1. LibraryHomeScreen.tsx

**Purpose:** Browse and search all vocabulary.

**Features:**

**1. Header:**

- Title "Vocabulary Library"
- Add button (navigates to Capture)

**2. Search Bar:**

- Real-time search
- Searches word and translation

**3. Filter Bar:**

- Category filter chips (All, Noun, Verb, etc.)
- Status filter chips (All, New, Learning, etc.)

**4. Vocabulary List:**

- FlatList of VocabularyCard components
- Pull-to-refresh
- Empty state when no results

**Data:**

- Uses `useVocabulary()` with filters
- Auto-refreshes on screen focus

---

### 2. VocabularyDetailScreen.tsx

**Purpose:** Detailed view of a single vocabulary word.

**Sections:**

**1. Hero Section:**

- Category badge
- Word with article (colored)
- Plural form (for nouns)
- Translation

**2. Status Card:**

- "Learning Status" title
- Status chips (New, Learning, Reviewing, Mastered)
- Tap to change status

**3. Grammar Details (Verbs):**

- Helper verb (haben/sein)
- Past participle

**4. Example Card:**

- Example sentence

**5. Actions:**

- Edit button in header
- Delete button at bottom

---

### 3. EditVocabularyScreen.tsx

**Purpose:** Edit existing vocabulary entry.

**Features:**

- VocabularyForm with current values
- Status selection
- "Save Changes" button
- "Delete Word" button with confirmation
- Unsaved changes warning on back

**Validation:**

- Word: Required
- Translation: Required
- Article: Required for nouns

---

## Screen Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                     USER FLOWS                               │
└─────────────────────────────────────────────────────────────┘

AUTH FLOW:
LoadingScreen → [Auth Check] →
    ├── Logged Out: LoginScreen ←→ SignUpScreen
    │                   ↓
    │           ForgotPasswordScreen
    │
    └── Logged In: DashboardScreen

CAPTURE FLOW:
DashboardScreen → CaptureHomeScreen →
    ├── Camera: CameraScreen → ProcessingScreen → ReviewScreen
    └── Gallery: [Pick] → ProcessingScreen → ReviewScreen
                                                    ↓
                                            LibraryHomeScreen

LIBRARY FLOW:
LibraryHomeScreen → VocabularyDetailScreen → EditVocabularyScreen
       ↑___________________|__________________________|
```

---

## Common Patterns Used

### 1. Screen Container Pattern

```tsx
<ScreenContainer scrollable keyboardAvoiding>
  <Header title="Screen Title" showBack />
  {/* Content */}
</ScreenContainer>
```

### 2. Loading State Pattern

```tsx
if (isLoading) {
  return (
    <ScreenContainer>
      <LoadingSpinner />
    </ScreenContainer>
  );
}
```

### 3. Form Validation Pattern

```tsx
const [errors, setErrors] = useState({});

const validateForm = () => {
  const newErrors = {};
  if (!field.trim()) {
    newErrors.field = "Field is required";
  }
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

### 4. Navigation with Params

```tsx
// Sending params
navigation.navigate("VocabularyDetail", { vocabularyId: item.id });

// Receiving params
const route = useRoute();
const { vocabularyId } = route.params;
```

---

## Summary Table

| Screen                   | Location | Purpose               |
| ------------------------ | -------- | --------------------- |
| `LoadingScreen`          | Root     | Initial app loading   |
| `LoginScreen`            | auth/    | User login            |
| `SignUpScreen`           | auth/    | New account           |
| `ForgotPasswordScreen`   | auth/    | Password reset        |
| `DashboardScreen`        | main/    | Home/overview         |
| `ProfileScreen`          | main/    | Settings              |
| `CaptureHomeScreen`      | capture/ | Camera/gallery choice |
| `CameraScreen`           | capture/ | Take photo            |
| `ProcessingScreen`       | capture/ | AI processing         |
| `ReviewScreen`           | capture/ | Review words          |
| `LibraryHomeScreen`      | library/ | Browse vocabulary     |
| `VocabularyDetailScreen` | library/ | View word             |
| `EditVocabularyScreen`   | library/ | Edit word             |

Screens are the **pages** users see - they combine components, use hooks for data, and connect through navigation.
