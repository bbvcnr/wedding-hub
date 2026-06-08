import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, ThemedView } from '@/src/components/theme/themed-view';
import { useTheme } from '@/src/components/theme/theme-provider';
import { useAuth } from '@/src/context/AuthContext';
import { getOrganizerWeddings } from '@/src/services/organizerService';
import { Wedding } from '@/src/types/profile';

const formatDate = (value?: string) => {
  if (!value) return 'Date not set';
  return new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default function OrganizerDashboardScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { organizerWeddingIds, weddingId: activeWeddingId, setActiveWeddingId } = useAuth();
  const [weddings, setWeddings] = useState<Wedding[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const list = await getOrganizerWeddings(organizerWeddingIds);
      setWeddings(list);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    load();
  }, [organizerWeddingIds.join('|')]);

  const onOpenWedding = async (id: string) => {
    await setActiveWeddingId(id);
    router.push('/(tabs)/profile' as any);
  };

  const sorted = useMemo(
    () => [...weddings].sort((a, b) => (a.weddingDate || '') > (b.weddingDate || '') ? 1 : -1),
    [weddings]
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 90 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
      >
        <ThemedText style={{ fontSize: 28, fontWeight: '800' }}>Organizer Workspace</ThemedText>
        <ThemedText variant="secondary" style={{ marginTop: 6 }}>
          Manage all weddings you were invited to.
        </ThemedText>

        {loading ? (
          <View style={{ marginTop: 48, alignItems: 'center' }}>
            <ActivityIndicator color={colors.accent.pink} />
            <ThemedText variant="secondary" style={{ marginTop: 10 }}>Loading weddings...</ThemedText>
          </View>
        ) : sorted.length === 0 ? (
          <ThemedView variant="card" style={{ marginTop: 18, borderRadius: 16, padding: 18 }}>
            <ThemedText className="font-semibold">No weddings yet</ThemedText>
            <ThemedText variant="secondary" style={{ marginTop: 6 }}>
              Ask a client to invite you from Settings → Invite Organizer.
            </ThemedText>
          </ThemedView>
        ) : (
          <View style={{ marginTop: 18, gap: 10 }}>
            {sorted.map((w) => (
              <TouchableOpacity key={w.id} activeOpacity={0.8} onPress={() => onOpenWedding(w.id)}>
                <ThemedView variant="card" style={{ borderRadius: 16, padding: 16 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <ThemedText style={{ fontSize: 18, fontWeight: '700' }}>{w.coupleName || 'Wedding'}</ThemedText>
                    {activeWeddingId === w.id && (
                      <View style={{ backgroundColor: colors.accent.pink + '25', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99 }}>
                        <ThemedText style={{ color: colors.accent.pink, fontSize: 11, fontWeight: '700' }}>ACTIVE</ThemedText>
                      </View>
                    )}
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                    <Ionicons name="calendar-outline" size={14} color={colors.text.secondary} />
                    <ThemedText variant="secondary" style={{ marginLeft: 6 }}>{formatDate(w.weddingDate)}</ThemedText>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                    <Ionicons name="location-outline" size={14} color={colors.text.secondary} />
                    <ThemedText variant="secondary" style={{ marginLeft: 6 }}>{w.city || 'City not set'}</ThemedText>
                  </View>
                </ThemedView>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
