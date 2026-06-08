import React from 'react';
import { FlatList, View, Text } from 'react-native';
import { ThemedText, ThemedView } from '@/src/components/theme/themed-view';
import { HomeTip } from '@/src/types/home';
import { useTheme } from '@/src/components/theme/theme-provider';

interface TipsCarouselProps {
  tips: HomeTip[];
}

const ACCENT_SHADES: Record<'pink' | 'blue' | 'green', { bg: string; dark: string }> = {
  pink:  { bg: '#EC4899', dark: '#BE185D' },
  blue:  { bg: '#3B82F6', dark: '#1D4ED8' },
  green: { bg: '#14B8A6', dark: '#0F766E' },
};

export function TipsCarousel({ tips }: TipsCarouselProps) {
  if (tips.length === 0) return null;

  return (
    <ThemedView variant="background">
      <ThemedText style={{ fontSize: 20, fontWeight: '700', marginBottom: 12 }}>Tips & Inspiration</ThemedText>
      <FlatList
        data={tips}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 12 }}
        renderItem={({ item }) => {
          const shade = ACCENT_SHADES[item.accent];
          return (
            <View
              style={{
                width: 220,
                marginRight: 12,
                borderRadius: 18,
                backgroundColor: shade.bg,
                padding: 18,
                justifyContent: 'space-between',
                minHeight: 130,
              }}
            >
              <View
                style={{
                  width: 28,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: 'rgba(255,255,255,0.45)',
                  marginBottom: 12,
                }}
              />
              <Text style={{ color: '#fff', fontSize: 15, fontWeight: '800', lineHeight: 21 }}>
                {item.title}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, lineHeight: 17, marginTop: 6 }}>
                {item.description}
              </Text>
            </View>
          );
        }}
      />
    </ThemedView>
  );
}
