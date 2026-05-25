import React, { useState, useCallback, useEffect } from 'react';
import { FlatList, ActivityIndicator, RefreshControl, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { VendorCard } from '@/src/components/molecules/VendorCard';
import { ThemedView, ThemedText } from '@/src/components/theme/themed-view';
import { VendorItem } from '@/src/types/vendor';
import { ApiService } from '@/src/services/api';
import { SearchVendorRequest } from '@/src/types/vendor';
import { useTheme } from '@/src/components/theme/theme-provider';

interface VendorListProps {
  searchParams: Omit<SearchVendorRequest, 'pageRequest'>;
  onVendorPress?: (vendorId: string) => void;
  onFavoritePress?: (vendorId: string) => void;
  onContactPress?: (vendorId: string) => void;
}

export function VendorList({
  searchParams,
  onVendorPress,
  onFavoritePress,
  onContactPress,
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

  const renderItem = ({ item }: { item: VendorItem }) => (
    <VendorCard
      vendor={item}
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
        <ThemedView className="flex-1 items-center justify-center py-20">
          <ActivityIndicator size="large" color="#EC4899" />
          <ThemedText variant="secondary" className="mt-4">
            Loading vendors...
          </ThemedText>
        </ThemedView>
      );
    }

    if (error) {
      return (
        <ThemedView className="flex-1 items-center justify-center py-20 px-4">
          <ThemedText className="text-lg font-semibold mb-2 text-center">
            Error loading vendors
          </ThemedText>
          <ThemedText variant="secondary" className="text-center mb-4">
            {error}
          </ThemedText>
        </ThemedView>
      );
    }

    return (
      <ThemedView className="flex-1 items-center justify-center py-20 px-4">
        <ThemedText className="text-lg font-semibold mb-2 text-center">
          No vendors found
        </ThemedText>
        <ThemedText variant="secondary" className="text-center">
          Try adjusting your search criteria
        </ThemedText>
      </ThemedView>
    );
  };

  return (
    <FlatList
      data={vendors}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{
        padding: 16,
        paddingBottom: 32 + tabBarOffset,
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
  footer: {
    paddingVertical: 16,
  },
});

