import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, ThemedView } from '@/src/components/theme/themed-view';
import { useTheme } from '@/src/components/theme/theme-provider';
import { useAuth } from '@/src/context/AuthContext';
import { createOrganizerInvite, getOrganizerInvitesByWedding, OrganizerInvite } from '@/src/services/organizerService';

export default function ManageOrganizerScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { weddingId, userId, user } = useAuth();
  const [organizerEmail, setOrganizerEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [invites, setInvites] = useState<OrganizerInvite[]>([]);

  const load = async () => {
    if (!weddingId) {
      setInvites([]);
      setLoading(false);
      return;
    }
    const rows = await getOrganizerInvitesByWedding(weddingId).catch(() => []);
    setInvites(rows);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [weddingId]);

  const sendInvite = async () => {
    if (!weddingId || !userId) return;
    const email = organizerEmail.trim();
    if (!email) return;

    setSending(true);
    try {
      await createOrganizerInvite({
        weddingId,
        organizerEmail: email,
        invitedByUserId: userId,
        invitedByEmail: user?.email ?? '',
      });
      setOrganizerEmail('');
      await load();
      Alert.alert('Invite sent', 'Organizer invitation has been sent.');
    } catch (error: any) {
      Alert.alert('Unable to send invite', error?.message || 'Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'left', 'right']}>
      <ThemedView variant="background" style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <ThemedText className="text-xl font-bold">Invite Organizer</ThemedText>
        <View style={{ width: 24 }} />
      </ThemedView>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <ThemedView variant="card" style={{ borderRadius: 16, padding: 16 }}>
          <ThemedText className="font-semibold">Send an invitation</ThemedText>
          <ThemedText variant="secondary" style={{ marginTop: 4 }}>
            Invite a wedding organizer by email to collaborate on this wedding.
          </ThemedText>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDark ? '#1C1C1E' : '#F3F4F6',
                color: colors.text.primary,
                borderColor: isDark ? '#3A3A3C' : '#E5E7EB',
              },
            ]}
            value={organizerEmail}
            onChangeText={setOrganizerEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="organizer@email.com"
            placeholderTextColor={colors.text.muted}
          />

          <TouchableOpacity
            disabled={sending || !organizerEmail.trim()}
            onPress={sendInvite}
            style={{
              marginTop: 12,
              borderRadius: 10,
              paddingVertical: 12,
              alignItems: 'center',
              backgroundColor: sending || !organizerEmail.trim() ? colors.text.muted : colors.accent.pink,
            }}
          >
            {sending
              ? <ActivityIndicator size="small" color="#fff" />
              : <ThemedText style={{ color: '#fff', fontWeight: '700' }}>Send Invite</ThemedText>}
          </TouchableOpacity>
        </ThemedView>

        <ThemedText style={{ marginTop: 20, marginBottom: 10, fontSize: 16, fontWeight: '700' }}>Invitations</ThemedText>

        {loading ? (
          <View style={{ marginTop: 18, alignItems: 'center' }}>
            <ActivityIndicator color={colors.accent.pink} />
          </View>
        ) : invites.length === 0 ? (
          <ThemedView variant="card" style={{ borderRadius: 14, padding: 16 }}>
            <ThemedText variant="secondary">No organizer invites yet.</ThemedText>
          </ThemedView>
        ) : (
          <View style={{ gap: 8 }}>
            {invites.map((invite) => (
              <ThemedView key={invite.id} variant="card" style={{ borderRadius: 14, padding: 14 }}>
                <ThemedText className="font-semibold">{invite.organizerEmail}</ThemedText>
                <View style={{ marginTop: 8, alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3, backgroundColor: invite.status === 'ACCEPTED' ? '#10B98122' : invite.status === 'DECLINED' ? '#EF444422' : '#EC489922' }}>
                  <ThemedText style={{ fontSize: 11, fontWeight: '700', color: invite.status === 'ACCEPTED' ? '#10B981' : invite.status === 'DECLINED' ? '#EF4444' : '#EC4899' }}>
                    {invite.status}
                  </ThemedText>
                </View>
              </ThemedView>
            ))}
          </View>
        )}
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
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
    fontSize: 15,
  },
});
