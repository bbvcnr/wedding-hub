import React from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, ThemedView } from '@/src/components/theme/themed-view';
import { useTheme } from '@/src/components/theme/theme-provider';
import { useAuth } from '@/src/context/AuthContext';

type Theme = 'light' | 'dark' | 'system';

const THEME_OPTIONS: { value: Theme; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: 'light', label: 'Light', icon: 'sunny-outline' },
  { value: 'dark', label: 'Dark', icon: 'moon-outline' },
  { value: 'system', label: 'System', icon: 'phone-portrait-outline' },
];

function SectionHeader({ title }: { title: string }) {
  return (
    <ThemedText variant="secondary" style={styles.sectionHeader}>
      {title.toUpperCase()}
    </ThemedText>
  );
}

interface RowProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  label: string;
  sublabel?: string;
  onPress?: () => void;
  rightEl?: React.ReactNode;
  destructive?: boolean;
  last?: boolean;
}

function Row({ icon, iconColor, label, sublabel, onPress, rightEl, destructive, last }: RowProps) {
  const { colors } = useTheme();
  const labelColor = destructive ? '#EF4444' : colors.text.primary;
  const resolvedIconColor = iconColor ?? (destructive ? '#EF4444' : colors.text.secondary);

  return (
    <>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={onPress ? 0.65 : 1}
        style={styles.row}
        disabled={!onPress && !rightEl}
      >
        <View style={[styles.iconWrap, { backgroundColor: resolvedIconColor + '18' }]}>
          <Ionicons name={icon} size={18} color={resolvedIconColor} />
        </View>
        <View style={styles.rowText}>
          <ThemedText style={[styles.rowLabel, { color: labelColor }]}>{label}</ThemedText>
          {sublabel ? (
            <ThemedText variant="secondary" style={styles.rowSublabel}>{sublabel}</ThemedText>
          ) : null}
        </View>
        {rightEl ?? (onPress ? (
          <Ionicons name="chevron-forward" size={15} color={colors.text.muted} />
        ) : null)}
      </TouchableOpacity>
      {!last && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
    </>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <ThemedView
      variant="card"
      style={[styles.card, { borderColor: colors.border }]}
    >
      {children}
    </ThemedView>
  );
}

export default function SettingsScreen() {
  const { colors } = useTheme();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <ThemedView variant="background" style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Settings</ThemedText>
        <View style={{ width: 24 }} />
      </ThemedView>

      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Appearance */}
        <SectionHeader title="Appearance" />
        <Card>
          <View style={styles.themeRow}>
            {THEME_OPTIONS.map((opt, i) => {
              const selected = theme === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => setTheme(opt.value)}
                  activeOpacity={0.75}
                  style={[
                    styles.themeOption,
                    selected && { backgroundColor: colors.accent.pink },
                    i === 0 && styles.themeOptionFirst,
                    i === THEME_OPTIONS.length - 1 && styles.themeOptionLast,
                    { borderColor: selected ? colors.accent.pink : colors.border },
                  ]}
                >
                  <Ionicons
                    name={opt.icon}
                    size={18}
                    color={selected ? '#fff' : colors.text.secondary}
                  />
                  <ThemedText
                    style={[styles.themeLabel, { color: selected ? '#fff' : colors.text.secondary }]}
                  >
                    {opt.label}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* Account */}
        <SectionHeader title="Account" />
        <Card>
          <Row
            icon="person-outline"
            label={user?.displayName ?? 'My Account'}
            sublabel={user?.email ?? undefined}
            last
          />
        </Card>

        {/* Wedding */}
        <SectionHeader title="Wedding" />
        <Card>
          <Row
            icon="create-outline"
            label="Edit Wedding Details"
            onPress={() => router.push('/edit-wedding')}
          />
          <Row
            icon="people-outline"
            label="Manage Partner"
            onPress={() => router.push('/manage-partner')}
          />
          <Row
            icon="checkbox-outline"
            label="Checklist"
            onPress={() => router.push('/checklist')}
          />
          <Row
            icon="bookmark-outline"
            label="Shortlist"
            onPress={() => router.push('/shortlist')}
            last
          />
        </Card>

        {/* Support */}
        <SectionHeader title="Support" />
        <Card>
          <Row
            icon="mail-outline"
            label="Contact Support"
            sublabel="hello@elenn.app"
            onPress={() => Linking.openURL('mailto:hello@elenn.app')}
          />
          <Row
            icon="document-text-outline"
            label="Privacy Policy"
            onPress={() => Linking.openURL('https://elenn.app/privacy')}
            last
          />
        </Card>

        {/* Danger zone */}
        <SectionHeader title="Account Actions" />
        <Card>
          <Row
            icon="log-out-outline"
            label="Log Out"
            onPress={handleLogout}
            destructive
            last
          />
        </Card>

        <ThemedText variant="secondary" style={styles.version}>
          Elenn v1.0.0
        </ThemedText>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  scroll: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 48 },
  sectionHeader: { fontSize: 11, fontWeight: '600', letterSpacing: 0.8, marginTop: 20, marginBottom: 6, marginLeft: 4 },
  card: { borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 13 },
  iconWrap: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  rowText: { flex: 1 },
  rowLabel: { fontSize: 15 },
  rowSublabel: { fontSize: 12, marginTop: 1 },
  divider: { height: StyleSheet.hairlineWidth, marginLeft: 58 },
  themeRow: { flexDirection: 'row', padding: 10, gap: 8 },
  themeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  themeOptionFirst: {},
  themeOptionLast: {},
  themeLabel: { fontSize: 13, fontWeight: '600' },
  version: { textAlign: 'center', fontSize: 12, marginTop: 28 },
});
