import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedText, ThemedView } from '@/src/components/theme/themed-view';
import { useTheme } from '@/src/components/theme/theme-provider';
import { mockHomeContent } from '@/src/mocks/home';
import {
  CategoriesScroll,
  FeaturedVendorsSection,
  HeroSection,
  HireServicesCard,
  QuickActions,
  RecentlyLikedSection,
  TipsCarousel,
} from '@/src/components/organisms/home';

export function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tabBarOffset = 32 + insets.bottom;

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 + tabBarOffset }}>
        <ThemedView variant="background" className="px-6 pt-6">
          <HeroSection
            coupleName={mockHomeContent.coupleName}
            weddingDate={mockHomeContent.weddingDate}
            hasWedding={mockHomeContent.hasWedding}
          />
        </ThemedView>

        <ThemedView variant="background" className="px-6 pt-6">
          <ThemedText className="text-lg font-semibold mb-3">Explore Vendors</ThemedText>
          <CategoriesScroll
            categories={mockHomeContent.categories}
            onPressCategory={() => router.push('/(tabs)/search')}
          />
        </ThemedView>

        <ThemedView variant="background" className="px-6 pt-6">
          <ThemedText className="text-lg font-semibold mb-3">Hire Services</ThemedText>
          <View className="gap-3">
            {mockHomeContent.hireServices.map((service) => (
              <HireServicesCard
                key={service.id}
                service={service}
                onPress={() => router.push('/(tabs)/search')}
              />
            ))}
          </View>
        </ThemedView>

        <ThemedView variant="background" className="px-6 pt-6">
          <FeaturedVendorsSection
            title="Featured Vendors"
            vendors={mockHomeContent.featuredVendors}
            onPressVendor={(vendorId) => router.push(`/vendor/${vendorId}`)}
          />
        </ThemedView>

        <ThemedView variant="background" className="px-6 pt-6">
          <TipsCarousel tips={mockHomeContent.tips} />
        </ThemedView>

        <ThemedView variant="background" className="px-6 pt-6">
          <RecentlyLikedSection
            title="Recently Liked"
            vendors={mockHomeContent.recentlyLikedVendors}
            onPressVendor={(vendorId) => router.push(`/vendor/${vendorId}`)}
          />
        </ThemedView>

        <ThemedView variant="background" className="px-6 pt-6">
          <ThemedText className="text-lg font-semibold mb-3">Quick Actions</ThemedText>
          <QuickActions actions={mockHomeContent.quickActions} onPress={(route) => router.push(route)} />
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}
