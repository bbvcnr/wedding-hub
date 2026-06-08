import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Tabs, usePathname, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/src/components/theme/theme-provider';
import { useAuth } from '@/src/context/AuthContext';

const CLIENT_TABS = [
  { name: '/(tabs)/', icon: 'home-outline' as const, iconFocused: 'home' as const, label: 'Home' },
  { name: '/(tabs)/search', icon: 'search-outline' as const, iconFocused: 'search' as const, label: 'Explore' },
  { name: '/(tabs)/saved', icon: 'heart-outline' as const, iconFocused: 'heart' as const, label: 'Saved' },
  { name: '/(tabs)/profile', icon: 'person-outline' as const, iconFocused: 'person' as const, label: 'Profile' },
];

function CustomTabBar() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();

  const tabs = CLIENT_TABS;

  const isActive = (tabName: string) => {
    if (tabName === '/(tabs)/') return pathname === '/' || pathname === '/index';
    return pathname.startsWith(tabName.replace('/(tabs)', ''));
  };

  return (
    <View style={[styles.wrapper, { bottom: insets.bottom + 12 }]}>
      <BlurView
        tint={isDark ? 'dark' : 'light'}
        intensity={60}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: isDark ? 'rgba(18,18,20,0.85)' : 'rgba(255,255,255,0.85)' },
        ]}
      />
      {tabs.map((tab) => {
        const focused = isActive(tab.name);
        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => router.push(tab.name as any)}
            activeOpacity={0.75}
            style={styles.tabItem}
          >
            {focused ? (
              <View style={[styles.pill, { backgroundColor: colors.accent.pink }]}>
                <Ionicons name={tab.iconFocused} size={18} color="#fff" />
                <Text style={styles.pillLabel}>{tab.label}</Text>
              </View>
            ) : (
              <Ionicons
                name={tab.icon}
                size={20}
                color={isDark ? '#6B7280' : '#9CA3AF'}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function Layout() {
  return (
    <>
      <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }} />
      <CustomTabBar />
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 50,
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 12,
  },
  tabItem: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 999,
    gap: 6,
  },
  pillLabel: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
});
