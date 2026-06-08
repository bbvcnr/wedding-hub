import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, ThemedView } from '@/src/components/theme/themed-view';
import { useTheme } from '@/src/components/theme/theme-provider';
import { getAllVendors, approveVendor, rejectVendor, deleteVendorRecord, AdminVendorRecord } from '@/src/services/adminService';

type FilterValue = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';

const STATUS: Record<string, { bg: string; text: string; icon: any }> = {
  PENDING:  { bg: '#FEF3C718', text: '#D97706', icon: 'time-outline' },
  APPROVED: { bg: '#D1FAE518', text: '#059669', icon: 'checkmark-circle-outline' },
  REJECTED: { bg: '#FEE2E218', text: '#EF4444', icon: 'close-circle-outline' },
};

export default function AdminVendorsScreen() {
  const { colors } = useTheme();
  const [vendors, setVendors] = useState<AdminVendorRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterValue>('ALL');

  const load = useCallback(async () => {
    const data = await getAllVendors().catch(() => []);
    setVendors(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleApprove = (v: AdminVendorRecord) => {
    Alert.alert('Approve Vendor', `Approve "${v.data.businessName}" and make them live?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Approve', onPress: async () => {
        await approveVendor(v.id);
        setVendors((prev) => prev.map((x) => x.id === v.id ? { ...x, data: { ...x.data, status: 'APPROVED', enabled: true } } : x));
      }},
    ]);
  };

  const handleReject = (v: AdminVendorRecord) => {
    Alert.alert('Reject Vendor', `Reject "${v.data.businessName}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reject', style: 'destructive', onPress: async () => {
        await rejectVendor(v.id);
        setVendors((prev) => prev.map((x) => x.id === v.id ? { ...x, data: { ...x.data, status: 'REJECTED', enabled: false } } : x));
      }},
    ]);
  };

  const handleDelete = (v: AdminVendorRecord) => {
    Alert.alert('Delete Vendor', `Permanently delete "${v.data.businessName}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await deleteVendorRecord(v.id);
        setVendors((prev) => prev.filter((x) => x.id !== v.id));
      }},
    ]);
  };

  const FILTERS: { label: string; value: FilterValue }[] = [
    { label: 'All', value: 'ALL' },
    { label: `Pending (${vendors.filter((v) => v.data.status === 'PENDING').length})`, value: 'PENDING' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Rejected', value: 'REJECTED' },
  ];

  const displayed = filter === 'ALL' ? vendors : vendors.filter((v) => v.data.status === filter);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Vendors</ThemedText>
        <ThemedText variant="secondary" style={styles.headerSub}>{vendors.length} total</ThemedText>
      </View>

      {/* Filter pills */}
      <View style={{ height: 50 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8, alignItems: 'center', height: 50 }}
        >
          {FILTERS.map((f) => {
            const active = filter === f.value;
            return (
              <TouchableOpacity
                key={f.value}
                onPress={() => setFilter(f.value)}
                style={[styles.filterPill, { backgroundColor: active ? colors.accent.pink : colors.surface }]}
              >
                <Text style={[styles.filterLabel, { color: active ? '#fff' : colors.text.secondary }]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 48 }} color={colors.accent.pink} size="large" />
      ) : (
        <FlatList
          data={displayed}
          keyExtractor={(v) => v.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 110, gap: 12 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <View style={[styles.emptyIcon, { backgroundColor: colors.accent.pink + '18' }]}>
                <Ionicons name="storefront-outline" size={32} color={colors.accent.pink} />
              </View>
              <ThemedText style={styles.emptyTitle}>No vendors here</ThemedText>
              <ThemedText variant="secondary" style={styles.emptySub}>Try a different filter.</ThemedText>
            </View>
          }
          renderItem={({ item }) => {
            const ss = STATUS[item.data.status ?? 'PENDING'];
            return (
              <ThemedView variant="card" style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={[styles.avatar, { backgroundColor: colors.accent.pink + '18' }]}>
                    <Ionicons name="storefront" size={18} color={colors.accent.pink} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
                      <ThemedText style={styles.vendorName}>{item.data.businessName || '—'}</ThemedText>
                      <View style={[styles.badge, { backgroundColor: ss.bg }]}>
                        <Ionicons name={ss.icon} size={10} color={ss.text} />
                        <Text style={[styles.badgeText, { color: ss.text }]}>{item.data.status}</Text>
                      </View>
                    </View>
                    <ThemedText variant="secondary" style={styles.vendorMeta}>
                      {item.data.type?.replace(/_/g, ' ')} · {item.data.city || '—'}
                    </ThemedText>
                    {item.data.shortDescription ? (
                      <ThemedText variant="muted" style={styles.vendorDesc} numberOfLines={2}>
                        {item.data.shortDescription}
                      </ThemedText>
                    ) : null}
                  </View>
                </View>

                <View style={styles.actions}>
                  {item.data.status !== 'APPROVED' && (
                    <TouchableOpacity onPress={() => handleApprove(item)} style={[styles.actionBtn, { backgroundColor: '#10B981' }]}>
                      <Ionicons name="checkmark-circle" size={14} color="#fff" />
                      <Text style={styles.actionLabel}>Approve</Text>
                    </TouchableOpacity>
                  )}
                  {item.data.status === 'PENDING' && (
                    <TouchableOpacity onPress={() => handleReject(item)} style={[styles.actionBtn, { backgroundColor: '#F59E0B' }]}>
                      <Ionicons name="close-circle" size={14} color="#fff" />
                      <Text style={styles.actionLabel}>Reject</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={() => handleDelete(item)} style={[styles.actionBtn, { backgroundColor: '#EF4444' }]}>
                    <Ionicons name="trash" size={14} color="#fff" />
                    <Text style={styles.actionLabel}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </ThemedView>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  headerTitle: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  headerSub: { fontSize: 13, marginTop: 2 },
  filterPill: { borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  filterLabel: { fontSize: 13, fontWeight: '600' },
  card: { borderRadius: 18, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start' },
  avatar: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  vendorName: { fontSize: 15, fontWeight: '700' },
  vendorMeta: { fontSize: 12, marginTop: 2 },
  vendorDesc: { fontSize: 12, marginTop: 4, lineHeight: 17 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 3, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  badgeText: { fontSize: 10, fontWeight: '700' },
  actions: { flexDirection: 'row', gap: 8, marginTop: 12, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(0,0,0,0.06)', flexWrap: 'wrap' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  actionLabel: { fontSize: 13, fontWeight: '700', color: '#fff' },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyIcon: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  emptySub: { fontSize: 14, textAlign: 'center' },
});
