import React, { useState, useEffect } from 'react';
import {
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView, ThemedText } from '@/src/components/theme/themed-view';
import { ThemedButton } from '@/src/components/theme/themed-button';
import { VendorList } from '@/src/components/organisms/VendorList';
import { SearchVendorRequest } from '@/src/types/vendor';
import { useTheme } from '@/src/components/theme/theme-provider';
import { useRouter } from 'expo-router';

export function VendorSearchScreen() {
  const { isDark, colors } = useTheme();
  const router = useRouter();
  const [searchParams, setSearchParams] = useState<
    Omit<SearchVendorRequest, 'pageRequest'>
  >({
    text: '',
    city: '',
    category: undefined,
    filters: {},
  });

  const [locationsInput, setLocationsInput] = useState('');
  const [cityInput, setCityInput] = useState('');
  const [showMap, setShowMap] = useState(false);

  // Load vendors on initial mount
  useEffect(() => {
    // Initial load with empty search params to show all vendors
    setSearchParams({
      text: '',
      city: '',
      category: undefined,
      filters: {},
    });
  }, []);

  const handleSearch = () => {
    setSearchParams({
      text: locationsInput,
      city: cityInput,
      category: searchParams.category,
      filters: searchParams.filters,
    });
  };

  const handleVendorPress = (vendorId: string) => {
    router.push(`/vendor/${vendorId}`);
  };

  const handleFavoritePress = (vendorId: string) => {
    // Handle favorite toggle
    console.log('Toggle favorite:', vendorId);
  };

  const handleContactPress = (vendorId: string) => {
    // Navigate to contact screen or open contact modal
    console.log('Contact vendor:', vendorId);
  };

  return (
    <SafeAreaView 
      edges={['top', 'left', 'right']}
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ThemedView variant="background" className="flex-1">
          {/* Header: Search Bar */}
          <ThemedView variant="background" className=" py-1 px-8">
            <ThemedView variant="background" className="flex-row gap-2 mb-2">
              <ThemedView variant="background" className="flex-1">
                <TextInput
                  placeholder="Locations"
                  placeholderTextColor={colors.text.secondary}
                  value={locationsInput}
                  onChangeText={setLocationsInput}
                  className="px-4 py-3 rounded-lg border bg-white"
                  style={{
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    color: colors.text.primary,
                  }}
                />
              </ThemedView>
              <ThemedView variant="background" className="flex-1">
                <TextInput
                  placeholder="City"
                  placeholderTextColor={colors.text.secondary}
                  value={cityInput}
                  onChangeText={setCityInput}
                  className="px-4 py-3 rounded-lg border bg-white"
                  style={{
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    color: colors.text.primary,
                  }}
                />
              </ThemedView>
              <ThemedButton
                title="Search"
                variant="primary"
                size="md"
                onPress={handleSearch}
                className="px-6"
              />
            </ThemedView>
          </ThemedView>

          {/* Sub-header: Sort, Filter, Map */}
          <ThemedView
            variant="background"
            className="flex-row items-center justify-between px-8 py-2"
          >
            <ThemedView variant="background" className="flex-row gap-3">
              <TouchableOpacity 
                className="flex-row items-center px-4 py-2 rounded-full"
                style={{ backgroundColor: colors.surface }}
              >
                <Ionicons
                  name="swap-vertical"
                  size={18}
                  color={colors.text.secondary}
                />
                <ThemedText variant="secondary" className="ml-2 text-sm">
                  Sort
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity 
                className="flex-row items-center px-4 py-2 rounded-full"
                style={{ backgroundColor: colors.surface }}
              >
                <Ionicons
                  name="filter"
                  size={18}
                  color={colors.text.secondary}
                />
                <ThemedText variant="secondary" className="ml-2 text-sm">
                  Filter
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>

            <TouchableOpacity
              onPress={() => setShowMap(!showMap)}
              className="flex-row items-center px-4 py-2 rounded-full"
              style={{ backgroundColor: colors.surface }}
            >
              <Ionicons
                name={showMap ? 'map' : 'map-outline'}
                size={18}
                color={showMap ? colors.accent.pink : colors.text.secondary}
              />
              <ThemedText
                variant="secondary"
                className="ml-2 text-sm"
                style={{
                  color: showMap ? colors.accent.pink : colors.text.secondary,
                }}
              >
                Map
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>

          {/* Vendor List */}
          {showMap ? (
            <ThemedView variant="background" className="flex-1 items-center justify-center">
              <ThemedText variant="secondary">
                Map view coming soon...
              </ThemedText>
            </ThemedView>
          ) : (
            <VendorList
              searchParams={searchParams}
              onVendorPress={handleVendorPress}
              onFavoritePress={handleFavoritePress}
              onContactPress={handleContactPress}
            />
          )}
        </ThemedView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
