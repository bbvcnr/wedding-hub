import { useTheme } from '@/src/components/theme/theme-provider';
import { ThemedText, ThemedView } from '@/src/components/theme/themed-view';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Saved() {
  const { isDark } = useTheme();

  return (
    <SafeAreaView 
      edges={['top', 'left', 'right']}
      className="flex-1"
      style={{ backgroundColor: isDark ? '#0F0F0F' : '#FFFFFF' }}
    >
      <ThemedView variant="background" className="flex-1 justify-center items-center">
        <ThemedText className="text-2xl font-semibold">Saved</ThemedText>
        <ThemedText variant="secondary" className="mt-2">Coming soon...</ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
}
