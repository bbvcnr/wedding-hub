import React, { useMemo, useState } from 'react';
import { ScrollView, View, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ThemedText, ThemedView } from '@/src/components/theme/themed-view';
import { ThemedButton } from '@/src/components/theme/themed-button';
import { VendorCard } from '@/src/components/molecules/VendorCard';
import { GuestsModal } from '@/src/components/molecules/GuestsModal';
import { BudgetModal } from '@/src/components/molecules/BudgetModal';
import { ContactModal } from '@/src/components/molecules/ContactModal';
import { useTheme } from '@/src/components/theme/theme-provider';
import { useWedding } from '@/src/hooks/useWedding';
import { useAuth } from '@/src/context/AuthContext';
import { Wedding } from '@/src/types/profile';

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
  onPress?: () => void;
}

function StatCard({ label, value, icon, accentColor, onPress }: StatCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
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
    </TouchableOpacity>
  );
}

function InfoCell({ label, value, highlight = false, negative = false }: { label: string; value: string; highlight?: boolean; negative?: boolean }) {
  const { colors } = useTheme();
  return (
    <View className="items-center">
      <ThemedText variant="secondary" className="text-xs mb-1">{label}</ThemedText>
      <ThemedText className="font-bold text-base" style={highlight ? { color: negative ? '#EF4444' : '#10B981' } : undefined}>{value}</ThemedText>
    </View>
  );
}

