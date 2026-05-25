import React, { useMemo } from 'react';
import { ScrollView, View, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ThemedText, ThemedView } from '@/src/components/theme/themed-view';
import { ThemedButton } from '@/src/components/theme/themed-button';
import { VendorCard } from '@/src/components/molecules/VendorCard';
import { useTheme } from '@/src/components/theme/theme-provider';
import {
  mockRecentlyLikedVendors,
  mockVendorInquiries,
  mockVendorLikes,
  mockVendorShortlist,
  mockWedding,
} from '@/src/mocks/profile';

const formatWeddingDate = (date?: string) => {
  if (!date) return null;
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const getDaysUntil = (date?: string) => {
  if (!date) return null;
  const target = new Date(date);
  const today = new Date();
  const diffMs = target.getTime() - today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
};

const formatWeddingStyle = (style?: string) => {
  if (!style) return 'Not set';
  return style.charAt(0) + style.slice(1).toLowerCase();
};

interface StatCardProps {
  label: string;
  value: number;
  icon: keyof typeof Ionicons.glyphMap;
  accentColor: string;
}

function StatCard({ label, value, icon, accentColor }: StatCardProps) {
  const { colors } = useTheme();

  return (
    <ThemedView
      variant="card"
      className="flex-1 rounded-2xl px-4 py-5"
      style={{ borderColor: colors.border, borderWidth: 1 }}
    >
      <View className="items-center">
        <View
          className="w-10 h-10 rounded-full items-center justify-center mb-3"
          style={{ backgroundColor: colors.background }}
        >
          <Ionicons name={icon} size={18} color={accentColor} />
        </View>
        <ThemedText variant="primary" className="text-3xl font-semibold">
          {value}
        </ThemedText>
      </View>
      <ThemedText variant="secondary" className="text-xs mt-2 text-center">
        {label}
      </ThemedText>
    </ThemedView>
  );
}

export function ProfileScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tabBarOffset = 54;

  const weddingDateLabel = useMemo(() => formatWeddingDate(mockWedding.weddingDate), []);
  const daysUntilWedding = useMemo(() => getDaysUntil(mockWedding.weddingDate), []);

  const stats = useMemo(
    () => [
      { label: 'Liked', value: mockVendorLikes.length, icon: 'heart', accentColor: colors.accent.pink },
      { label: 'Contacted', value: mockVendorInquiries.length, icon: 'chatbubble-ellipses', accentColor: colors.accent.blue },
      { label: 'Shortlisted', value: mockVendorShortlist.length, icon: 'bookmark', accentColor: colors.accent.green },
    ],
    [colors.accent.blue, colors.accent.green, colors.accent.pink]
  );

  const handleVendorPress = (vendorId: string) => {
    router.push(`/vendor/${vendorId}`);
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 + tabBarOffset }}>
        {/* Wedding Header */}
        <ThemedView variant="background" className="px-6 pt-6 pb-4 items-center">
          <ThemedText className="text-3xl font-semibold text-center">
            {mockWedding.coupleName}
          </ThemedText>
          <ThemedText variant="secondary" className="mt-2 text-center">
            {weddingDateLabel || 'Wedding date not set'}
          </ThemedText>
          {daysUntilWedding !== null && (
            <ThemedText variant="accentPink" className="mt-2 text-base">
              {daysUntilWedding} days to go
            </ThemedText>
          )}
          <View className="flex-row items-center w-full mt-4">
            <View className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
            <View
              className="w-2 h-2 rounded-full mx-3"
              style={{ backgroundColor: colors.accent.pink }}
            />
            <View className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
          </View>
        </ThemedView>

        {/* Planning Stats */}
        <ThemedView variant="background" className="px-6 pt-2">
          <ThemedText className="text-lg font-semibold mb-3">Your Progress</ThemedText>
          <View className="flex-row gap-3">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </View>
        </ThemedView>

        {/* Recently Liked Vendors */}
        <ThemedView variant="background" className="px-6 pt-6">
          <View className="flex-row items-center justify-between mb-3">
            <ThemedText className="text-lg font-semibold">Recently Liked</ThemedText>
            <TouchableOpacity onPress={() => router.push('/(tabs)/saved')}>
              <ThemedText variant="accentPink">View all</ThemedText>
            </TouchableOpacity>
          </View>
          {mockRecentlyLikedVendors.length === 0 ? (
            <ThemedView
              variant="card"
              className="rounded-xl px-4 py-6 items-center"
              style={{ borderColor: colors.border, borderWidth: 1 }}
            >
              <ThemedText className="text-sm">No liked vendors yet</ThemedText>
              <ThemedText variant="secondary" className="text-xs mt-2">
                Start exploring and tap the heart to save vendors.
              </ThemedText>
            </ThemedView>
          ) : (
            <FlatList
              data={mockRecentlyLikedVendors}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 12 }}
              renderItem={({ item }) => (
                <View className="mr-4" style={{ width: 280 }}>
                  <VendorCard
                    vendor={item}
                    onDetailsPress={handleVendorPress}
                    onFavoritePress={() => undefined}
                    onContactPress={() => undefined}
                  />
                </View>
              )}
            />
          )}
        </ThemedView>

        {/* Wedding Preferences */}
        <ThemedView variant="background" className="px-6 pt-6">
          <ThemedText className="text-lg font-semibold mb-3">Wedding preferences</ThemedText>
          <ThemedView
            variant="card"
            className="rounded-xl px-4 py-4"
            style={{ borderColor: colors.border, borderWidth: 1 }}
          >
            <View className="flex-row items-center justify-between">
              <ThemedText variant="secondary">Style</ThemedText>
              <ThemedText className="font-semibold">
                {formatWeddingStyle(mockWedding.style)}
              </ThemedText>
            </View>
            <View className="flex-row items-center justify-between mt-3">
              <ThemedText variant="secondary">Guest count</ThemedText>
              <ThemedText className="font-semibold">
                {mockWedding.guestCountRange
                  ? `${mockWedding.guestCountRange.min}-${mockWedding.guestCountRange.max}`
                  : 'Not set'}
              </ThemedText>
            </View>
          </ThemedView>
        </ThemedView>

        {/* Quick Actions */}
        <ThemedView variant="background" className="px-6 pt-6">
          <ThemedText className="text-lg font-semibold mb-3">Quick Actions</ThemedText>
          <View className="gap-2">
            <ThemedButton
              title="Explore Venues"
              variant="primary"
              color="pink"
              onPress={() => router.push('/(tabs)/search')}
            />
            <ThemedButton
              title="View Favorites"
              variant="outline"
              color="pink"
              onPress={() => router.push('/(tabs)/saved')}
            />
          </View>
        </ThemedView>

        {/* Account / Wedding Settings */}
        <ThemedView variant="background" className="px-6 pt-6">
          <ThemedText className="text-lg font-semibold mb-3">Settings</ThemedText>
          <ThemedView
            variant="card"
            className="rounded-xl"
            style={{ borderColor: colors.border, borderWidth: 1 }}
          >
            <TouchableOpacity className="flex-row items-center justify-between px-4 py-4">
              <View className="flex-row items-center">
                <Ionicons name="create-outline" size={18} color={colors.text.secondary} />
                <ThemedText className="ml-3">Edit Wedding Details</ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.text.secondary} />
            </TouchableOpacity>
            <View className="h-px" style={{ backgroundColor: colors.border }} />
            <TouchableOpacity className="flex-row items-center justify-between px-4 py-4">
              <View className="flex-row items-center">
                <Ionicons name="people-outline" size={18} color={colors.text.secondary} />
                <ThemedText className="ml-3">Manage partner</ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.text.secondary} />
            </TouchableOpacity>
            <View className="h-px" style={{ backgroundColor: colors.border }} />
            <TouchableOpacity className="flex-row items-center justify-between px-4 py-4">
              <View className="flex-row items-center">
                <Ionicons name="log-out-outline" size={18} color={colors.text.secondary} />
                <ThemedText className="ml-3">Logout</ThemedText>
              </View>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}
