import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
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
    <ThemedView variant="surface" className="rounded-xl overflow-hidden mb-4 shadow-sm">
      {/* Image with Favorite Icon */}
      <ThemedView variant="surface" style={styles.imageContainer}>
        {vendor.imageUrl ? (
          <Image
            source={{ uri: vendor.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <ThemedView
            variant="surface"
            style={[styles.image, { backgroundColor: isDark ? '#2A2A2A' : '#E5E7EB' }]}
          />
        )}
        <TouchableOpacity
          onPress={handleFavoritePress}
          style={styles.favoriteButton}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={20}
            color={isFavorite ? '#EC4899' : '#1F2937'}
          />
        </TouchableOpacity>
      </ThemedView>

      {/* Content */}
      <ThemedView variant="card" style={styles.content}>
        {/* Title */}
        <ThemedText className="text-xl font-bold mb-2">
          {vendor.name}
        </ThemedText>

        {/* Rating */}
        <ThemedView variant="card" style={styles.ratingContainer}>
          <ThemedView variant="card" style={styles.starsContainer}>
            {renderStars(vendor.rating)}
          </ThemedView>
          <ThemedText variant="secondary" className="text-sm">
            {vendor.rating?.toFixed(1) || '0.0'}
          </ThemedText>
        </ThemedView>

        {/* Capacity/Tags */}
        <ThemedView variant="card" style={styles.tagsContainer}>
          {vendor.capacity && (
            <ThemedView variant="card" style={styles.tagItem}>
              <Ionicons
                name="people"
                size={16}
                color={isDark ? '#9CA3AF' : '#6B7280'}
                style={{ marginRight: 4 }}
              />
              <ThemedText variant="secondary" className="text-sm">
                Up to {vendor.capacity} guests
              </ThemedText>
            </ThemedView>
          )}
          {vendor.tags && vendor.tags.length > 0 && (
            <ThemedView variant="card" style={styles.tagItem}>
              <Ionicons
                name="location"
                size={16}
                color={isDark ? '#9CA3AF' : '#6B7280'}
                style={{ marginRight: 4 }}
              />
              <ThemedText variant="secondary" className="text-sm">
                {vendor.tags[0]}
              </ThemedText>
            </ThemedView>
          )}
        </ThemedView>

        {/* Description */}
        <ThemedText
          variant="secondary"
          className="text-sm mb-4"
          numberOfLines={2}
        >
          {vendor.shortDescription || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...'}
        </ThemedText>

        {/* Action Buttons */}
        <ThemedView variant="card" style={styles.buttonsContainer}>
          <ThemedView variant="card" style={styles.buttonWrapper}>
            <ThemedButton
              title="View Details"
              variant="outline"
              size="sm"
              onPress={() => onDetailsPress?.(vendor.id)}
            />
          </ThemedView>
          <ThemedView variant="card" style={styles.buttonWrapper}>
            <ThemedButton
              title="Contact"
              variant="primary"
              size="sm"
              onPress={() => onContactPress?.(vendor.id, vendor.name)}
            />
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
    width: '100%',
  },
  image: {
    width: '100%',
    height: 192,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 8,
  },
  content: {
    padding: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  buttonWrapper: {
    flex: 1,
  },
});
