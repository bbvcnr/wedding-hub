import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, ThemedView } from '@/src/components/theme/themed-view';
import { useTheme } from '@/src/components/theme/theme-provider';
import { useAuth } from '@/src/context/AuthContext';
import { getAdminStats } from '@/src/services/adminService';

export default function AdminOverview() {
  const { colors, isDark } = useTheme();
  const { logout } = useAuth();
  const [stats, setStats] = useState({ totalUsers: 0, totalVendors: 0, pendingVendors: 0, bannedUsers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats().then((s) => { setStats(s); setLoading(false); });
  }, []);

  const handleLogout = () => Alert.alert('Logout', 'Sign out of admin panel?', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Logout', style: 'destructive', onPress: logout },
  ]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View>
          <ThemedText className="text-2xl font-bold">Admin Panel</ThemedText>
          <ThemedText variant="secondary" className="text-sm mt-1">Elenn — Platform Overview</ThemedText>
        </View>
        <TouchableOpacity onPress={handleLogout} style={{ padding: 8 }}>
          <Ionicons name="log-out-outline" size={22} color="#EF4444" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color="#DC2626" />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
          <View style={styles.statsGrid}>
            <StatBox icon="people" label="Total Users" value={stats.totalUsers} color="#3B82F6" isDark={isDark} />
            <StatBox icon="storefront" label="Total Vendors" value={stats.totalVendors} color="#EC4899" isDark={isDark} />
            <StatBox icon="time" label="Pending Approval" value={stats.pendingVendors} color="#F59E0B" isDark={isDark} />
            <StatBox icon="ban" label="Banned Users" value={stats.bannedUsers} color="#EF4444" isDark={isDark} />
          </View>

          {stats.pendingVendors > 0 && (
            <ThemedView variant="card" style={[styles.alertCard, { borderLeftColor: '#F59E0B' }]}>
              <Ionicons name="warning-outline" size={20} color="#F59E0B" />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <ThemedText className="font-semibold">Vendors awaiting approval</ThemedText>
                <ThemedText variant="secondary" className="text-sm mt-0.5">
                  {stats.pendingVendors} vendor{stats.pendingVendors !== 1 ? 's' : ''} need to be reviewed. Go to the Vendors tab.
                </ThemedText>
              </View>
            </ThemedView>
          )}

          <ThemedView variant="card" style={styles.infoCard}>
            <ThemedText className="font-semibold mb-3">Admin Account</ThemedText>
            <Row label="Email" value="admin@elenn.app" colors={colors} />
            <Row label="Role" value="ADMIN" colors={colors} />
            <Row label="Access" value="Full platform control" colors={colors} />
          </ThemedView>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function StatBox({ icon, label, value, color, isDark }: any) {
  return (
    <ThemedView variant="card" style={styles.statBox}>
      <View style={[styles.iconCircle, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <ThemedText className="text-3xl font-bold mt-2">{value}</ThemedText>
      <ThemedText variant="secondary" className="text-xs mt-1 text-center">{label}</ThemedText>
    </ThemedView>
  );
}

function Row({ label, value, colors }: any) {
  return (
    <View style={[styles.row, { borderBottomColor: colors.border }]}>
      <ThemedText variant="secondary" className="text-sm" style={{ width: 80 }}>{label}</ThemedText>
      <ThemedText className="text-sm flex-1">{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  statBox: { width: '47%', borderRadius: 16, padding: 16, alignItems: 'center' },
  iconCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  alertCard: { borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16, borderLeftWidth: 4 },
  infoCard: { borderRadius: 14, padding: 16 },
  row: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth },
});
