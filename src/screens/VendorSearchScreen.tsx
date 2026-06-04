import React, { useState, useEffect, useCallback } from 'react';
import {
  TextInput, TouchableOpacity, KeyboardAvoidingView, Platform,
  Modal, View, ScrollView, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView, ThemedText } from '@/src/components/theme/themed-view';
import { ThemedButton } from '@/src/components/theme/themed-button';
import { VendorList, SortBy } from '@/src/components/organisms/VendorList';
import { ContactModal } from '@/src/components/molecules/ContactModal';
import { SearchVendorRequest } from '@/src/types/vendor';
import { useTheme } from '@/src/components/theme/theme-provider';
import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'expo-router';
import { getFavorites, addFavorite, removeFavorite } from '@/src/services/weddingService';

const CATEGORIES = [
  { label: 'All', value: undefined },
  { label: 'Venues', value: 'venue' },
  { label: 'Photography', value: 'photography' },
  { label: 'Catering', value: 'catering' },
  { label: 'Entertainment', value: 'entertainment' },
  { label: 'Beauty', value: 'beauty' },
  { label: 'Florist', value: 'florist' },
  { label: 'Planning', value: 'planning' },
] as const;

const SORT_OPTIONS: { label: string; value: SortBy }[] = [
  { label: 'Rating: High to Low', value: 'rating_desc' },
  { label: 'Rating: Low to High', value: 'rating_asc' },
  { label: 'Name: A–Z', value: 'name_asc' },
  { label: 'Name: Z–A', value: 'name_desc' },
];

