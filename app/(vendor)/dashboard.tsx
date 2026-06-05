import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, ThemedView } from '@/src/components/theme/themed-view';
import { useTheme } from '@/src/components/theme/theme-provider';
import { useAuth } from '@/src/context/AuthContext';
import { getVendorProfile, getVendorInquiries, VendorProfileData, VendorInquiryRecord } from '@/src/services/vendorService';

export default function VendorDashboard() {
  const { colors, isDark } = useTheme();
  const { userId, logout } = useAuth();
  const insets = useSafeAreaInsets();

  const [profile, setProfile] = useState<VendorProfileData | null>(null);
  const [inquiries, setInquiries] = useState<VendorInquiryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    Promise.all([
      getVendorProfile(userId),
      getVendorInquiries(userId).catch(() => []),
    ]).then(([p, inq]) => {
      setProfile(p);
      setInquiries(inq);
      setLoading(false);
    });
  }, [userId]);

  const handleLogout = () => Alert.alert('Logout', 'Are you sure?', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Logout', style: 'destructive', onPress: logout },
  ]);

  const statusColor = profile?.status === 'APPROVED' ? '#10B981' : profile?.status === 'REJECTED' ? '#EF4444' : '#F59E0B';
  const statusLabel = profile?.status === 'APPROVED' ? 'Live' : profile?.status === 'REJECTED' ? 'Rejected' : 'Pending Review';

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <ActivityIndicator style={{ flex: 1 }} color="#EC4899" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>

        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <View>
            <ThemedText className="text-2xl font-bold">{profile?.businessName ?? 'My Business'}</ThemedText>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: statusColor, marginRight: 6 }} />
              <ThemedText variant="secondary" className="text-sm">{statusLabel}</ThemedText>
            </View>
          </View>
          <TouchableOpacity onPress={handleLogout} style={{ padding: 8 }}>
            <Ionicons name="log-out-outline" size={22} color="#EF4444" />
          </TouchableOpacity>
        </View>

        {/* Stats row */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
          <StatCard icon="chatbubble-ellipses" label="Inquiries" value={inquiries.length} color="#EC4899" />
          <StatCard icon="time-outline" label="Pending" value={inquiries.filter(i => i.status === 'PENDING').length} color="#F59E0B" />
          <StatCard icon="checkmark-circle-outline" label="Replied" value={inquiries.filter(i => i.status === 'REPLIED').length} color="#10B981" />
        </View>

        {/* Pending review notice */}
        {profile?.status === 'PENDING' && (
          <ThemedView variant="card" style={{ borderRadius: 14, padding: 16, marginBottom: 20, borderLeftWidth: 4, borderLeftColor: '#F59E0B' }}>
            <ThemedText className="font-semibold mb-1">Profile under review</ThemedText>
            <ThemedText variant="secondary" className="text-sm">Your listing will go live once approved by our team. Complete your profile to speed up the process.</ThemedText>
          </ThemedView>
        )}

        {/* Business info summary */}
        <ThemedText className="text-lg font-semibold mb-3">Business Info</ThemedText>
        <ThemedView variant="card" style={{ borderRadius: 14, padding: 16, marginBottom: 20 }}>
          <InfoRow icon="business-outline" label="Category" value={profile?.type?.replace(/_/g, ' ') ?? '—'} colors={colors} />
          <InfoRow icon="location-outline" label="City" value={profile?.city ?? '—'} colors={colors} />
          <InfoRow icon="call-outline" label="Phone" value={profile?.phone ?? '—'} colors={colors} />
          <InfoRow icon="mail-outline" label="Email" value={profile?.email ?? '—'} colors={colors} />
        </ThemedView>

        {/* Recent inquiries */}
        <ThemedText className="text-lg font-semibold mb-3">Recent Inquiries</ThemedText>
        {inquiries.length === 0 ? (
          <ThemedView variant="card" style={{ borderRadius: 14, padding: 20, alignItems: 'center' }}>
            <Ionicons name="chatbubbles-outline" size={36} color={colors.text.muted} />
            <ThemedText className="text-sm mt-3 text-center" variant="secondary">No inquiries yet. Once couples message you, they'll appear here.</ThemedText>
          </ThemedView>
        ) : (
          inquiries.slice(0, 3).map((inq) => (
            <ThemedView key={inq.id} variant="card" style={{ borderRadius: 14, padding: 14, marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <ThemedText className="font-semibold">{inq.coupleName || 'A couple'}</ThemedText>
                <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, backgroundColor: inq.status === 'PENDING' ? '#FEF3C7' : '#D1FAE5' }}>
                  <ThemedText className="text-xs font-semibold" style={{ color: inq.status === 'PENDING' ? '#92400E' : '#065F46' }}>{inq.status}</ThemedText>
                </View>
              </View>
              <ThemedText variant="secondary" className="text-sm" numberOfLines={2}>{inq.message}</ThemedText>
              <ThemedText variant="muted" className="text-xs mt-2">{new Date(inq.contactedAt).toLocaleDateString()}</ThemedText>
            </ThemedView>
          ))
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  const { colors } = useTheme();
  return (
    <ThemedView variant="card" style={{ flex: 1, borderRadius: 14, padding: 14, alignItems: 'center' }}>
      <Ionicons name={icon} size={22} color={color} />
      <ThemedText className="text-2xl font-bold mt-2">{value}</ThemedText>
      <ThemedText variant="secondary" className="text-xs mt-1">{label}</ThemedText>
    </ThemedView>
  );
}

function InfoRow({ icon, label, value, colors }: { icon: any; label: string; value: string; colors: any }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }}>
      <Ionicons name={icon} size={16} color={colors.text.secondary} style={{ width: 24 }} />
      <ThemedText variant="secondary" className="text-sm" style={{ width: 80 }}>{label}</ThemedText>
      <ThemedText className="text-sm flex-1">{value}</ThemedText>
    </View>
  );
}

import { StyleSheet } from 'react-native';
