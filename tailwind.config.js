/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Theme-aware background colors
        background: {
          DEFAULT: "#FFFFFF", // Light mode default
          dark: "#0F0F0F",    // Dark mode (softer than pure black)
        },
        surface: {
          DEFAULT: "#F8FAFC", // Light mode surface
          dark: "#1F1F1F",    // Dark mode surface
        },
        card: {
          DEFAULT: "#FFFFFF", // Light mode card
          dark: "#2D2D2D",    // Dark mode card
        },
        // Theme-aware text colors
        foreground: {
          DEFAULT: "#1F2937", // Light mode primary text
          dark: "#F9FAFB",    // Dark mode primary text
        },
        muted: {
          DEFAULT: "#6B7280", // Light mode secondary text
          dark: "#9CA3AF",    // Dark mode secondary text
        },
        // Theme-aware borders
        border: {
          DEFAULT: "#E5E7EB", // Light mode border
          dark: "#374151",    // Dark mode border
        },
        // Brand colors (same in both modes)
        primary: "#EC4899", // Changed to pink!
        secondary: "#6B7280",
        accent: {
          pink: "#EC4899",
          green: "#14B8A6",
          blue: "#3B82F6",
        },
        // Alternative naming that should work
        pink: {
          500: "#EC4899",
        },
        emerald: {
          500: "#14B8A6", 
        },
        blue: {
          500: "#3B82F6",
        },
        // Legacy colors (keeping for compatibility)
        light: {
          100: "#D6C7FF",
          200: "#A8B5DB",
          300: "#9CA4AB",
        },
        dark: {
          100: "#444244",
          200: "#333333",
        },
      },
    },
  },
  plugins: [],
};