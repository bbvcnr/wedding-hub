import React from 'react';
import { FlatList, View } from 'react-native';
import { ThemedText, ThemedView } from '@/src/components/theme/themed-view';
import { HomeTip } from '@/src/types/home';
import { useTheme } from '@/src/components/theme/theme-provider';

interface TipsCarouselProps {
  tips: HomeTip[];
}

export function TipsCarousel({ tips }: TipsCarouselProps) {
  const { colors } = useTheme();

  if (tips.length === 0) {
    return null;
  }

  return (
    <ThemedView variant="background">
      <ThemedText className="text-lg font-semibold mb-3">Tips & Inspiration</ThemedText>
      <FlatList
        data={tips}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 12 }}
        renderItem={({ item }) => (
          <ThemedView
            key={item.id}
            variant="card"
            className="rounded-2xl px-4 py-5 mr-4"
            style={{ width: 240, height: 100, borderColor: colors.border, borderWidth: 1 }}
          >
            <ThemedText className="font-bold">{item.title}</ThemedText>
            <ThemedText variant="secondary" className="mt-2 text-sm">
              {item.description}
            </ThemedText>
          </ThemedView>
        )}
      />
    </ThemedView>
  );
}
