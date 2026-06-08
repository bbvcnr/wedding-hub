import React, { useState, useCallback, useEffect } from 'react';
import { FlatList, ActivityIndicator, RefreshControl, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { VendorCard } from '@/src/components/molecules/VendorCard';
import { ThemedView, ThemedText } from '@/src/components/theme/themed-view';
import { VendorItem } from '@/src/types/vendor';
import { ApiService } from '@/src/services/api';
import { SearchVendorRequest } from '@/src/types/vendor';
import { useTheme } from '@/src/components/theme/theme-provider';

export type SortBy = 'rating_desc' | 'rating_asc' | 'name_asc' | 'name_desc';

interface VendorListProps {
  searchParams: Omit<SearchVendorRequest, 'pageRequest'>;
  sortBy?: SortBy;
  onVendorPress?: (vendorId: string) => void;
  onFavoritePress?: (vendorId: string) => void;
  onContactPress?: (vendorId: string, vendorName: string) => void;
  getFavoriteState?: (vendorId: string) => boolean;
}

function sortVendors(vendors: VendorItem[], sortBy: SortBy): VendorItem[] {
  return [...vendors].sort((a, b) => {
    switch (sortBy) {
      case 'rating_desc': return (b.rating ?? 0) - (a.rating ?? 0);
      case 'rating_asc':  return (a.rating ?? 0) - (b.rating ?? 0);
      case 'name_asc':    return a.name.localeCompare(b.name);
      case 'name_desc':   return b.name.localeCompare(a.name);
    }
  });
}

export function VendorList({
  searchParams,
  sortBy = 'rating_desc',
  onVendorPress,
  onFavoritePress,
  onContactPress,
  getFavoriteState,
}: VendorListProps) {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const tabBarOffset = 32 + insets.bottom;
  const [vendors, setVendors] = useState<VendorItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pageSize = 10;

  const loadVendors = useCallback(
    async (pageNum: number, reset: boolean = false) => {
      if (loading || (!hasMore && !reset)) return;

      try {
        setLoading(true);
        setError(null);

        const request: SearchVendorRequest = {
          ...searchParams,
          pageRequest: {
            page: pageNum,
            size: pageSize,
          },
        };

        const response = await ApiService.searchVendors(request);

        if (reset) {
          setVendors(response.data);
        } else {
          setVendors((prev) => [...prev, ...response.data]);
        }

        setHasMore(response.metadata.hasMore);
        setPage(pageNum);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load vendors');
        console.error('Error loading vendors:', err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [searchParams, loading, hasMore, pageSize]
  );

  useEffect(() => {
    setVendors([]);
    setPage(0);
    setHasMore(true);
    loadVendors(0, true);
  }, [searchParams.text, searchParams.category, searchParams.city]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadVendors(page + 1, false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(0);
    setHasMore(true);
    loadVendors(0, true);
  };

  const sortedVendors = sortVendors(vendors, sortBy);

  const renderItem = ({ item }: { item: VendorItem }) => (
    <VendorCard
      vendor={item}
      isFavorite={getFavoriteState?.(item.id) ?? false}
      onFavoritePress={onFavoritePress}
      onDetailsPress={onVendorPress}
      onContactPress={onContactPress}
    />
  );

  const renderFooter = () => {
    if (!loading || vendors.length === 0) return null;
    return (
      <ThemedView variant="background" style={styles.footer}>
        <ActivityIndicator
          size="small"
          color="#EC4899"
        />
      </ThemedView>
    );
  };

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={emptyStyles.wrap}>
          <ActivityIndicator size="large" color="#EC4899" />
          <ThemedText variant="secondary" style={emptyStyles.label}>Loading vendors…</ThemedText>
        </View>
      );
    }

    if (error) {
      return (
        <View style={emptyStyles.wrap}>
          <View style={[emptyStyles.iconWrap, { backgroundColor: '#FEE2E2' }]}>
            <Ionicons name="alert-circle-outline" size={32} color="#EF4444" />
          </View>
          <ThemedText style={emptyStyles.title}>Something went wrong</ThemedText>
          <ThemedText variant="secondary" style={emptyStyles.sub}>{error}</ThemedText>
        </View>
      );
    }

    return (
      <View style={emptyStyles.wrap}>
        <View style={[emptyStyles.iconWrap, { backgroundColor: '#EC489918' }]}>
          <Ionicons name="search-outline" size={32} color="#EC4899" />
        </View>
        <ThemedText style={emptyStyles.title}>No vendors found</ThemedText>
        <ThemedText variant="secondary" style={emptyStyles.sub}>
          Try a different name, city, or category
        </ThemedText>
      </View>
    );
  };

  return (
    <FlatList
      data={sortedVendors}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{
        padding: 16,
        paddingBottom: 32 + tabBarOffset,
        gap: 16,
      }}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={isDark ? '#EC4899' : '#EC4899'}
        />
      }
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  footer: { paddingVertical: 16 },
});

const emptyStyles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80, paddingHorizontal: 32 },
  iconWrap: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 6 },
  sub: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  label: { marginTop: 12, fontSize: 14 },
});

