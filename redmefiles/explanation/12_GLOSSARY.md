# 12. Glossary of Terms

A dictionary of technical terms, abbreviations, and concepts used in the LernDeutschAI project.

---

## A

### API (Application Programming Interface)

A way for different software to communicate. In this app, we use Supabase's API to store and retrieve data.

### Async/Await

JavaScript keywords for handling operations that take time (like network requests). `async` marks a function as asynchronous, `await` pauses until an operation completes.

```javascript
// Example from the app
const fetchVocabulary = async () => {
  const data = await vocabularyService.getAll();
  setVocabulary(data);
};
```

### Authentication

The process of verifying who a user is. Handled by Supabase Auth in this app through email/password login.

### AuthProvider

A React component that wraps the app and provides authentication state to all child components via Context.

---

## B

### Babel

A tool that converts modern JavaScript/TypeScript into code that can run on all devices. Configured in `babel.config.js`.

### Backend

The server-side of the application. Supabase serves as the backend for this app, providing database, auth, and storage.

### Bottom Tabs

A navigation pattern where tabs appear at the bottom of the screen. Implemented using `@react-navigation/bottom-tabs`.

---

## C

### CEFR (Common European Framework of Reference)

A standard for measuring language ability. Levels: A1, A2, B1, B2, C1, C2. Used to categorize vocabulary difficulty in this app.

### Component

A reusable piece of UI. In React Native, components are functions that return JSX (UI elements).

```javascript
// Example component
const Button = ({ title, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};
```

### Context (React Context)

A way to pass data through the component tree without manually passing props at every level. Used for AuthContext in this app.

### CRUD

Create, Read, Update, Delete - the four basic operations for data management.

---

## D

### Dark Theme

A color scheme using dark backgrounds and light text. The "Midnight Germany" theme in this app uses blues and grays.

### Dependency

An external package/library that the app uses. Listed in `package.json`.

### Destructuring

JavaScript syntax for extracting values from objects or arrays.

```javascript
const { user, loading } = useAuth();
const [first, second] = myArray;
```

---

## E

### Environment Variables

Configuration values that can change between environments (development, production). Stored in `src/config/env.ts`.

### Expo

A framework and platform for React Native that simplifies development. Provides pre-built native functionality like camera access.

### Export

Making code available to other files. Types:

- `export default` - One main export per file
- `export { name }` - Named exports, multiple per file

---

## F

### FilterState

A TypeScript interface defining the shape of filter options:

```typescript
interface FilterState {
  search: string;
  partOfSpeech: PartOfSpeech | null;
  difficulty: DifficultyLevel | null;
}
```

### FlatList

A React Native component for efficiently rendering scrollable lists. Used in LibraryHomeScreen for vocabulary list.

### Function Component

A React component written as a function (vs older class syntax). All components in this app are function components.

---

## G

### Git / GitHub

Version control system for tracking code changes. This project may be stored on GitHub.

### Gradient

A smooth color transition. `expo-linear-gradient` creates background gradients in this app.

---

## H

### Hook

A special function in React that lets you use state and other features in function components. Starts with `use`.

Types of hooks in this app:

- `useState` - Local state
- `useEffect` - Side effects
- `useAuth` - Custom auth hook
- `useVocabulary` - Custom vocabulary hook

---

## I

### Import

Bringing code from another file:

```javascript
import { Button } from "../components/common";
import supabase from "./supabase";
```

### Interface

TypeScript way to define the shape of an object:

```typescript
interface Vocabulary {
  id: string;
  german_word: string;
  translation: string;
}
```

---

## J

### JSX (JavaScript XML)

Syntax that lets you write HTML-like code in JavaScript. React Native uses JSX for UI.

```jsx
return (
  <View>
    <Text>Hello World</Text>
  </View>
);
```

### JSON (JavaScript Object Notation)

A data format used for configuration files and API responses.

---

## K

