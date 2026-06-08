import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText, ThemedView } from '@/src/components/theme/themed-view';
import { useTheme } from '@/src/components/theme/theme-provider';
import { useAuth } from '@/src/context/AuthContext';
import {
  acceptOrganizerInvite,
  declineOrganizerInvite,
  getPendingOrganizerInvitesByEmail,
  OrganizerInvite,
} from '@/src/services/organizerService';
import { getWedding } from '@/src/services/weddingService';

export default function OrganizerInvitesScreen() {
  const { colors } = useTheme();
  const { user, userId, refreshProfile } = useAuth();
  const [invites, setInvites] = useState<OrganizerInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [weddingNames, setWeddingNames] = useState<Record<string, string>>({});

  const load = async () => {
    if (!user?.email) {
      setInvites([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const list = await getPendingOrganizerInvitesByEmail(user.email).catch(() => []);
    setInvites(list);

    const names: Record<string, string> = {};
    await Promise.all(
      list.map(async (invite) => {
        const wedding = await getWedding(invite.weddingId).catch(() => null);
        names[invite.weddingId] = wedding?.coupleName || 'Wedding';
      })
    );
    setWeddingNames(names);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [user?.email]);

  const onAccept = async (invite: OrganizerInvite) => {
    if (!userId) return;
    setBusyId(invite.id);
    await acceptOrganizerInvite(invite.id, userId);
    await refreshProfile();
    await load();
    setBusyId(null);
  };

  const onDecline = async (invite: OrganizerInvite) => {
    setBusyId(invite.id);
    await declineOrganizerInvite(invite.id);
    await load();
    setBusyId(null);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 90 }}>
        <ThemedText style={{ fontSize: 28, fontWeight: '800' }}>Organizer Invites</ThemedText>
        <ThemedText variant="secondary" style={{ marginTop: 6 }}>
          Accept or decline invitations from couples.
        </ThemedText>

        {loading ? (
          <View style={{ marginTop: 44, alignItems: 'center' }}>
            <ActivityIndicator color={colors.accent.pink} />
          </View>
        ) : invites.length === 0 ? (
          <ThemedView variant="card" style={{ marginTop: 18, borderRadius: 16, padding: 18 }}>
            <ThemedText className="font-semibold">No pending invites</ThemedText>
            <ThemedText variant="secondary" style={{ marginTop: 6 }}>
              New invitations will show here.
            </ThemedText>
          </ThemedView>
        ) : (
          <View style={{ marginTop: 18, gap: 10 }}>
            {invites.map((invite) => (
              <ThemedView key={invite.id} variant="card" style={{ borderRadius: 16, padding: 16 }}>
                <ThemedText className="font-semibold" style={{ fontSize: 16 }}>{weddingNames[invite.weddingId] || 'Wedding Invite'}</ThemedText>
                <ThemedText variant="secondary" style={{ marginTop: 6 }}>
                  Invited by {invite.invitedByEmail || 'Client'}
                </ThemedText>

                <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
                  <TouchableOpacity
                    disabled={busyId === invite.id}
                    onPress={() => onDecline(invite)}
                    style={{ flex: 1, borderRadius: 10, paddingVertical: 11, alignItems: 'center', borderWidth: 1, borderColor: colors.border }}
                  >
                    <ThemedText>Decline</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={busyId === invite.id}
                    onPress={() => onAccept(invite)}
                    style={{ flex: 1, borderRadius: 10, paddingVertical: 11, alignItems: 'center', backgroundColor: colors.accent.pink }}
                  >
                    {busyId === invite.id
                      ? <ActivityIndicator size="small" color="#fff" />
                      : <ThemedText style={{ color: '#fff', fontWeight: '700' }}>Accept</ThemedText>}
                  </TouchableOpacity>
                </View>
              </ThemedView>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
