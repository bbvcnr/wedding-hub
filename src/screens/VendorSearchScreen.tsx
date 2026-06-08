import React, { useState, useEffect, useCallback } from 'react';
import {
  TextInput, TouchableOpacity, KeyboardAvoidingView, Platform,
  Modal, View, ScrollView, StyleSheet, Text,
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
  { label: 'All', value: undefined, icon: 'apps-outline' as const },
  { label: 'Venues', value: 'venue', icon: 'business-outline' as const },
  { label: 'Photography', value: 'photography', icon: 'camera-outline' as const },
  { label: 'Catering', value: 'catering', icon: 'restaurant-outline' as const },
  { label: 'Entertainment', value: 'entertainment', icon: 'musical-notes-outline' as const },
  { label: 'Beauty', value: 'beauty', icon: 'sparkles-outline' as const },
  { label: 'Florist', value: 'florist', icon: 'flower-outline' as const },
  { label: 'Planning', value: 'planning', icon: 'clipboard-outline' as const },
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

  const [nameInput, setNameInput] = useState('');
  const [cityInput, setCityInput] = useState('');
  const [showSort, setShowSort] = useState(false);
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
    setSearchParams({ text: nameInput, city: cityInput, category: selectedCategory, filters: {} });
  };

  const handleCategorySelect = (value: string | undefined) => {
    setSelectedCategory(value);
    setSearchParams((prev) => ({ ...prev, category: value }));
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

  const isSortActive = sortBy !== 'rating_desc';

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.root, { backgroundColor: colors.accent.pink }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Explore Vendors</Text>
          <Text style={styles.heroSub}>Find your perfect wedding team</Text>

          {/* Search inputs */}
          <View style={styles.searchRow}>
            <View style={[styles.inputWrap, { backgroundColor: isDark ? colors.surface : '#fff', flex: 1 }]}>
              <Ionicons name="search-outline" size={16} color={colors.text.secondary} style={{ marginRight: 6 }} />
              <TextInput
                placeholder="Venue name, photographer..."
                placeholderTextColor={colors.text.secondary}
                value={nameInput}
                onChangeText={setNameInput}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
                style={[styles.input, { color: colors.text.primary }]}
              />
              {nameInput.length > 0 && (
                <TouchableOpacity onPress={() => setNameInput('')} hitSlop={8}>
                  <Ionicons name="close-circle" size={16} color={colors.text.secondary} />
                </TouchableOpacity>
              )}
            </View>

            <View style={[styles.inputWrap, { backgroundColor: isDark ? colors.surface : '#fff', width: 100 }]}>
              <Ionicons name="location-outline" size={15} color={colors.text.secondary} style={{ marginRight: 4 }} />
              <TextInput
                placeholder="City"
                placeholderTextColor={colors.text.secondary}
                value={cityInput}
                onChangeText={setCityInput}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
                style={[styles.input, { color: colors.text.primary }]}
              />
            </View>

            <TouchableOpacity onPress={handleSearch} activeOpacity={0.85} style={styles.searchBtn}>
              <Ionicons name="search" size={18} color="#EC4899" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Category pills */}
        <ThemedView variant="background" style={styles.categoryBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.value;
              return (
                <TouchableOpacity
                  key={String(cat.value)}
                  onPress={() => handleCategorySelect(cat.value as string | undefined)}
                  activeOpacity={0.75}
                  style={[
                    styles.categoryChip,
                    active
                      ? { backgroundColor: colors.accent.pink }
                      : { backgroundColor: colors.surface },
                  ]}
                >
                  <Ionicons
                    name={cat.icon}
                    size={14}
                    color={active ? '#fff' : colors.text.secondary}
                    style={{ marginRight: 5 }}
                  />
                  <Text style={[styles.categoryLabel, { color: active ? '#fff' : colors.text.secondary }]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </ThemedView>

        {/* Toolbar */}
        <ThemedView variant="background" style={styles.toolbar}>
          <TouchableOpacity
            onPress={() => setShowSort(true)}
            activeOpacity={0.75}
            style={[styles.toolChip, { backgroundColor: isSortActive ? colors.accent.pink + '18' : colors.surface }]}
          >
            <Ionicons name="swap-vertical" size={15} color={isSortActive ? colors.accent.pink : colors.text.secondary} />
            <Text style={[styles.toolLabel, { color: isSortActive ? colors.accent.pink : colors.text.secondary }]}>
              {isSortActive ? SORT_OPTIONS.find((o) => o.value === sortBy)?.label.split(':')[0] : 'Sort'}
            </Text>
            {isSortActive && (
              <View style={[styles.activeDot, { backgroundColor: colors.accent.pink }]} />
            )}
          </TouchableOpacity>
        </ThemedView>

        {/* Vendor list */}
        <ThemedView variant="background" style={{ flex: 1 }}>
          <VendorList
            searchParams={searchParams}
            sortBy={sortBy}
            onVendorPress={(id) => router.push(`/vendor/${id}`)}
            onFavoritePress={handleFavoritePress}
            onContactPress={(id, name) => setContactVendor({ id, name })}
            getFavoriteState={(id) => favoritesMap.has(id)}
          />
        </ThemedView>
      </KeyboardAvoidingView>

      {/* Sort Modal */}
      <Modal visible={showSort} transparent animationType="slide" onRequestClose={() => setShowSort(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setShowSort(false)} />
        <View style={[styles.sheet, { backgroundColor: isDark ? '#1C1C1E' : '#fff' }]}>
          <View style={styles.handle} />
          <ThemedText style={{ fontSize: 18, fontWeight: '700', marginBottom: 16 }}>Sort by</ThemedText>
          {SORT_OPTIONS.map((opt) => {
            const active = sortBy === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                onPress={() => { setSortBy(opt.value); setShowSort(false); }}
                style={[styles.optionRow, { borderBottomColor: colors.border }]}
              >
                <ThemedText style={[styles.optionLabel, active && { color: colors.accent.pink, fontWeight: '700' }]}>
                  {opt.label}
                </ThemedText>
                {active && <Ionicons name="checkmark-circle" size={20} color={colors.accent.pink} />}
              </TouchableOpacity>
            );
          })}
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
  root: { flex: 1 },
  hero: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  heroTitle: { color: '#fff', fontSize: 30, fontWeight: '800', letterSpacing: -0.5 },
  heroSub: { color: 'rgba(255,255,255,0.72)', fontSize: 14, marginTop: 2, marginBottom: 16 },
  searchRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  input: { flex: 1, fontSize: 14 },
  searchBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  categoryBar: { paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'transparent' },
  categoryScroll: { paddingHorizontal: 16, gap: 8 },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  categoryLabel: { fontSize: 13, fontWeight: '600' },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  toolChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  toolLabel: { fontSize: 13, fontWeight: '600' },
  activeDot: { width: 6, height: 6, borderRadius: 3, marginLeft: 2 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 44 },
  handle: { width: 40, height: 4, backgroundColor: '#D1D5DB', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionLabel: { fontSize: 15 },
});
