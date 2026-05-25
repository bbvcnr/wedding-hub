# 🎨 Elenn Mobile - Theming System Documentation

A comprehensive React Native theming system with light/dark mode support, built with Expo, NativeWind (Tailwind CSS), and TypeScript.

## 🧱 Key Components

- **ThemedView** - Background variants (background, surface, card)
- **ThemedText** - Text variants (primary, secondary, muted)  
- **ThemedButton** - Interactive elements (primary, secondary, outline)

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Architecture Overview](#architecture-overview)
- [Theme Provider](#theme-provider)
- [Themed Components](#themed-components)
- [Color System](#color-system)
- [Usage Examples](#usage-examples)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### 1. Basic Setup (Already Configured)

The theming system is already set up in your app:

```tsx
// app/_layout.tsx
import { ThemeProvider } from "../components/theme/theme-provider";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack />
    </ThemeProvider>
  );
}
```

### 2. Use Themed Components

```tsx
import { ThemedView, ThemedText } from "../components/theme/themed-view";
import { ThemedButton } from "../components/theme/themed-button";
import { useTheme } from "../components/theme/theme-provider";

export default function MyPage() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <ThemedView variant="background" className="flex-1 p-4">
      <ThemedText className="text-2xl font-bold mb-4">
        Welcome to {isDark ? 'Dark' : 'Light'} Mode!
      </ThemedText>
      <ThemedText variant="secondary" className="mb-4">
        This text adapts to your theme automatically.
      </ThemedText>
      <ThemedButton 
        title="Toggle Theme" 
        onPress={toggleTheme}
      />
    </ThemedView>
  );
}
```

---

## 🏗️ Architecture Overview

```
📱 App
├── ThemeProvider (React Context)
│   ├── AsyncStorage (Theme Persistence)
│   ├── System Theme Detection
│   └── Theme State Management
├── Themed Components
│   ├── ThemedView (Background variants)
│   └── ThemedText (Text variants)
├── Color System
│   ├── Tailwind Config (CSS Classes)
│   └── Color Utilities (JavaScript Objects)
└── Theme Controls
    └── ThemeToggle Component
```

---

## 🎭 Theme Provider

### Features
- **3 Theme Modes**: `light`, `dark`, `system`
- **Persistent Storage**: Remembers user preference
- **System Integration**: Follows device dark/light mode
- **Type Safety**: Full TypeScript support

### API

```tsx
const { theme, isDark, setTheme, toggleTheme } = useTheme();

// Theme state
theme: 'light' | 'dark' | 'system'  // Current theme setting
isDark: boolean                       // Computed dark mode state

// Theme controls  
setTheme('dark')                     // Set specific theme
toggleTheme()                        // Toggle between light/dark
```

### Usage in Any Component

```tsx
import { useTheme } from "../components/theme/theme-provider";

function MyComponent() {
  const { isDark, theme, setTheme } = useTheme();
  
  return (
    <View>
      <Text>Current theme: {theme}</Text>
      <Text>Is dark mode: {isDark ? 'Yes' : 'No'}</Text>
      <Button title="Go Dark" onPress={() => setTheme('dark')} />
    </View>
  );
}
```

---

## 🧱 Themed Components

### ThemedView

**Purpose**: Container component with theme-aware backgrounds

```tsx
interface ThemedViewProps {
  variant?: 'background' | 'surface' | 'card';
  className?: string;
  // ...all View props
}
```

| Variant | Light Mode | Dark Mode | Use Case |
|---------|------------|-----------|----------|
| `background` | White (#FFFFFF) | Very Dark (#0F0F0F) | **Main app background** |
| `surface` | Light Gray (#F8FAFC) | Dark Gray (#1F1F1F) | **Sections, panels** |
| `card` | White (#FFFFFF) | Medium Gray (#2D2D2D) | **Elevated content** |

**Examples:**
```tsx
// Page background
<ThemedView variant="background" className="flex-1">

// Content card  
<ThemedView variant="card" className="p-6 rounded-xl">

// Section within page
<ThemedView variant="surface" className="p-4 rounded-lg">
```

### ThemedText

**Purpose**: Text component with theme-aware colors

```tsx
interface ThemedTextProps {
  variant?: 'primary' | 'secondary' | 'muted';
  className?: string;
  // ...all Text props  
}
```

| Variant | Light Mode | Dark Mode | Use Case |
|---------|------------|-----------|----------|
| `primary` | Dark Gray (#1F2937) | Light White (#F9FAFB) | **Headlines, main text** |
| `secondary` | Medium Gray (#6B7280) | Light Gray (#9CA3AF) | **Subtitles, labels** |
| `muted` | Medium Gray + Opacity | Light Gray + Opacity | **Fine print, hex codes** |

**Examples:**
```tsx
// Main heading
<ThemedText className="text-3xl font-bold">Page Title</ThemedText>

// Subtitle  
<ThemedText variant="secondary" className="text-lg">Subtitle</ThemedText>

// Fine print
<ThemedText variant="muted" className="text-sm">Additional info</ThemedText>
```

### ThemedButton

**Purpose**: Interactive button component with theme-aware styling and multiple variants

```tsx
interface ThemedButtonProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  color?: 'pink' | 'blue' | 'green';
  // ...all TouchableOpacity props
}
```

| Variant | Background | Text Color | Border | Use Case |
|---------|------------|------------|--------|----------|
| `primary` | Colored (Pink by default) | White | None | **Main actions (Save, Submit)** |
| `secondary` | Grey (#6B7280) | White | None | **Secondary actions (Cancel)** |
| `outline` | Transparent | Colored | Colored | **Tertiary actions (Learn More)** |

| Size | Padding | Text Size | Use Case |
|------|---------|-----------|----------|
| `sm` | `px-3 py-2` | `text-sm` | **Compact spaces, inline buttons** |
| `md` | `px-4 py-3` | `text-base` | **Default size (recommended)** |
| `lg` | `px-6 py-4` | `text-lg` | **Hero sections, prominent CTAs** |

**Examples:**
```tsx
// Primary pink button (default)
<ThemedButton title="Save Changes" onPress={handleSave} />

// Secondary grey button  
<ThemedButton title="Cancel" variant="secondary" onPress={handleCancel} />

// Outline button with different color
<ThemedButton title="Learn More" variant="outline" color="green" onPress={handleLearn} />

// Different sizes
<ThemedButton title="Small" size="sm" />
<ThemedButton title="Medium" size="md" />  // Default
<ThemedButton title="Large" size="lg" />

// All color options
<ThemedButton title="Pink Button" color="pink" />    // #EC4899 (default)
<ThemedButton title="Blue Button" color="blue" />    // #3B82F6
<ThemedButton title="Green Button" color="green" />  // #14B8A6
```

---

## 🎨 Color System

### Tailwind Configuration

Your `tailwind.config.js` defines semantic color tokens:

```javascript
colors: {
  // Theme-aware colors (auto-switch)
  background: { DEFAULT: "#FFFFFF", dark: "#0F0F0F" },
  surface: { DEFAULT: "#F8FAFC", dark: "#1F1F1F" },  
  card: { DEFAULT: "#FFFFFF", dark: "#2D2D2D" },
  foreground: { DEFAULT: "#1F2937", dark: "#F9FAFB" },
  muted: { DEFAULT: "#6B7280", dark: "#9CA3AF" },
  
  // Brand colors (same in both modes)
  primary: "#EC4899", // Updated to pink!
  accent: {
    pink: "#EC4899",
    green: "#14B8A6", 
    blue: "#3B82F6"
  }
}
```

### Color Utilities

Use the `colors` object for direct access:

```tsx
import { colors } from "../utils/colors";

// Access accent colors
backgroundColor: colors.accent.pink     // #EC4899
backgroundColor: colors.theme.dark.card // #2D2D2D
```

### Using Colors in Components

```tsx
// Method 1: Themed Components (Recommended)
<ThemedView variant="card">
  <ThemedText>This adapts automatically</ThemedText>
</ThemedView>

// Method 2: Direct Tailwind Classes  
<View className="bg-primary">
  <Text className="text-accent-pink">Fixed colors</Text>
</View>

// Method 3: Inline Styles with Color Utils
<View style={{ backgroundColor: colors.accent.green }}>
  <Text>Direct color access</Text>
</View>

// Method 4: Conditional Styling
const { isDark } = useTheme();
<View className={isDark ? "bg-card-dark" : "bg-card"}>
```

---

## 🛠️ Usage Examples

### Creating a New Page

```tsx
// pages/ProfilePage.tsx
import { ScrollView, TouchableOpacity } from "react-native";
import { ThemedView, ThemedText } from "../components/theme/themed-view";
import { useTheme } from "../components/theme/theme-provider";

export default function ProfilePage() {
  const { isDark } = useTheme();

  return (
    <ThemedView variant="background" className="flex-1">
      <ScrollView className="p-4">
        
        {/* Header Card */}
        <ThemedView variant="card" className="p-6 rounded-xl mb-4">
          <ThemedText className="text-2xl font-bold mb-2">
            John Doe
          </ThemedText>
          <ThemedText variant="secondary">
            Software Developer
          </ThemedText>
        </ThemedView>

        {/* Settings Section */}
        <ThemedView variant="surface" className="p-4 rounded-lg">
          <ThemedText className="text-lg font-semibold mb-3">
            Settings  
          </ThemedText>
          
          <TouchableOpacity className="py-3 border-b border-gray-200">
            <ThemedText>Account Settings</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity className="py-3">
            <ThemedText>Privacy</ThemedText>
          </TouchableOpacity>
        </ThemedView>

      </ScrollView>
    </ThemedView>
  );
}
```

### Adding Theme Toggle to Any Page

```tsx
import { ThemeToggle } from "../components/theme/theme-toggle";

function SettingsPage() {
  return (
    <ThemedView variant="background" className="flex-1 p-4">
      <ThemedText className="text-xl font-bold mb-4">Settings</ThemedText>
      
      {/* Theme Controls */}
      <ThemedView variant="card" className="rounded-xl">
        <ThemedText className="p-4 text-lg font-semibold border-b border-gray-200">
          Appearance
        </ThemedText>
        <ThemeToggle />
      </ThemedView>
    </ThemedView>
  );
}
```

### Using ThemedButton Component

```tsx
import { ThemedButton } from "../components/theme/themed-button";

function ActionsPage() {
  const handleSave = () => console.log('Saved!');
  const handleCancel = () => console.log('Cancelled!');
  const handleLearn = () => console.log('Learning...');

  return (
    <ThemedView variant="background" className="flex-1 p-4">
      <ThemedText className="text-xl font-bold mb-4">Action Buttons</ThemedText>
      
      {/* Primary Actions */}
      <ThemedView variant="card" className="p-4 rounded-xl mb-4">
        <ThemedText className="font-semibold mb-3">Primary Actions</ThemedText>
        <ThemedView className="space-y-3">
          <ThemedButton title="Save Changes" onPress={handleSave} />
          <ThemedButton title="Submit Form" color="green" onPress={handleSave} />
          <ThemedButton title="Download" color="blue" onPress={handleSave} />
        </ThemedView>
      </ThemedView>

      {/* Secondary Actions */}
      <ThemedView variant="card" className="p-4 rounded-xl mb-4">
        <ThemedText className="font-semibold mb-3">Secondary Actions</ThemedText>
        <ThemedView className="flex-row space-x-3">
          <ThemedButton 
            title="Cancel" 
            variant="secondary" 
            className="flex-1"
            onPress={handleCancel} 
          />
          <ThemedButton 
            title="Reset" 
            variant="secondary" 
            className="flex-1"
            onPress={handleCancel} 
          />
        </ThemedView>
      </ThemedView>

      {/* Outline Actions */}
      <ThemedView variant="card" className="p-4 rounded-xl">
        <ThemedText className="font-semibold mb-3">Outline Actions</ThemedText>
        <ThemedView className="space-y-2">
          <ThemedButton title="Learn More" variant="outline" onPress={handleLearn} />
          <ThemedButton title="View Details" variant="outline" color="blue" onPress={handleLearn} />
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}
```

---

## ✅ Best Practices

### 1. **Always Use Themed Components**
```tsx
// ✅ Good - Adapts automatically
<ThemedView variant="card">
  <ThemedText>Hello World</ThemedText>
</ThemedView>

// ❌ Avoid - Fixed colors
<View className="bg-white">
  <Text className="text-black">Hello World</Text>
</View>
```

### 2. **Semantic Color Usage**
```tsx
// ✅ Good - Semantic meaning
<ThemedView variant="surface">    // "This is a surface"
<ThemedText variant="secondary">  // "This is secondary text"

// ❌ Avoid - Visual description
<View className="bg-gray-100">    // "This is gray"
<Text className="text-gray-600">  // "This is gray text"
```

### 3. **Consistent Component Structure**
```tsx
// ✅ Good - Proper nesting
<ThemedView variant="background" className="flex-1">        // Page
  <ThemedView variant="card" className="p-6 rounded-xl">    // Card
    <ThemedView variant="surface" className="p-4">          // Section
      <ThemedText>Content</ThemedText>
    </ThemedView>
  </ThemedView>
</ThemedView>
```

### 4. **Theme-Aware Logic**
```tsx
const { isDark, theme } = useTheme();

// ✅ Good - React to theme changes
const iconColor = isDark ? '#FFFFFF' : '##080F0F';
const statusBarStyle = isDark ? 'light-content' : 'dark-content';

// Use in conditional rendering
{isDark ? <DarkIcon /> : <LightIcon />}
```

---

## 🐛 Troubleshooting

### Colors Not Showing
```tsx
// Problem: Custom colors not appearing
<View className="bg-accentpink" /> // ❌ Might not work

// Solution: Use inline styles or predefined classes  
<View style={{ backgroundColor: colors.accent.pink }} /> // ✅ Works
<View className="bg-pink-500" /> // ✅ Works (Tailwind preset)
```

### Theme Not Persisting
```tsx
// Ensure ThemeProvider wraps your entire app
// app/_layout.tsx
<ThemeProvider>  // ✅ Must be at root level
  <Stack />
</ThemeProvider>
```

### TypeScript Errors
```tsx
// Problem: Variant not recognized
<ThemedText variant="surface"> // ❌ 'surface' doesn't exist

// Solution: Use correct variants
<ThemedText variant="secondary"> // ✅ Valid variant
```

### Components Not Updating
```tsx
// Make sure components use useTheme hook
import { useTheme } from "../components/theme/theme-provider";

function MyComponent() {
  const { isDark } = useTheme(); // ✅ This triggers re-renders
  
  return (
    <View style={{ 
      backgroundColor: isDark ? '#000' : '#fff' 
    }}>
```

---

## 📂 File Structure

```
components/
├── theme/
│   ├── theme-provider.tsx     # Theme context & logic
│   ├── themed-view.tsx        # ThemedView & ThemedText
│   ├── themed-button.tsx      # Interactive button component
│   ├── theme-toggle.tsx       # UI for theme switching
│   └── color-swatch.tsx       # Color display component
├── utils/
│   └── colors.ts              # Color definitions
├── app/
│   ├── _layout.tsx           # Root with ThemeProvider
│   └── index.tsx             # Example usage
└── tailwind.config.js         # Color tokens & Tailwind setup
```

---

## 🎯 Summary

Your theming system provides:

- 🎨 **Automatic Theme Switching** - Components adapt to light/dark mode
- 💾 **Persistent Preferences** - User choice saved across app restarts  
- 📱 **System Integration** - Follows device theme settings
- 🧱 **Reusable Components** - ThemedView, ThemedText & ThemedButton for consistency
- 🎛️ **Easy Controls** - ThemeToggle & ThemedButton components for user interaction
- 🌸 **Pink-First Design** - Beautiful pink primary color with multi-color support
- 🔧 **Developer Friendly** - TypeScript support & semantic naming

Simply use `ThemedView` and `ThemedText` components in any new page, and they'll automatically adapt to your user's theme preference! 🌙✨☀️