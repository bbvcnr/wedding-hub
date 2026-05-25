import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, ThemedView } from '@/src/components/theme/themed-view';
import { useTheme } from '@/src/components/theme/theme-provider';

interface HeroSectionProps {
  coupleName?: string;
  weddingDate?: string;
  hasWedding: boolean;
}

const formatWeddingDate = (date?: string) => {
  if (!date) return null;
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const getDaysUntil = (date?: string) => {
  if (!date) return null;
  const target = new Date(date);
  const today = new Date();
  const diffMs = target.getTime() - today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
};

export function HeroSection({ coupleName, weddingDate, hasWedding }: HeroSectionProps) {
  const { colors } = useTheme();
  const dateLabel = useMemo(() => formatWeddingDate(weddingDate), [weddingDate]);
  const daysUntil = useMemo(() => getDaysUntil(weddingDate), [weddingDate]);

  if (!hasWedding) {
    return (
      <ThemedView variant="card" className="px-5 py-6 rounded-2xl">
        <ThemedText className="text-xl font-semibold">Welcome to Elenn</ThemedText>
        <ThemedText variant="secondary" className="mt-2">
          Start by creating your wedding to personalize recommendations.
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView variant="background" className="items-center">
      <ThemedText className="text-3xl font-semibold text-center">
        {coupleName || 'Your Wedding'}
      </ThemedText>
      <View className="flex-row items-center mt-2">
        <Ionicons name="calendar" size={16} color={colors.text.secondary} />
        <ThemedText variant="secondary" className="ml-2">
          {dateLabel || 'Wedding date not set'}
        </ThemedText>
      </View>
      {daysUntil !== null && (
        <ThemedText variant="accentPink" className="mt-2 text-base">
          {daysUntil} days to go
        </ThemedText>
      )}
      <View className="flex-row items-center w-full mt-4">
        <View className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
        <View
          className="w-2 h-2 rounded-full mx-3"
          style={{ backgroundColor: colors.accent.pink }}
        />
        <View className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
      </View>
    </ThemedView>
  );
}
