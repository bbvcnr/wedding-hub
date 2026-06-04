import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, ThemedView } from '@/src/components/theme/themed-view';
import { VendorCard } from '@/src/components/molecules/VendorCard';
import { useTheme } from '@/src/components/theme/theme-provider';
import { useAuth } from '@/src/context/AuthContext';
import { getShortlist, removeFromShortlist } from '@/src/services/weddingService';
import { getVendorDetails } from '@/src/services/vendorService';
import { VendorItem } from '@/src/types/vendor';
import { VendorShortlist } from '@/src/types/profile';

interface ShortlistEntry {
  shortlist: VendorShortlist;
  vendor: VendorItem;
}

export default function ShortlistScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { weddingId } = useAuth();
  const [entries, setEntries] = useState<ShortlistEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!weddingId) return;
    setLoading(true);
    try {
      const items = await getShortlist(weddingId);
      const results = await Promise.all(
        items.map(async (s) => {
          const vendor = await getVendorDetails(s.vendorId).catch(() => null);
          return vendor ? { shortlist: s, vendor } : null;
        })
      );
      setEntries(results.filter(Boolean) as ShortlistEntry[]);
    } finally {
      setLoading(false);
    }
  }, [weddingId]);

  useEffect(() => { load(); }, [load]);

  const handleRemove = async (entry: ShortlistEntry) => {
    if (!weddingId) return;
    await removeFromShortlist(weddingId, entry.shortlist.id);
    setEntries((prev) => prev.filter((e) => e.shortlist.id !== entry.shortlist.id));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'left', 'right']}>
      <ThemedView variant="background" style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <ThemedText className="text-2xl font-semibold ml-4">Shortlist</ThemedText>
      </ThemedView>

      {loading ? (
        <ThemedView variant="background" className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.accent.pink} />
        </ThemedView>
      ) : entries.length === 0 ? (
        <ThemedView variant="background" className="flex-1 items-center justify-center px-8">
          <Ionicons name="bookmark-outline" size={48} color={colors.text.muted} />
          <ThemedText className="text-lg font-semibold text-center mt-4">No shortlisted vendors</ThemedText>
          <ThemedText variant="secondary" className="text-sm mt-2 text-center">
            Open any vendor and tap "Add to Shortlist" to compare your top choices.
          </ThemedText>
        </ThemedView>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(e) => e.shortlist.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          renderItem={({ item }) => (
            <VendorCard
              vendor={item.vendor}
              onDetailsPress={(id) => router.push(`/vendor/${id}`)}
              onFavoritePress={() => handleRemove(item)}
              onContactPress={() => undefined}
              isFavorite={true}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}
