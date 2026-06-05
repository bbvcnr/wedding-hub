import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, ThemedView } from '@/src/components/theme/themed-view';
import { useTheme } from '@/src/components/theme/theme-provider';
import { getAllVendors, approveVendor, rejectVendor, deleteVendorRecord, AdminVendorRecord } from '@/src/services/adminService';

const STATUS_STYLE: Record<string, { bg: string; text: string; icon: any }> = {
  PENDING:  { bg: '#FEF3C7', text: '#92400E', icon: 'time-outline' },
  APPROVED: { bg: '#D1FAE5', text: '#065F46', icon: 'checkmark-circle-outline' },
  REJECTED: { bg: '#FEE2E2', text: '#991B1B', icon: 'close-circle-outline' },
};

export default function AdminVendorsScreen() {
  const { colors } = useTheme();
  const [vendors, setVendors] = useState<AdminVendorRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');

  const load = useCallback(async () => {
    const data = await getAllVendors().catch(() => []);
    setVendors(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleApprove = (vendor: AdminVendorRecord) => {
    Alert.alert('Approve Vendor', `Approve "${vendor.data.businessName}" and make them live?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Approve',
        onPress: async () => {
          await approveVendor(vendor.id);
          setVendors((prev) => prev.map((v) => v.id === vendor.id ? { ...v, data: { ...v.data, status: 'APPROVED', enabled: true } } : v));
        },
      },
    ]);
  };

  const handleReject = (vendor: AdminVendorRecord) => {
    Alert.alert('Reject Vendor', `Reject "${vendor.data.businessName}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject',
        style: 'destructive',
        onPress: async () => {
          await rejectVendor(vendor.id);
          setVendors((prev) => prev.map((v) => v.id === vendor.id ? { ...v, data: { ...v.data, status: 'REJECTED', enabled: false } } : v));
        },
      },
    ]);
  };

  const handleDelete = (vendor: AdminVendorRecord) => {
    Alert.alert('Delete Vendor', `Permanently delete "${vendor.data.businessName}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          await deleteVendorRecord(vendor.id);
          setVendors((prev) => prev.filter((v) => v.id !== vendor.id));
        },
      },
    ]);
  };

  const displayed = filter === 'ALL' ? vendors : vendors.filter((v) => v.data.status === filter);

  const FilterPill = ({ label, value }: { label: string; value: typeof filter }) => (
    <TouchableOpacity
      onPress={() => setFilter(value)}
      style={[styles.pill, { backgroundColor: filter === value ? '#DC2626' : colors.surface, borderColor: filter === value ? '#DC2626' : colors.border }]}
    >
      <ThemedText className="text-xs font-semibold" style={{ color: filter === value ? '#fff' : colors.text.secondary }}>{label}</ThemedText>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'left', 'right']}>
      <ThemedView variant="background" style={styles.header}>
        <ThemedText className="text-2xl font-bold">Vendors</ThemedText>
        <ThemedText variant="secondary" className="text-sm mt-1">{vendors.length} total</ThemedText>
      </ThemedView>

      {/* Filter pills */}
      <ThemedView variant="background" style={styles.filterRow}>
        <FilterPill label="All" value="ALL" />
        <FilterPill label={`Pending (${vendors.filter(v => v.data.status === 'PENDING').length})`} value="PENDING" />
        <FilterPill label="Approved" value="APPROVED" />
        <FilterPill label="Rejected" value="REJECTED" />
      </ThemedView>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color="#DC2626" />
      ) : (
        <FlatList
          data={displayed}
          keyExtractor={(v) => v.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          ListEmptyComponent={
            <ThemedView variant="background" style={{ alignItems: 'center', paddingTop: 40 }}>
              <ThemedText variant="secondary">No vendors in this category.</ThemedText>
            </ThemedView>
          }
          renderItem={({ item }) => {
            const ss = STATUS_STYLE[item.data.status ?? 'PENDING'];
            return (
              <ThemedView variant="card" style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={styles.avatar}>
                    <Ionicons name="storefront" size={18} color="#fff" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <ThemedText className="font-semibold">{item.data.businessName || '—'}</ThemedText>
                      <View style={[styles.badge, { backgroundColor: ss.bg }]}>
                        <Ionicons name={ss.icon} size={10} color={ss.text} />
                        <ThemedText style={{ fontSize: 10, fontWeight: '700', marginLeft: 3, color: ss.text }}>{item.data.status}</ThemedText>
                      </View>
                    </View>
                    <ThemedText variant="secondary" className="text-xs mt-0.5">
                      {item.data.type?.replace(/_/g, ' ')} · {item.data.city || '—'}
                    </ThemedText>
                    {item.data.shortDescription ? (
                      <ThemedText variant="muted" className="text-xs mt-1" numberOfLines={2}>{item.data.shortDescription}</ThemedText>
                    ) : null}
                  </View>
                </View>

                <View style={styles.actions}>
                  {item.data.status !== 'APPROVED' && (
                    <TouchableOpacity onPress={() => handleApprove(item)} style={[styles.actionBtn, { backgroundColor: '#D1FAE5', borderColor: '#10B981' }]}>
                      <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                      <ThemedText style={{ fontSize: 12, fontWeight: '700', marginLeft: 4, color: '#065F46' }}>Approve</ThemedText>
                    </TouchableOpacity>
                  )}
                  {item.data.status !== 'REJECTED' && (
                    <TouchableOpacity onPress={() => handleReject(item)} style={[styles.actionBtn, { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }]}>
                      <Ionicons name="close-circle" size={14} color="#F59E0B" />
                      <ThemedText style={{ fontSize: 12, fontWeight: '700', marginLeft: 4, color: '#92400E' }}>Reject</ThemedText>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={() => handleDelete(item)} style={[styles.actionBtn, { backgroundColor: '#FEE2E2', borderColor: '#EF4444' }]}>
                    <Ionicons name="trash" size={14} color="#EF4444" />
                    <ThemedText style={{ fontSize: 12, fontWeight: '700', marginLeft: 4, color: '#991B1B' }}>Delete</ThemedText>
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
  header: { paddingHorizontal: 20, paddingVertical: 16 },
  filterRow: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 8, gap: 8 },
  pill: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  card: { borderRadius: 16, padding: 14 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EC4899', alignItems: 'center', justifyContent: 'center' },
  badge: { flexDirection: 'row', alignItems: 'center', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 12, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#E5E7EB', flexWrap: 'wrap' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
});
