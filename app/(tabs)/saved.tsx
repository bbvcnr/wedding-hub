import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/src/components/theme/theme-provider';
import { ThemedText, ThemedView } from '@/src/components/theme/themed-view';
import { VendorCard } from '@/src/components/molecules/VendorCard';
import { ContactModal } from '@/src/components/molecules/ContactModal';
import { useAuth } from '@/src/context/AuthContext';
import { getFavorites, removeFavorite } from '@/src/services/weddingService';
import { getVendorDetails } from '@/src/services/vendorService';
import { VendorItem } from '@/src/types/vendor';
import { VendorLike } from '@/src/types/profile';

interface SavedEntry {
  like: VendorLike;
  vendor: VendorItem;
}

export default function Saved() {
  const { isDark, colors } = useTheme();
  const router = useRouter();
  const { weddingId } = useAuth();
  const [entries, setEntries] = useState<SavedEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactVendor, setContactVendor] = useState<{ id: string; name: string } | null>(null);

  const load = useCallback(async () => {
    if (!weddingId) return;
    setLoading(true);
    try {
      const likes = await getFavorites(weddingId);
      const results = await Promise.all(
        likes.map(async (like) => {
          const vendor = await getVendorDetails(like.vendorId).catch(() => null);
          return vendor ? { like, vendor } : null;
        })
      );
      setEntries(results.filter(Boolean) as SavedEntry[]);
    } finally {
      setLoading(false);
    }
  }, [weddingId]);

  useEffect(() => { load(); }, [load]);

  const handleRemove = async (entry: SavedEntry) => {
    if (!weddingId) return;
    await removeFavorite(weddingId, entry.like.id);
    setEntries((prev) => prev.filter((e) => e.like.id !== entry.like.id));
  };

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      className="flex-1"
      style={{ backgroundColor: isDark ? '#0F0F0F' : '#FFFFFF' }}
    >
      <ThemedView variant="background" className="px-6 pt-6 pb-3">
        <ThemedText className="text-3xl font-semibold">Saved</ThemedText>
        <ThemedText variant="secondary" className="mt-1">
          {loading ? '' : `${entries.length} vendor${entries.length !== 1 ? 's' : ''}`}
        </ThemedText>
      </ThemedView>

      {loading ? (
        <ThemedView variant="background" className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.accent.pink} />
        </ThemedView>
      ) : entries.length === 0 ? (
        <ThemedView variant="background" className="flex-1 items-center justify-center px-8">
          <ThemedText className="text-lg font-semibold text-center">No saved vendors yet</ThemedText>
          <ThemedText variant="secondary" className="text-sm mt-2 text-center">
            Tap the heart on any vendor card to save them here.
          </ThemedText>
        </ThemedView>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(e) => e.like.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
          ItemSeparatorComponent={() => <View className="h-4" />}
          renderItem={({ item }) => (
            <VendorCard
              vendor={item.vendor}
              isFavorite={true}
              onDetailsPress={(id) => router.push(`/vendor/${id}`)}
              onFavoritePress={() => handleRemove(item)}
              onContactPress={(id, name) => setContactVendor({ id, name })}
            />
          )}
        />
      )}
      <ContactModal
        visible={!!contactVendor}
        vendorId={contactVendor?.id ?? ''}
        vendorName={contactVendor?.name ?? ''}
        onClose={() => setContactVendor(null)}
      />
    </SafeAreaView>
  );
}
