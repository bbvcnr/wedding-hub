import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from './theme-provider';
import { ThemedText } from './themed-view';

export function ThemeToggle() {
  const { theme, isDark, setTheme, toggleTheme } = useTheme();

  const getThemeIcon = () => {
    return isDark ? '☀️' : '🌙';
  };

  const getThemeText = () => {
    switch (theme) {
      case 'light':
        return 'Light Mode';
      case 'dark':
        return 'Dark Mode';
      case 'system':
        return `System (${isDark ? 'Dark' : 'Light'})`;
      default:
        return 'Theme';
    }
  };

  return (
    <View className="flex-row items-center space-x-4 p-4">
      {/* Quick toggle button */}
      <TouchableOpacity
        onPress={toggleTheme}
        className={`
          p-3 rounded-full mr-2
          ${isDark ? 'bg-card-dark' : 'bg-card'}
          ${isDark ? 'border border-border-dark' : 'border border-border'}
        `}
      >
        <ThemedText className="text-2xl">
          {getThemeIcon()}
        </ThemedText>
      </TouchableOpacity>

      {/* Theme selector */}
      <View className="flex-1">
        <ThemedText className="text-lg font-semibold">
          {getThemeText()}
        </ThemedText>
        <View className="flex-row space-x-2 mt-2">
          {(['light', 'dark', 'system'] as const).map((themeOption) => (
            <TouchableOpacity
              key={themeOption}
              onPress={() => setTheme(themeOption)}
              className={`
                px-3 py-2 rounded-lg mr-2
                ${theme === themeOption 
                  ? 'bg-primary' 
                  : isDark ? 'bg-surface-dark' : 'bg-surface'
                }
                ${theme === themeOption 
                  ? '' 
                  : isDark ? 'border border-border-dark' : 'border border-border'
                }
              `}
            >
              <ThemedText 
                className={`
                  text-sm font-medium
                  ${theme === themeOption ? 'text-white' : ''}
                `}
              >
                {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}