### KeyboardAvoidingView

A React Native component that moves content when the keyboard appears, preventing input fields from being hidden.

---

## L

### LinearGradient

A component from `expo-linear-gradient` that creates smooth color transitions for backgrounds.

### Loading State

A boolean value (`loading: true/false`) that tracks when data is being fetched. Shows spinner when true.

---

## M

### Middleware

Code that runs between an action and its result. Not heavily used in this app but common in larger apps.

### Modal

A popup overlay that appears on top of the current screen. Used for alerts, confirmations, or forms.

---

## N

### Navigation

Moving between screens in the app. Handled by React Navigation library.

Types in this app:

- **Stack Navigator**: Screens stack on top of each other (push/pop)
- **Tab Navigator**: Screens accessible via bottom tabs

### Native

Code that runs directly on the device (iOS/Android), not in a web browser. React Native bridges JavaScript to native code.

### npm (Node Package Manager)

Tool for installing and managing JavaScript packages. Commands:

- `npm install` - Install dependencies
- `npm start` - Start the app

---

## O

### Object

A JavaScript data structure with key-value pairs:

```javascript
const user = {
  name: "John",
  email: "john@example.com",
};
```

### onPress

A prop (property) passed to buttons that defines what happens when the button is pressed.

---

## P

### Part of Speech

Grammar category of a word. In this app:

- `noun` - Person, place, thing (das Haus)
- `verb` - Action (gehen, laufen)
- `adjective` - Describes noun (groß, klein)
- `adverb` - Modifies verb (schnell, langsam)
- `preposition` - Position word (in, auf, unter)
- `conjunction` - Connecting word (und, oder)
- `pronoun` - Replaces noun (ich, du, er)
- `other` - Everything else

### PostgreSQL

A powerful database system. Supabase uses PostgreSQL to store data.

### Props

Data passed from parent to child component:

```jsx
<Button title="Click Me" onPress={handleClick} />
// 'title' and 'onPress' are props
```

### Provider

A component that makes data available to all children (via Context):

```jsx
<AuthProvider>
  <App /> {/* All components inside can access auth data */}
</AuthProvider>
```

---

## Q

### Query

A request to retrieve data from a database:

```javascript
const { data } = await supabase
  .from("vocabulary")
  .select("*")
  .eq("user_id", userId);
```

---

## R

### React

A JavaScript library for building user interfaces using components.

### React Native

A framework for building mobile apps using React. Write JavaScript, get native iOS/Android apps.

### Re-render

When React updates the UI after state or props change. Optimizing re-renders improves performance.

### Route

A screen destination in navigation:

```javascript
navigation.navigate("VocabularyDetail");
// 'VocabularyDetail' is a route
```

---

## S

### SafeAreaView

A React Native component that ensures content doesn't overlap with device notches or system UI.

### Schema

The structure of a database or data:

```sql
-- Table schema
vocabulary (
  id UUID PRIMARY KEY,
  german_word TEXT NOT NULL,
  translation TEXT NOT NULL
)
```

### SecureStore

Expo's encrypted storage for sensitive data like auth tokens. Data persists between app sessions.

### Service

A file containing functions that interact with external APIs. In this app: `auth.ts`, `vocabulary.ts`.

### State

Data that can change over time and triggers UI updates:

```javascript
const [loading, setLoading] = useState(false);
// 'loading' is state, 'setLoading' changes it
```

### Supabase

An open-source Firebase alternative providing:

- **Auth**: User authentication
- **Database**: PostgreSQL database
- **Storage**: File storage
- **Realtime**: Live data updates

### Stack Navigator

Navigation where screens stack on top of each other. The back button "pops" the top screen.

---

## T

### Tab Navigator

Navigation with tabs (usually at bottom) for switching between main sections of the app.

### Theme

A collection of design values (colors, fonts, spacing) that define the app's visual style.

### Token (Auth Token)

