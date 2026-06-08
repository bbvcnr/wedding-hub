import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, StyleSheet, ActivityIndicator, Modal, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, ThemedView } from '@/src/components/theme/themed-view';
import { useTheme } from '@/src/components/theme/theme-provider';
import { useAuth } from '@/src/context/AuthContext';
import { getAdminStats } from '@/src/services/adminService';

type ThemeMode = 'light' | 'dark' | 'system';
const THEME_OPTIONS: { value: ThemeMode; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: 'light', label: 'Light', icon: 'sunny-outline' },
  { value: 'dark', label: 'Dark', icon: 'moon-outline' },
  { value: 'system', label: 'System', icon: 'phone-portrait-outline' },
];

const STATS = [
  { key: 'totalUsers',     label: 'Total Users',       icon: 'people'     as const, color: '#3B82F6' },
  { key: 'totalVendors',   label: 'Total Vendors',     icon: 'storefront' as const, color: '#EC4899' },
  { key: 'pendingVendors', label: 'Pending Approval',  icon: 'time'       as const, color: '#F59E0B' },
  { key: 'bannedUsers',    label: 'Banned Users',      icon: 'ban'        as const, color: '#EF4444' },
];

export default function AdminOverview() {
  const { colors, isDark, theme, setTheme } = useTheme();
  const { logout, user } = useAuth();
  const [stats, setStats] = useState({ totalUsers: 0, totalVendors: 0, pendingVendors: 0, bannedUsers: 0 });
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    getAdminStats().then((s) => { setStats(s); setLoading(false); });
  }, []);

  const handleLogout = () => {
    setShowSettings(false);
    setTimeout(() => {
      Alert.alert('Log Out', 'Sign out of admin panel?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: logout },
      ]);
    }, 300);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.headerTitle}>Admin Panel</ThemedText>
          <ThemedText variant="secondary" style={styles.headerSub}>Elenn — Platform Overview</ThemedText>
        </View>
        <TouchableOpacity onPress={() => setShowSettings(true)} style={[styles.iconBtn, { backgroundColor: colors.surface }]}>
          <Ionicons name="settings-outline" size={20} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 48 }} color={colors.accent.pink} size="large" />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>

          {/* Stats grid */}
          <View style={styles.statsGrid}>
            {STATS.map((s) => (
              <ThemedView key={s.key} variant="card" style={styles.statCard}>
                <View style={[styles.iconCircle, { backgroundColor: s.color + '18' }]}>
                  <Ionicons name={s.icon} size={22} color={s.color} />
                </View>
                <ThemedText style={[styles.statNumber, { color: s.color }]}>
                  {stats[s.key as keyof typeof stats]}
                </ThemedText>
                <ThemedText variant="secondary" style={styles.statLabel}>{s.label}</ThemedText>
              </ThemedView>
            ))}
          </View>

          {/* Pending alert */}
          {stats.pendingVendors > 0 && (
            <View style={[styles.alertBlock, { backgroundColor: '#F59E0B' }]}>
              <View style={styles.alertPill} />
              <Ionicons name="warning" size={20} color="#fff" style={{ marginBottom: 8 }} />
              <Text style={styles.alertTitle}>Vendors awaiting approval</Text>
              <Text style={styles.alertSub}>
                {stats.pendingVendors} vendor{stats.pendingVendors !== 1 ? 's' : ''} need review — go to the Vendors tab.
              </Text>
            </View>
          )}

          {/* Account info */}
          <ThemedText style={styles.sectionLabel}>ACCOUNT</ThemedText>
          <ThemedView variant="card" style={styles.infoCard}>
            <InfoRow label="Email" value={user?.email ?? 'admin@elenn.app'} colors={colors} />
            <InfoRow label="Role" value="ADMIN" colors={colors} last />
          </ThemedView>

        </ScrollView>
      )}

      {/* Settings sheet */}
      <Modal visible={showSettings} transparent animationType="slide" onRequestClose={() => setShowSettings(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setShowSettings(false)} />
        <View style={[styles.sheet, { backgroundColor: isDark ? '#1C1C1E' : '#fff' }]}>
          <View style={styles.sheetHandle} />

          <ThemedText style={styles.sheetTitle}>Settings</ThemedText>

          <ThemedText variant="secondary" style={styles.sheetLabel}>APPEARANCE</ThemedText>
          <View style={[styles.themeRow, { backgroundColor: colors.surface, borderRadius: 14 }]}>
            {THEME_OPTIONS.map((opt) => {
              const selected = theme === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => setTheme(opt.value)}
                  activeOpacity={0.75}
                  style={[styles.themeOption, selected && { backgroundColor: colors.accent.pink }]}
                >
                  <Ionicons name={opt.icon} size={17} color={selected ? '#fff' : colors.text.secondary} />
                  <Text style={[styles.themeLabel, { color: selected ? '#fff' : colors.text.secondary }]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <ThemedText variant="secondary" style={[styles.sheetLabel, { marginTop: 24 }]}>ACCOUNT</ThemedText>
          <ThemedView variant="card" style={{ borderRadius: 14, overflow: 'hidden' }}>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutRow}>
              <View style={[styles.iconCircle, { backgroundColor: '#FEE2E2', width: 32, height: 32, borderRadius: 8 }]}>
                <Ionicons name="log-out-outline" size={16} color="#EF4444" />
              </View>
              <Text style={styles.logoutLabel}>Log Out</Text>
            </TouchableOpacity>
          </ThemedView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function InfoRow({ label, value, colors, last }: any) {
  return (
    <View style={[styles.infoRow, !last && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }]}>
      <ThemedText variant="secondary" style={{ fontSize: 13, width: 72 }}>{label}</ThemedText>
      <ThemedText style={{ fontSize: 14, fontWeight: '600', flex: 1 }}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  headerTitle: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  headerSub: { fontSize: 13, marginTop: 2 },
  iconBtn: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  statCard: { width: '47%', borderRadius: 18, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  iconCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  statNumber: { fontSize: 32, fontWeight: '800', letterSpacing: -1 },
  statLabel: { fontSize: 11, marginTop: 3, textAlign: 'center' },
  alertBlock: { borderRadius: 18, padding: 18, marginBottom: 20 },
  alertPill: { width: 28, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.45)', marginBottom: 12 },
  alertTitle: { color: '#fff', fontSize: 15, fontWeight: '800', marginBottom: 4 },
  alertSub: { color: 'rgba(255,255,255,0.85)', fontSize: 13, lineHeight: 18 },
  sectionLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 0.8, marginBottom: 8, marginLeft: 2 },
  infoCard: { borderRadius: 14, overflow: 'hidden' },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 13 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 44 },
  sheetHandle: { width: 40, height: 4, backgroundColor: '#D1D5DB', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  sheetTitle: { fontSize: 20, fontWeight: '700', marginBottom: 20 },
  sheetLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 0.8, marginBottom: 8, marginLeft: 2 },
  themeRow: { flexDirection: 'row', padding: 8, gap: 6 },
  themeOption: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 10 },
  themeLabel: { fontSize: 13, fontWeight: '600' },
  logoutRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 13, gap: 12 },
  logoutLabel: { fontSize: 15, fontWeight: '600', color: '#EF4444' },
});
