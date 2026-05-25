import React from 'react';
import { FlatList, TouchableOpacity, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, ThemedView } from '@/src/components/theme/themed-view';
import { useTheme } from '@/src/components/theme/theme-provider';
import { HomeCategory } from '@/src/types/home';

interface CategoriesScrollProps {
  categories: HomeCategory[];
  onPressCategory?: (categoryId: string) => void;
}

export function CategoriesScroll({ categories, onPressCategory }: CategoriesScrollProps) {
  const { colors } = useTheme();

  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingRight: 12 }}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onPressCategory?.(item.id)} className="mr-3">
          <ThemedView
            variant="card"
            className="w-40 h-40 rounded-2xl overflow-hidden"
            style={{ borderColor: colors.border, borderWidth: 1 }}
          >
            <View className="h-28" style={{ backgroundColor: colors.surface }}>
              {item.imageUrl ? (
                <Image
                  source={{ uri: item.imageUrl }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="flex-1 items-center justify-center">
                  <Ionicons name={item.icon as any} size={20} color={colors.accent.pink} />
                </View>
              )}
            </View>
            <View className="flex-1 items-center justify-center px-2">
              <ThemedText className="text-sm font-semibold text-center">
                {item.label}
              </ThemedText>
            </View>
          </ThemedView>
        </TouchableOpacity>
      )}
    />
  );
}