A string that proves a user is logged in. Stored securely and sent with API requests.

### TouchableOpacity

A React Native component that responds to touch with a fade effect. Used for buttons.

### TypeScript

JavaScript with added type checking. Catches errors before runtime:

```typescript
function add(a: number, b: number): number {
  return a + b;
}
add("hello", "world"); // Error! Expects numbers
```

### Type Alias

A custom type definition:

```typescript
type PartOfSpeech = "noun" | "verb" | "adjective";
```

---

## U

### UI (User Interface)

The visual elements users interact with: buttons, text, images, etc.

### URI (Uniform Resource Identifier)

A string that identifies a resource. In this app, used for image paths.

### useEffect

A React hook for side effects (data fetching, subscriptions):

```javascript
useEffect(() => {
  fetchData();
}, []); // Runs once when component mounts
```

### useState

A React hook for managing local state:

```javascript
const [count, setCount] = useState(0);
```

### UUID (Universally Unique Identifier)

A unique string ID, like: `123e4567-e89b-12d3-a456-426614174000`. Used for database record IDs.

---

## V

### Validation

Checking if user input is correct before processing:

```javascript
if (!email.includes("@")) {
  setError("Invalid email");
  return;
}
```

### View

The basic container component in React Native (like `<div>` in web). Used to group other components.

### Vocabulary

In this app, a German word entry containing:

- German word
- Translation
- Part of speech
- Difficulty level
- Example sentence
- Notes
- Timestamps

---

## W

### Wrapper

A component that surrounds other components to add functionality:

```jsx
<ScreenContainer>
  {" "}
  {/* Wrapper */}
  <Text>Content</Text>
</ScreenContainer>
```

---

## Special Symbols

### `...` (Spread Operator)

Expands arrays or objects:

```javascript
const newArray = [...oldArray, newItem];
const newObject = { ...oldObject, newProp: value };
```

### `<>...</>` (Fragment)

Groups multiple elements without adding extra DOM nodes:

```jsx
return (
  <>
    <Text>Line 1</Text>
    <Text>Line 2</Text>
  </>
);
```

### `?.` (Optional Chaining)

Safely access nested properties:

```javascript
user?.profile?.name; // Returns undefined if any part is null
```

### `??` (Nullish Coalescing)

Provide default value if null/undefined:

```javascript
const name = user.name ?? "Anonymous";
```

### `=>` (Arrow Function)

Short syntax for functions:

```javascript
const add = (a, b) => a + b;
const greet = (name) => `Hello, ${name}`;
```

---

## Common Abbreviations

| Abbreviation | Full Form                              |
| ------------ | -------------------------------------- |
| API          | Application Programming Interface      |
| Auth         | Authentication                         |
| CEFR         | Common European Framework of Reference |
| CRUD         | Create, Read, Update, Delete           |
| DB           | Database                               |
| env          | Environment                            |
| JSON         | JavaScript Object Notation             |
| JSX          | JavaScript XML                         |
| npm          | Node Package Manager                   |
| OCR          | Optical Character Recognition          |
| Props        | Properties                             |
| SDK          | Software Development Kit               |
| SQL          | Structured Query Language              |
| TS           | TypeScript                             |
| UI           | User Interface                         |
| URL          | Uniform Resource Locator               |
| UUID         | Universally Unique Identifier          |

---

## Quick Reference

**When you see...**

| Code                     | Meaning                         |
| ------------------------ | ------------------------------- |
| `useState`               | Creating changeable data        |
| `useEffect`              | Running code when things change |
| `async/await`            | Waiting for network operations  |
| `navigation.navigate`    | Moving to another screen        |
| `supabase.from('table')` | Accessing database              |
| `StyleSheet.create`      | Creating styles                 |
| `export default`         | Main export from file           |
| `interface {...}`        | Defining data shape             |
| `type X = 'a' \| 'b'`    | Defining allowed values         |
