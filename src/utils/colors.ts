// Color utility for consistent theming
export const colors = {
  accent: {
    pink: '#EC4899',
    green: '#14B8A6', 
    blue: '#3B82F6',
  },
  theme: {
    light: {
      background: '#FFFFFF',
      surface: '#F7F7F7',
      card: '#F7F7F7',
      text: '#1C1412',
      textSecondary: '#6B5C58',
      border: '#CCBDB8',
    },
    dark: {
      background: '#09090b',
      surface: '#18181b', 
      card: '#18181b',
      text: '#F9FAFB',
      textSecondary: '#9CA3AF',
      border: '#374151',
    }
  }
} as const;

export type AccentColor = keyof typeof colors.accent;
export type ThemeMode = 'light' | 'dark';