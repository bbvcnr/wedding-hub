import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme, View } from 'react-native';
import { colors as colorUtils } from '@/src/utils/colors';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  colors: {
    background: string;
    surface: string;
    card: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
    border: string;
    accent: {
      pink: string;
      green: string;
      blue: string;
    };
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'app_theme';

// Theme color definitions - now using colors from utils/colors.ts
const themeColors = {
  light: {
    background: colorUtils.theme.light.background,
    surface: colorUtils.theme.light.surface,
    card: colorUtils.theme.light.card,
    text: {
      primary: colorUtils.theme.light.text,
      secondary: colorUtils.theme.light.textSecondary,
      muted: colorUtils.theme.light.textSecondary,
    },
    border: colorUtils.theme.light.border,
    accent: {
      pink: colorUtils.accent.pink,
      green: colorUtils.accent.green,
      blue: colorUtils.accent.blue,
    },
  },
  dark: {
    background: colorUtils.theme.dark.background,
    surface: colorUtils.theme.dark.surface,
    card: colorUtils.theme.dark.card,
    text: {
      primary: colorUtils.theme.dark.text,
      secondary: colorUtils.theme.dark.textSecondary,
      muted: colorUtils.theme.dark.textSecondary,
    },
    border: colorUtils.theme.dark.border,
    accent: {
      pink: colorUtils.accent.pink,
      green: colorUtils.accent.green,
      blue: colorUtils.accent.blue,
    },
  },
} as const;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<Theme>('system');
  
  // Calculate if dark mode should be active
  const isDark = theme === 'system' ? systemColorScheme === 'dark' : theme === 'dark';
  
  // Get current theme colors
  const colors = isDark ? themeColors.dark : themeColors.light;

  // Load theme from storage on app start
  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        setThemeState(savedTheme as Theme);
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  };

  const setTheme = async (newTheme: Theme) => {
    try {
      setThemeState(newTheme);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}