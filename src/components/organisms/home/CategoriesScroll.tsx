import React from 'react';
import { FlatList, TouchableOpacity, View, Image, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/components/theme/theme-provider';
import { HomeCategory } from '@/src/types/home';

const ACCENT_SEQUENCE = ['pink', 'blue', 'green', 'pink', 'blue'] as const;

interface CategoriesScrollProps {
  categories: HomeCategory[];
  onPressCategory?: (categoryId: string) => void;
}

export function CategoriesScroll({ categories, onPressCategory }: CategoriesScrollProps) {
  const { colors, isDark } = useTheme();

  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginHorizontal: -24 }}
      contentContainerStyle={{ paddingLeft: 24, paddingRight: 16, gap: 12 }}
      renderItem={({ item, index }) => {
        const accentKey = ACCENT_SEQUENCE[index % ACCENT_SEQUENCE.length];
        const accentColor = colors.accent[accentKey];

        return (
          <TouchableOpacity
            onPress={() => onPressCategory?.(item.id)}
            activeOpacity={0.86}
            style={[styles.shadow, { backgroundColor: isDark ? colors.card : '#fff' }]}
          >
            {/* overflow:hidden layer — separate from shadow so iOS doesn't clip */}
            <View style={styles.card}>
              {/* Background */}
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={StyleSheet.absoluteFill} resizeMode="cover" />
              ) : (
                <View style={[StyleSheet.absoluteFill, { backgroundColor: accentColor }]} />
              )}

              {/* Subtle tint over whole card */}
              <View style={styles.overlayTint} />

              {/* Strong gradient at bottom */}
              <View style={styles.overlayMid} />
              <View style={styles.overlayBottom} />

              {/* Icon circle */}
              <View style={[styles.iconCircle, { backgroundColor: accentColor }]}>
                <Ionicons name={item.icon as any} size={20} color="#fff" />
              </View>

              {/* Label */}
              <View style={styles.labelWrap}>
                <Text style={styles.label} numberOfLines={1}>{item.label}</Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  shadow: {
    width: 130,
    height: 175,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 6,
  },
  card: {
    width: 130,
    height: 175,
    borderRadius: 20,
    overflow: 'hidden',
  },
  overlayTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  overlayMid: {
    position: 'absolute',
    bottom: 55,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: 'rgba(0,0,0,0.22)',
  },
  overlayBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 72,
    backgroundColor: 'rgba(0,0,0,0.58)',
  },
  iconCircle: {
    position: 'absolute',
    top: 14,
    left: 14,
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  labelWrap: {
    position: 'absolute',
    bottom: 14,
    left: 12,
    right: 12,
  },
  label: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
});
