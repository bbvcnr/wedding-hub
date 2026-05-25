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
      surface: '#F5F5F5',
      card: '#F5F5F5',
      text: '#1F2937',
      textSecondary: '#6B7280',
      border: '#E5E7EB',
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