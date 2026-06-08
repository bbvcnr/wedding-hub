import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Tabs, usePathname, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/src/components/theme/theme-provider';

const ORGANIZER_TABS = [
  { name: '/(organizer)/dashboard', icon: 'briefcase-outline' as const, iconFocused: 'briefcase' as const, label: 'Weddings' },
  { name: '/(organizer)/invites', icon: 'mail-outline' as const, iconFocused: 'mail' as const, label: 'Invites' },
  { name: '/(organizer)/profile', icon: 'person-outline' as const, iconFocused: 'person' as const, label: 'Profile' },
];

function CustomTabBar() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (tabName: string) =>
    pathname.startsWith(tabName.replace('/(organizer)', ''));

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
      {ORGANIZER_TABS.map((tab) => {
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

export default function OrganizerLayout() {
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
