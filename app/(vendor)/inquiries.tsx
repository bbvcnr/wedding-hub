import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, ThemedView } from '@/src/components/theme/themed-view';
import { useTheme } from '@/src/components/theme/theme-provider';
import { useAuth } from '@/src/context/AuthContext';
import { getVendorInquiries, updateVendorProfile, VendorInquiryRecord } from '@/src/services/vendorService';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '@/src/services/firebase';

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  PENDING: { bg: '#FEF3C7', text: '#92400E' },
  REPLIED: { bg: '#D1FAE5', text: '#065F46' },
  BOOKED:  { bg: '#DBEAFE', text: '#1E40AF' },
};

const NEXT_STATUS: Record<string, VendorInquiryRecord['status']> = {
  PENDING: 'REPLIED',
  REPLIED: 'BOOKED',
  BOOKED:  'BOOKED',
};

export default function VendorInquiriesScreen() {
  const { colors } = useTheme();
  const { userId } = useAuth();
  const [inquiries, setInquiries] = useState<VendorInquiryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) return;
    const data = await getVendorInquiries(userId).catch(() => []);
    setInquiries(data);
    setLoading(false);
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const handleAdvanceStatus = async (item: VendorInquiryRecord) => {
    if (item.status === 'BOOKED') return;
    const next = NEXT_STATUS[item.status];
    Alert.alert('Update Status', `Mark as "${next}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Update', onPress: async () => {
          await setDoc(doc(db, 'vendorInquiries', item.id), { status: next }, { merge: true });
          setInquiries((prev) => prev.map((i) => i.id === item.id ? { ...i, status: next } : i));
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <ActivityIndicator style={{ flex: 1 }} color="#EC4899" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'left', 'right']}>
      <ThemedView variant="background" style={styles.header}>
        <ThemedText className="text-2xl font-bold">Inquiries</ThemedText>
        <ThemedText variant="secondary" className="text-sm mt-1">{inquiries.length} total</ThemedText>
      </ThemedView>

      {inquiries.length === 0 ? (
        <ThemedView variant="background" className="flex-1 items-center justify-center px-8">
          <Ionicons name="chatbubbles-outline" size={52} color={colors.text.muted} />
          <ThemedText className="text-lg font-semibold mt-4 text-center">No inquiries yet</ThemedText>
          <ThemedText variant="secondary" className="text-sm mt-2 text-center">
            When couples send you messages through the app, they will appear here.
          </ThemedText>
        </ThemedView>
      ) : (
        <FlatList
          data={inquiries}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          renderItem={({ item }) => {
            const sc = STATUS_COLORS[item.status] ?? STATUS_COLORS.PENDING;
            return (
              <ThemedView variant="card" style={styles.card}>
                <View style={styles.cardHeader}>
                  <View>
                    <ThemedText className="font-bold text-base">{item.coupleName || 'A couple'}</ThemedText>
                    <ThemedText variant="muted" className="text-xs mt-0.5">
                      {new Date(item.contactedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </ThemedText>
                  </View>
                  <View style={[styles.badge, { backgroundColor: sc.bg }]}>
                    <ThemedText style={{ fontSize: 11, fontWeight: '700', color: sc.text }}>{item.status}</ThemedText>
                  </View>
                </View>

                <ThemedText variant="secondary" className="text-sm mt-3 leading-5">{item.message}</ThemedText>

                {item.status !== 'BOOKED' && (
                  <TouchableOpacity onPress={() => handleAdvanceStatus(item)} style={styles.advanceBtn}>
                    <Ionicons name="arrow-forward-circle-outline" size={16} color="#EC4899" />
                    <ThemedText className="text-sm font-semibold ml-1" style={{ color: '#EC4899' }}>
                      Mark as {NEXT_STATUS[item.status]}
                    </ThemedText>
                  </TouchableOpacity>
                )}
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
  card: { borderRadius: 16, padding: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  badge: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  advanceBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#E5E7EB' },
});
