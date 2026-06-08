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
      <ThemedText style={{ fontSize: 38, fontWeight: '800', textAlign: 'center', letterSpacing: -0.5 }}>
        {coupleName || 'Your Wedding'}
      </ThemedText>
      <View className="flex-row items-center mt-2">
        <Ionicons name="calendar-outline" size={14} color={colors.text.secondary} />
        <ThemedText variant="secondary" style={{ marginLeft: 6, fontSize: 14 }}>
          {dateLabel || 'Wedding date not set'}
        </ThemedText>
      </View>
      {daysUntil !== null && (
        <View
          style={{
            marginTop: 10,
            paddingHorizontal: 14,
            paddingVertical: 5,
            borderRadius: 20,
            backgroundColor: colors.accent.pink + '18',
          }}
        >
          <ThemedText style={{ color: colors.accent.pink, fontWeight: '700', fontSize: 13 }}>
            {daysUntil} days to go
          </ThemedText>
        </View>
      )}
      <View className="flex-row items-center w-full mt-5">
        <View className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
        <Ionicons name="heart" size={12} color={colors.accent.pink} style={{ marginHorizontal: 10 }} />
        <View className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
      </View>
    </ThemedView>
  );
}
