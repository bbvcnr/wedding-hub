import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedText, ThemedView } from '@/src/components/theme/themed-view';
import { useTheme } from '@/src/components/theme/theme-provider';
import { mockHomeContent } from '@/src/mocks/home';
import { useWedding } from '@/src/hooks/useWedding';
import { useAuth } from '@/src/context/AuthContext';
import { getFavorites, addFavorite, removeFavorite } from '@/src/services/weddingService';
import { ApiService } from '@/src/services/api';
import { ContactModal } from '@/src/components/molecules/ContactModal';
import { VendorItem } from '@/src/types/vendor';
import { VendorLike } from '@/src/types/profile';
import {
  CategoriesScroll,
  FeaturedVendorsSection,
  HeroSection,
  QuickActions,
  RecentlyLikedSection,
  TipsCarousel,
} from '@/src/components/organisms/home';

export function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tabBarOffset = 32 + insets.bottom;
  const { wedding } = useWedding();
  const { weddingId } = useAuth();

  const [favoritesMap, setFavoritesMap] = useState<Map<string, string>>(new Map());
  const [photographers, setPhotographers] = useState<VendorItem[]>([]);
  const [contactVendor, setContactVendor] = useState<{ id: string; name: string } | null>(null);

  const loadFavorites = useCallback(async () => {
    if (!weddingId) return;
    const likes: VendorLike[] = await getFavorites(weddingId).catch(() => []);
    setFavoritesMap(new Map(likes.map((l) => [l.vendorId, l.id])));
  }, [weddingId]);

  const loadPhotographers = useCallback(async () => {
    const results = await ApiService.getFeaturedVendorsByCategory('photography', 3).catch(() => []);
    setPhotographers(results);
  }, []);

  useEffect(() => {
    loadFavorites();
    loadPhotographers();
  }, [loadFavorites, loadPhotographers]);

  const handleFavoritePress = async (vendorId: string) => {
    if (!weddingId) return;
    const existingLikeId = favoritesMap.get(vendorId);
    if (existingLikeId) {
      await removeFavorite(weddingId, existingLikeId);
      setFavoritesMap((prev) => { const m = new Map(prev); m.delete(vendorId); return m; });
    } else {
      const likeId = await addFavorite(weddingId, vendorId);
      setFavoritesMap((prev) => new Map(prev).set(vendorId, likeId));
    }
  };

  const favoritesSet = new Set(favoritesMap.keys());

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 + tabBarOffset }}>

        <ThemedView variant="background" className="px-6 pt-6">
          <HeroSection
            coupleName={wedding?.coupleName ?? mockHomeContent.coupleName}
            weddingDate={wedding?.weddingDate ?? mockHomeContent.weddingDate}
            hasWedding={!!wedding}
          />
        </ThemedView>

        <ThemedView variant="background" className="px-6 pt-6">
          <ThemedText style={{ fontSize: 20, fontWeight: '700', marginBottom: 12 }}>Explore Vendors</ThemedText>
          <CategoriesScroll
            categories={mockHomeContent.categories}
            onPressCategory={() => router.push('/(tabs)/search')}
          />
        </ThemedView>

        <ThemedView variant="background" className="px-6 pt-6">
          <TipsCarousel tips={mockHomeContent.tips} />
        </ThemedView>

        <ThemedView variant="background" className="px-6 pt-6">
          <FeaturedVendorsSection
            title="Featured Venues"
            vendors={mockHomeContent.featuredVendors}
            onPressVendor={(id) => router.push(`/vendor/${id}`)}
            onFavoritePress={handleFavoritePress}
            onContactPress={(id, name) => setContactVendor({ id, name })}
            favoritesSet={favoritesSet}
          />
        </ThemedView>

        {photographers.length > 0 && (
          <ThemedView variant="background" className="px-6 pt-6">
            <FeaturedVendorsSection
              title="Featured Photographers"
              vendors={photographers}
              onPressVendor={(id) => router.push(`/vendor/${id}`)}
              onFavoritePress={handleFavoritePress}
              onContactPress={(id, name) => setContactVendor({ id, name })}
              favoritesSet={favoritesSet}
            />
          </ThemedView>
        )}


        <ThemedView variant="background" className="px-6 pt-6">
          <RecentlyLikedSection
            title="Recently Liked"
            vendors={mockHomeContent.recentlyLikedVendors}
            onPressVendor={(id) => router.push(`/vendor/${id}`)}
          />
        </ThemedView>

        <ThemedView variant="background" className="px-6 pt-6">
          <ThemedText style={{ fontSize: 20, fontWeight: '700', marginBottom: 12 }}>Quick Actions</ThemedText>
          <QuickActions actions={mockHomeContent.quickActions} onPress={(route) => router.push(route)} />
        </ThemedView>

      </ScrollView>

      <ContactModal
        visible={!!contactVendor}
        vendorId={contactVendor?.id ?? ''}
        vendorName={contactVendor?.name ?? ''}
        onClose={() => setContactVendor(null)}
      />
    </SafeAreaView>
  );
}
