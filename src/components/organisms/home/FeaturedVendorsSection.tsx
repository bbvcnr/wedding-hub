import React from 'react';
import { FlatList, View } from 'react-native';
import { ThemedText, ThemedView } from '@/src/components/theme/themed-view';
import { VendorCard } from '@/src/components/molecules/VendorCard';
import { VendorItem } from '@/src/types/vendor';

interface FeaturedVendorsSectionProps {
  title: string;
  vendors: VendorItem[];
  onPressVendor?: (vendorId: string) => void;
  onFavoritePress?: (vendorId: string) => void;
  onContactPress?: (vendorId: string, vendorName: string) => void;
  favoritesSet?: Set<string>;
}

export function FeaturedVendorsSection({
  title,
  vendors,
  onPressVendor,
  onFavoritePress,
  onContactPress,
  favoritesSet,
}: FeaturedVendorsSectionProps) {
  if (vendors.length === 0) {
    return (
      <ThemedView variant="card" className="rounded-2xl px-4 py-5 items-center">
        <ThemedText className="text-sm">No featured vendors yet</ThemedText>
        <ThemedText variant="secondary" className="text-xs mt-2 text-center">
          Check back soon for curated recommendations.
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
              isFavorite={favoritesSet?.has(item.id) ?? false}
              onDetailsPress={onPressVendor}
              onFavoritePress={onFavoritePress}
              onContactPress={onContactPress}
            />
          </View>
        )}
      />
    </ThemedView>
  );
}
