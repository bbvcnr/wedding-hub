import React from 'react';
import { FlatList, View } from 'react-native';
import { ThemedText, ThemedView } from '@/src/components/theme/themed-view';
import { VendorCard } from '@/src/components/molecules/VendorCard';
import { VendorItem } from '@/src/types/vendor';

interface RecentlyLikedSectionProps {
  title: string;
  vendors: VendorItem[];
  onPressVendor?: (vendorId: string) => void;
}

export function RecentlyLikedSection({ title, vendors, onPressVendor }: RecentlyLikedSectionProps) {
  if (vendors.length === 0) {
    return (
      <ThemedView variant="card" className="rounded-2xl px-4 py-5 items-center">
        <ThemedText className="text-sm">No liked vendors yet</ThemedText>
        <ThemedText variant="secondary" className="text-xs mt-2 text-center">
          Tap the heart on vendors you like to see them here.
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView variant="background">
      <ThemedText className="text-lg font-semibold mb-3">{title}</ThemedText>
      <FlatList
        data={vendors}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginHorizontal: -24 }}
        contentContainerStyle={{ paddingLeft: 24, paddingRight: 16 }}
        renderItem={({ item }) => (
          <View className="mr-4" style={{ width: 280 }}>
            <VendorCard
              vendor={item}
              onDetailsPress={onPressVendor}
              onFavoritePress={() => undefined}
              onContactPress={() => undefined}
            />
          </View>
        )}
      />
    </ThemedView>
  );
}