export function VendorSearchScreen() {
  const { isDark, colors } = useTheme();
  const router = useRouter();
  const { weddingId } = useAuth();

  const [locationsInput, setLocationsInput] = useState('');
  const [cityInput, setCityInput] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>('rating_desc');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [searchParams, setSearchParams] = useState<Omit<SearchVendorRequest, 'pageRequest'>>({
    text: '', city: '', category: undefined, filters: {},
  });

  const [favoritesMap, setFavoritesMap] = useState<Map<string, string>>(new Map());
  const [contactVendor, setContactVendor] = useState<{ id: string; name: string } | null>(null);

  const loadFavorites = useCallback(async () => {
    if (!weddingId) return;
    const likes = await getFavorites(weddingId).catch(() => []);
    setFavoritesMap(new Map(likes.map((l) => [l.vendorId, l.id])));
  }, [weddingId]);

  useEffect(() => { loadFavorites(); }, [loadFavorites]);

  const handleSearch = () => {
    setSearchParams({ text: locationsInput, city: cityInput, category: selectedCategory, filters: {} });
  };

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

  const appliedSortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? 'Sort';
  const appliedCategoryLabel = CATEGORIES.find((c) => c.value === selectedCategory)?.label;
  const hasActiveFilter = !!selectedCategory;

  const chipStyle = (active: boolean) => ({
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginRight: 8,
    borderColor: active ? '#EC4899' : (isDark ? '#3A3A3C' : '#E5E7EB'),
    backgroundColor: active ? '#EC4899' : 'transparent',
  });

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1" style={{ backgroundColor: colors.background }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ThemedView variant="background" className="flex-1">

          {/* Search Bar */}
          <ThemedView variant="background" className="py-1 px-4">
            <ThemedView variant="background" className="flex-row gap-2 mb-2">
              <TextInput
                placeholder="Vendor name..."
                placeholderTextColor={colors.text.secondary}
                value={locationsInput}
                onChangeText={setLocationsInput}
                style={{ flex: 1, backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: colors.text.primary }}
              />
              <TextInput
                placeholder="City"
                placeholderTextColor={colors.text.secondary}
                value={cityInput}
                onChangeText={setCityInput}
                style={{ width: 100, backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: colors.text.primary }}
              />
              <ThemedButton title="Search" variant="primary" size="md" onPress={handleSearch} />
            </ThemedView>
          </ThemedView>

          {/* Sort / Filter / Map bar */}
          <ThemedView variant="background" className="flex-row items-center justify-between px-4 py-2">
            <ThemedView variant="background" className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => setShowSort(true)}
                className="flex-row items-center px-3 py-2 rounded-full"
                style={{ backgroundColor: colors.surface, borderWidth: sortBy !== 'rating_desc' ? 1.5 : 0, borderColor: '#EC4899' }}
              >
                <Ionicons name="swap-vertical" size={16} color={sortBy !== 'rating_desc' ? '#EC4899' : colors.text.secondary} />
                <ThemedText variant="secondary" className="ml-1 text-sm" style={sortBy !== 'rating_desc' ? { color: '#EC4899' } : {}}>Sort</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowFilter(true)}
                className="flex-row items-center px-3 py-2 rounded-full"
                style={{ backgroundColor: colors.surface, borderWidth: hasActiveFilter ? 1.5 : 0, borderColor: '#EC4899' }}
              >
                <Ionicons name="filter" size={16} color={hasActiveFilter ? '#EC4899' : colors.text.secondary} />
                <ThemedText variant="secondary" className="ml-1 text-sm" style={hasActiveFilter ? { color: '#EC4899' } : {}}>
                  {hasActiveFilter ? appliedCategoryLabel : 'Filter'}
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>

            <TouchableOpacity
              onPress={() => setShowMap(!showMap)}
              className="flex-row items-center px-3 py-2 rounded-full"
              style={{ backgroundColor: colors.surface }}
            >
              <Ionicons name={showMap ? 'map' : 'map-outline'} size={16} color={showMap ? '#EC4899' : colors.text.secondary} />
              <ThemedText variant="secondary" className="ml-1 text-sm" style={{ color: showMap ? '#EC4899' : colors.text.secondary }}>Map</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          {/* Content */}
          {showMap ? (
            <ThemedView variant="background" className="flex-1 items-center justify-center px-8">
              <Ionicons name="map-outline" size={48} color={colors.text.muted} />
              <ThemedText className="text-lg font-semibold mt-4 text-center">Map view coming soon</ThemedText>
              <ThemedText variant="secondary" className="text-sm mt-2 text-center">
                Vendor locations on a map will be available in a future update.
              </ThemedText>
            </ThemedView>
          ) : (
            <VendorList
              searchParams={searchParams}
              sortBy={sortBy}
              onVendorPress={(id) => router.push(`/vendor/${id}`)}
              onFavoritePress={handleFavoritePress}
              onContactPress={(id, name) => setContactVendor({ id, name })}
              getFavoriteState={(id) => favoritesMap.has(id)}
            />
          )}
        </ThemedView>
      </KeyboardAvoidingView>

      {/* Sort Modal */}
      <Modal visible={showSort} transparent animationType="slide" onRequestClose={() => setShowSort(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setShowSort(false)} />
        <View style={[styles.sheet, { backgroundColor: isDark ? '#1C1C1E' : '#fff' }]}>
          <View style={styles.handle} />
          <ThemedText className="text-lg font-bold mb-4">Sort by</ThemedText>
          {SORT_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              onPress={() => { setSortBy(opt.value); setShowSort(false); }}
              style={[styles.optionRow, { borderColor: colors.border }]}
            >
              <ThemedText className="text-base">{opt.label}</ThemedText>
              {sortBy === opt.value && <Ionicons name="checkmark" size={20} color="#EC4899" />}
            </TouchableOpacity>
          ))}
        </View>
      </Modal>

      {/* Filter Modal */}
      <Modal visible={showFilter} transparent animationType="slide" onRequestClose={() => setShowFilter(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setShowFilter(false)} />
        <View style={[styles.sheet, { backgroundColor: isDark ? '#1C1C1E' : '#fff' }]}>
          <View style={styles.handle} />
          <ThemedText className="text-lg font-bold mb-4">Filter by Category</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={String(cat.value)}
                onPress={() => setSelectedCategory(cat.value as string | undefined)}
                style={chipStyle(selectedCategory === cat.value)}
              >
                <ThemedText className="text-sm font-semibold" style={{ color: selectedCategory === cat.value ? '#fff' : colors.text.secondary }}>
                  {cat.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <ThemedButton
            title="Apply Filter"
            onPress={() => {
              setSearchParams((prev) => ({ ...prev, category: selectedCategory }));
              setShowFilter(false);
            }}
            size="lg"
          />
        </View>
      </Modal>

      <ContactModal
        visible={!!contactVendor}
        vendorId={contactVendor?.id ?? ''}
        vendorName={contactVendor?.name ?? ''}
        onClose={() => setContactVendor(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  handle: { width: 40, height: 4, backgroundColor: '#D1D5DB', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  optionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth },
});
