import React, { useMemo, useState } from 'react';
import { ScrollView, View, TouchableOpacity, FlatList, Text } from 'react-native';
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
    <TouchableOpacity onPress={onPress} activeOpacity={onPress ? 0.7 : 1} style={{ flex: 1 }}>
      <ThemedView
        variant="card"
        style={{ borderRadius: 16, paddingVertical: 18, paddingHorizontal: 12, alignItems: 'center' }}
      >
        <View
          style={{ width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', marginBottom: 10, backgroundColor: accentColor + '18' }}
        >
          <Ionicons name={icon} size={20} color={accentColor} />
        </View>
        <ThemedText style={{ fontSize: 30, fontWeight: '800', color: accentColor }}>
          {value}
        </ThemedText>
        <ThemedText variant="secondary" style={{ fontSize: 11, marginTop: 3, textAlign: 'center' }}>
          {label}
        </ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );
}


export function ProfileScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tabBarOffset = 54;
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
        <ThemedView variant="background" style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16, alignItems: 'center' }}>
          <ThemedText style={{ fontSize: 38, fontWeight: '800', textAlign: 'center', letterSpacing: -0.5 }}>
            {loading ? '...' : (wedding?.coupleName ?? 'My Wedding')}
          </ThemedText>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
            <Ionicons name="calendar-outline" size={14} color={colors.text.secondary} />
            <ThemedText variant="secondary" style={{ marginLeft: 6, fontSize: 14 }}>
              {weddingDateLabel || 'Wedding date not set'}
            </ThemedText>
          </View>
          {daysUntilWedding !== null && (
            <View style={{ marginTop: 10, paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20, backgroundColor: colors.accent.pink + '18' }}>
              <ThemedText style={{ color: colors.accent.pink, fontWeight: '700', fontSize: 13 }}>
                {daysUntilWedding} days to go
              </ThemedText>
            </View>
          )}
        </ThemedView>

        {/* Planning Stats */}
        <ThemedView variant="background" className="px-6 pt-2">
          <ThemedText style={{ fontSize: 20, fontWeight: '700', marginBottom: 12 }}>Your Progress</ThemedText>
          {favorites.length === 0 ? (
            <ThemedView
              variant="card"
              className="rounded-xl px-6 py-8 items-center"
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

        {/* Guests & Seating + Budget — side-by-side tip-style blocks */}
        <ThemedView variant="background" style={{ paddingHorizontal: 24, paddingTop: 24 }}>
          <View style={{ flexDirection: 'row', gap: 12 }}>

            {/* Guests & Seating */}
            <TouchableOpacity
              onPress={() => setShowGuests(true)}
              activeOpacity={0.82}
              style={{ flex: 1, borderRadius: 18, backgroundColor: colors.accent.blue, padding: 18, minHeight: 140 }}
            >
              <View style={{ width: 28, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.45)', marginBottom: 12 }} />
              <Ionicons name="people-outline" size={22} color="rgba(255,255,255,0.7)" />
              <Text style={{ color: '#fff', fontSize: 15, fontWeight: '800', marginTop: 10, lineHeight: 21 }}>
                Guests & Seating
              </Text>
              {mergedWedding?.totalGuests ? (
                <>
                  <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 26, fontWeight: '800', marginTop: 6 }}>
                    {mergedWedding.totalGuests}
                  </Text>
                  <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11, marginTop: 2 }}>
                    {mergedWedding.numberOfTables ? `${mergedWedding.numberOfTables} tables` : 'guests'}
                  </Text>
                </>
              ) : (
                <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, marginTop: 6, lineHeight: 17 }}>
                  Tap to add guest details
                </Text>
              )}
            </TouchableOpacity>

            {/* Budget */}
            <TouchableOpacity
              onPress={() => setShowBudget(true)}
              activeOpacity={0.82}
              style={{ flex: 1, borderRadius: 18, backgroundColor: colors.accent.green, padding: 18, minHeight: 140 }}
            >
              <View style={{ width: 28, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.45)', marginBottom: 12 }} />
              <Ionicons name="wallet-outline" size={22} color="rgba(255,255,255,0.7)" />
              <Text style={{ color: '#fff', fontSize: 15, fontWeight: '800', marginTop: 10, lineHeight: 21 }}>
                Budget
              </Text>
              {mergedWedding?.totalBudget ? (
                <>
                  <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 20, fontWeight: '800', marginTop: 6 }} numberOfLines={1}>
                    {mergedWedding.budgetCurrency ?? 'EUR'} {mergedWedding.totalBudget.toLocaleString()}
                  </Text>
                  <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11, marginTop: 2 }}>
                    {remainingBudget != null
                      ? `${remainingBudget >= 0 ? '' : '-'}${mergedWedding.budgetCurrency ?? 'EUR'} ${Math.abs(remainingBudget).toLocaleString()} ${remainingBudget >= 0 ? 'remaining' : 'over'}`
                      : 'total budget'}
                  </Text>
                </>
              ) : (
                <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, marginTop: 6, lineHeight: 17 }}>
                  Tap to set your budget
                </Text>
              )}
            </TouchableOpacity>

          </View>
        </ThemedView>

        {/* Booked Venue */}
        {mergedWedding?.bookedVenueName && (
          <ThemedView variant="background" className="px-6 pt-6">
            <ThemedText style={{ fontSize: 20, fontWeight: '700', marginBottom: 12 }}>Booked Venue</ThemedText>
            <ThemedView variant="card" className="rounded-xl px-4 py-4 flex-row items-center">
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
            <ThemedView variant="card" className="rounded-xl px-4 py-4 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="checkmark-done-circle-outline" size={24} color={colors.accent.green} />
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
            <ThemedText style={{ fontSize: 20, fontWeight: '700' }}>Recently Liked</ThemedText>
            <TouchableOpacity onPress={() => router.push('/(tabs)/saved')}>
              <ThemedText style={{ color: colors.accent.blue, fontWeight: '600', fontSize: 14 }}>View all</ThemedText>
            </TouchableOpacity>
          </View>
          {recentVendors.length === 0 ? (
            <ThemedView
              variant="card"
              className="rounded-xl px-4 py-6 items-center"
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
          <ThemedText style={{ fontSize: 20, fontWeight: '700', marginBottom: 12 }}>Wedding Preferences</ThemedText>
          <ThemedView
            variant="card"
            className="rounded-xl px-4 py-4"
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

        {/* Settings shortcut */}
        <ThemedView variant="background" className="px-6 pt-6">
          <ThemedView variant="card" className="rounded-xl">
            <TouchableOpacity onPress={() => router.push('/settings')} className="flex-row items-center justify-between px-4 py-4">
              <View className="flex-row items-center">
                <Ionicons name="settings-outline" size={18} color={colors.text.secondary} />
                <ThemedText className="ml-3">Settings</ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.text.secondary} />
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
