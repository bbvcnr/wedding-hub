import React from 'react';
import { TouchableOpacity, Image, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView, ThemedText } from '@/src/components/theme/themed-view';
import { ThemedButton } from '@/src/components/theme/themed-button';
import { VendorItem } from '@/src/types/vendor';
import { useTheme } from '@/src/components/theme/theme-provider';

interface VendorCardProps {
  vendor: VendorItem;
  isFavorite?: boolean;
  onFavoritePress?: (vendorId: string) => void;
  onDetailsPress?: (vendorId: string) => void;
  onContactPress?: (vendorId: string, vendorName: string) => void;
}

export function VendorCard({
  vendor,
  isFavorite = false,
  onFavoritePress,
  onDetailsPress,
  onContactPress,
}: VendorCardProps) {
  const { isDark, colors } = useTheme();

  const handleFavoritePress = () => {
    onFavoritePress?.(vendor.id);
  };

  const renderStars = (rating?: number) => {
    const stars = [];
    const ratingValue = rating || 0;
    const fullStars = Math.floor(ratingValue);
    const hasHalfStar = ratingValue % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Ionicons
            key={i}
            name="star"
            size={16}
            color="#FFD700"
            style={{ marginRight: 2 }}
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Ionicons
            key={i}
            name="star-half"
            size={16}
            color="#FFD700"
            style={{ marginRight: 2 }}
          />
        );
      } else {
        stars.push(
          <Ionicons
            key={i}
            name="star-outline"
            size={16}
            color={isDark ? '#9CA3AF' : '#6B7280'}
            style={{ marginRight: 2 }}
          />
        );
      }
    }
    return stars;
  };

  return (
    <ThemedView variant="card" style={styles.card}>
      {/* Image */}
      <View style={styles.imageContainer}>
        {vendor.imageUrl ? (
          <Image source={{ uri: vendor.imageUrl }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.image, { backgroundColor: isDark ? '#2A2A2A' : colors.surface }]} />
        )}

        {/* Category pill */}
        {vendor.category && (
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>{vendor.category}</Text>
          </View>
        )}

        {/* Favorite button */}
        <TouchableOpacity onPress={handleFavoritePress} style={styles.favoriteButton} activeOpacity={0.8}>
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={18}
            color={isFavorite ? '#EC4899' : '#fff'}
          />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Name + rating row */}
        <View style={styles.nameRow}>
          <ThemedText style={styles.name} numberOfLines={1}>{vendor.name}</ThemedText>
          {vendor.rating != null && (
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={11} color="#FFD700" />
              <Text style={styles.ratingText}>{vendor.rating.toFixed(1)}</Text>
            </View>
          )}
        </View>

        {/* Meta row */}
        <View style={styles.metaRow}>
          {vendor.capacity != null && (
            <View style={styles.metaChip}>
              <Ionicons name="people-outline" size={12} color={colors.text.secondary} />
              <ThemedText variant="secondary" style={styles.metaLabel}>{vendor.capacity}</ThemedText>
            </View>
          )}
          {vendor.tags && vendor.tags.length > 0 && (
            <View style={styles.metaChip}>
              <Ionicons name="location-outline" size={12} color={colors.text.secondary} />
              <ThemedText variant="secondary" style={styles.metaLabel}>{vendor.tags[0]}</ThemedText>
            </View>
          )}
        </View>

        {/* Description */}
        <ThemedText variant="secondary" style={styles.description} numberOfLines={2}>
          {vendor.shortDescription || ''}
        </ThemedText>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => onDetailsPress?.(vendor.id)}
            activeOpacity={0.75}
            style={[styles.btn, { backgroundColor: colors.surface }]}
          >
            <ThemedText style={[styles.btnLabel, { color: colors.text.secondary }]}>Details</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onContactPress?.(vendor.id, vendor.name)}
            activeOpacity={0.85}
            style={[styles.btn, { backgroundColor: colors.accent.pink }]}
          >
            <Text style={[styles.btnLabel, { color: '#fff' }]}>Contact</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: { position: 'relative', width: '100%' },
  image: { width: '100%', height: 180 },
  categoryPill: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.52)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  categoryText: { color: '#fff', fontSize: 11, fontWeight: '600', letterSpacing: 0.3 },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 20,
    padding: 7,
  },
  content: { padding: 14, paddingTop: 12 },
  nameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  name: { fontSize: 16, fontWeight: '800', letterSpacing: -0.3, flex: 1, marginRight: 8 },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFF8E1',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  ratingText: { fontSize: 11, fontWeight: '700', color: '#92620A' },
  metaRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaLabel: { fontSize: 12 },
  description: { fontSize: 13, lineHeight: 18, marginBottom: 14 },
  actions: { flexDirection: 'row', gap: 8 },
  btn: { flex: 1, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  btnLabel: { fontSize: 13, fontWeight: '700' },
});