export function ProfileScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tabBarOffset = 54;
  const { logout } = useAuth();

  const { loading, wedding, favorites, recentVendors } = useWedding(5);
  const [weddingData, setWeddingData] = useState<Partial<Wedding>>({});
  const [showGuests, setShowGuests] = useState(false);
  const [showBudget, setShowBudget] = useState(false);
  const [contactVendor, setContactVendor] = useState<{ id: string; name: string } | null>(null);

  const mergedWedding = wedding ? { ...wedding, ...weddingData } : null;

  const guestsPerTable = mergedWedding?.totalGuests && mergedWedding?.numberOfTables && mergedWedding.numberOfTables > 0
    ? Math.round(mergedWedding.totalGuests / mergedWedding.numberOfTables)
    : null;

  const remainingBudget = mergedWedding?.totalBudget != null && mergedWedding?.spentBudget != null
    ? mergedWedding.totalBudget - mergedWedding.spentBudget
    : null;

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => logout() },
    ]);
  };

  const weddingDateLabel = useMemo(() => formatWeddingDate(wedding?.weddingDate), [wedding]);
  const daysUntilWedding = useMemo(() => getDaysUntil(wedding?.weddingDate), [wedding]);

  const stats = useMemo(
    () => [
      { label: 'Liked', value: favorites.length, icon: 'heart' as const, accentColor: colors.accent.pink, onPress: () => router.push('/(tabs)/saved') },
      { label: 'Contacted', value: 0, icon: 'chatbubble-ellipses' as const, accentColor: colors.accent.blue, onPress: undefined },
      { label: 'Shortlisted', value: 0, icon: 'bookmark' as const, accentColor: colors.accent.green, onPress: () => router.push('/shortlist') },
    ],
    [favorites.length, colors.accent.blue, colors.accent.green, colors.accent.pink]
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
            {loading ? '...' : (wedding?.coupleName ?? 'My Wedding')}
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
          {favorites.length === 0 ? (
            <ThemedView
              variant="card"
              className="rounded-xl px-6 py-8 items-center"
              style={{ borderColor: colors.border, borderWidth: 1 }}
            >
              <Ionicons name="rocket-outline" size={40} color={colors.accent.pink} />
              <ThemedText className="text-lg font-semibold mt-3 text-center">Get Started</ThemedText>
              <ThemedText variant="secondary" className="text-sm mt-2 text-center">
                Start exploring vendors and save your favorites to begin planning
              </ThemedText>
              <ThemedButton
                title="Explore Vendors"
                variant="primary"
                color="pink"
                onPress={() => router.push('/(tabs)/search')}
                className="mt-4 w-full"
              />
            </ThemedView>
          ) : (
            <View className="flex-row gap-3">
              {stats.map((stat) => (
                <StatCard key={stat.label} {...stat} onPress={stat.onPress} />
              ))}
            </View>
          )}
        </ThemedView>

        {/* Guests & Seating */}
        <ThemedView variant="background" className="px-6 pt-6">
          <View className="flex-row items-center justify-between mb-3">
            <ThemedText className="text-lg font-semibold">Guests & Seating</ThemedText>
            <TouchableOpacity onPress={() => setShowGuests(true)}>
              <Ionicons name="create-outline" size={20} color={colors.accent.pink} />
            </TouchableOpacity>
          </View>
          {!mergedWedding?.totalGuests ? (
            <ThemedView
              variant="card"
              className="rounded-xl px-4 py-6 items-center"
              style={{ borderColor: colors.border, borderWidth: 1 }}
            >
              <Ionicons name="people-outline" size={32} color={colors.accent.pink} />
              <ThemedText className="text-base font-semibold mt-2 text-center">Add guest details</ThemedText>
              <ThemedText variant="secondary" className="text-xs mt-2 text-center">Plan seating and track your guest count</ThemedText>
              <ThemedButton
                title="Edit Details"
                size="sm"
                onPress={() => setShowGuests(true)}
                className="mt-3"
              />
            </ThemedView>
          ) : (
            <ThemedView variant="card" className="rounded-xl px-4 py-4" style={{ borderColor: colors.border, borderWidth: 1 }}>
              <View className="flex-row justify-between mb-3">
                <InfoCell label="Total Guests" value={mergedWedding?.totalGuests?.toString() ?? '—'} />
                <InfoCell label="Tables" value={mergedWedding?.numberOfTables?.toString() ?? '—'} />
                <InfoCell label="VIP Tables" value={mergedWedding?.vipTables?.toString() ?? '—'} />
                <InfoCell label="Per Table" value={guestsPerTable?.toString() ?? '—'} highlight />
              </View>
            </ThemedView>
          )}
        </ThemedView>

        {/* Budget */}
        <ThemedView variant="background" className="px-6 pt-6">
          <View className="flex-row items-center justify-between mb-3">
            <ThemedText className="text-lg font-semibold">Budget</ThemedText>
            <TouchableOpacity onPress={() => setShowBudget(true)}>
              <Ionicons name="create-outline" size={20} color={colors.accent.pink} />
            </TouchableOpacity>
          </View>
          {!mergedWedding?.totalBudget ? (
            <ThemedView
              variant="card"
              className="rounded-xl px-4 py-6 items-center"
              style={{ borderColor: colors.border, borderWidth: 1 }}
            >
              <Ionicons name="wallet-outline" size={32} color={colors.accent.pink} />
              <ThemedText className="text-base font-semibold mt-2 text-center">Set your budget</ThemedText>
              <ThemedText variant="secondary" className="text-xs mt-2 text-center">Track spending and stay within budget</ThemedText>
              <ThemedButton
                title="Edit Details"
                size="sm"
                onPress={() => setShowBudget(true)}
                className="mt-3"
              />
            </ThemedView>
          ) : (
            <ThemedView variant="card" className="rounded-xl px-4 py-4" style={{ borderColor: colors.border, borderWidth: 1 }}>
              <View className="flex-row justify-between">
                <InfoCell label="Total" value={mergedWedding?.totalBudget ? `${mergedWedding.budgetCurrency ?? 'EUR'} ${mergedWedding.totalBudget.toLocaleString()}` : '—'} />
                <InfoCell label="Spent" value={mergedWedding?.spentBudget ? `${mergedWedding.budgetCurrency ?? 'EUR'} ${mergedWedding.spentBudget.toLocaleString()}` : '—'} />
                <InfoCell
                  label="Remaining"
                  value={remainingBudget != null ? `${mergedWedding?.budgetCurrency ?? 'EUR'} ${Math.abs(remainingBudget).toLocaleString()}` : '—'}
                  highlight
                  negative={remainingBudget !== null && remainingBudget < 0}
                />
              </View>
            </ThemedView>
          )}
        </ThemedView>

        {/* Booked Venue */}
        {mergedWedding?.bookedVenueName && (
          <ThemedView variant="background" className="px-6 pt-6">
            <ThemedText className="text-lg font-semibold mb-3">Booked Venue</ThemedText>
            <ThemedView variant="card" className="rounded-xl px-4 py-4 flex-row items-center" style={{ borderColor: '#10B981', borderWidth: 1 }}>
              <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              <ThemedText className="ml-3 font-semibold">{mergedWedding.bookedVenueName}</ThemedText>
            </ThemedView>
          </ThemedView>
        )}

        {/* Checklist */}
        <ThemedView variant="background" className="px-6 pt-6">
          <TouchableOpacity
            onPress={() => router.push('/checklist')}
            activeOpacity={0.8}
          >
            <ThemedView variant="card" className="rounded-xl px-4 py-4 flex-row items-center justify-between" style={{ borderColor: colors.border, borderWidth: 1 }}>
              <View className="flex-row items-center">
                <Ionicons name="checkmark-done-circle-outline" size={24} color={colors.accent.pink} />
                <View className="ml-3">
                  <ThemedText className="font-semibold">My To-Do Checklist</ThemedText>
                  <ThemedText variant="secondary" className="text-xs mt-0.5">Track tasks like finding vendors</ThemedText>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.text.secondary} />
            </ThemedView>
          </TouchableOpacity>
        </ThemedView>

        {/* Recently Liked Vendors */}
        <ThemedView variant="background" className="px-6 pt-6">
          <View className="flex-row items-center justify-between mb-3">
            <ThemedText className="text-lg font-semibold">Recently Liked</ThemedText>
            <TouchableOpacity onPress={() => router.push('/(tabs)/saved')}>
              <ThemedText variant="accentPink">View all</ThemedText>
            </TouchableOpacity>
          </View>
          {recentVendors.length === 0 ? (
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
              data={recentVendors}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 12 }}
              renderItem={({ item }) => (
                <View className="mr-4" style={{ width: 280 }}>
                  <VendorCard
                    vendor={item}
                    isFavorite={true}
                    onDetailsPress={handleVendorPress}
                    onFavoritePress={() => undefined}
                    onContactPress={(id, name) => setContactVendor({ id, name })}
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
                {formatWeddingStyle(wedding?.style)}
              </ThemedText>
            </View>
            <View className="flex-row items-center justify-between mt-3">
              <ThemedText variant="secondary">Guest count</ThemedText>
              <ThemedText className="font-semibold">
                {wedding?.guestCountRange
                  ? `${wedding.guestCountRange.min}-${wedding.guestCountRange.max}`
                  : 'Not set'}
              </ThemedText>
            </View>
            <View className="flex-row items-center justify-between mt-3">
              <ThemedText variant="secondary">Budget preference</ThemedText>
              <ThemedText className="font-semibold">
                {wedding?.budgetRange
                  ? `${wedding.budgetRange.currency} ${wedding.budgetRange.min?.toLocaleString() || '0'}-${wedding.budgetRange.max?.toLocaleString() || '0'}`
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
            <TouchableOpacity onPress={() => router.push('/edit-wedding')} className="flex-row items-center justify-between px-4 py-4">
              <View className="flex-row items-center">
                <Ionicons name="create-outline" size={18} color={colors.text.secondary} />
                <ThemedText className="ml-3">Edit Wedding Details</ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.text.secondary} />
            </TouchableOpacity>
            <View className="h-px" style={{ backgroundColor: colors.border }} />
            <TouchableOpacity onPress={() => router.push('/manage-partner')} className="flex-row items-center justify-between px-4 py-4">
              <View className="flex-row items-center">
                <Ionicons name="people-outline" size={18} color={colors.text.secondary} />
                <ThemedText className="ml-3">Manage partner</ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.text.secondary} />
            </TouchableOpacity>
            <View className="h-px" style={{ backgroundColor: colors.border }} />
            <TouchableOpacity onPress={handleLogout} className="flex-row items-center justify-between px-4 py-4">
              <View className="flex-row items-center">
                <Ionicons name="log-out-outline" size={18} color="#EF4444" />
                <ThemedText className="ml-3" style={{ color: '#EF4444' }}>Logout</ThemedText>
              </View>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </ScrollView>

      <ContactModal
        visible={!!contactVendor}
        vendorId={contactVendor?.id ?? ''}
        vendorName={contactVendor?.name ?? ''}
        onClose={() => setContactVendor(null)}
      />
      <GuestsModal
        visible={showGuests}
        wedding={mergedWedding as Wedding | null}
        onClose={() => setShowGuests(false)}
        onSaved={(data) => setWeddingData((prev) => ({ ...prev, ...data }))}
      />
      <BudgetModal
        visible={showBudget}
        wedding={mergedWedding as Wedding | null}
        onClose={() => setShowBudget(false)}
        onSaved={(data) => setWeddingData((prev) => ({ ...prev, ...data }))}
      />
    </SafeAreaView>
  );
}
