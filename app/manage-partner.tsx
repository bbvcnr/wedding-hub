import React, { useState, useEffect } from 'react';
import {
  View, TextInput, TouchableOpacity, ScrollView,
  Share, ActivityIndicator, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, ThemedView } from '@/src/components/theme/themed-view';
import { ThemedButton } from '@/src/components/theme/themed-button';
import { useTheme } from '@/src/components/theme/theme-provider';
import { useAuth } from '@/src/context/AuthContext';
import { getWedding, updateWedding, joinWedding } from '@/src/services/weddingService';

export default function ManagePartnerScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { weddingId, userId } = useAuth();

  const [partnerEmail, setPartnerEmail] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [saving, setSaving] = useState(false);
  const [joining, setJoining] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!weddingId) return;
    getWedding(weddingId).then((w) => {
      setPartnerEmail(w?.partnerEmail ?? '');
      setLoading(false);
    });
  }, [weddingId]);

  const handleShareCode = async () => {
    if (!weddingId) return;
    await Share.share({
      message: `Join my wedding on Elenn! Use this code: ${weddingId}`,
      title: 'Wedding Invitation',
    });
  };

  const handleSavePartner = async () => {
    if (!weddingId || !partnerEmail.trim()) return;
    setSaving(true);
    try {
      await updateWedding(weddingId, { partnerEmail: partnerEmail.trim() });
      Alert.alert('Saved', 'Partner email saved.');
    } catch {
      Alert.alert('Error', 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleJoin = async () => {
    if (!userId || !joinCode.trim()) return;
    setJoining(true);
    try {
      await joinWedding(userId, joinCode.trim());
      Alert.alert('Joined!', 'You have joined the wedding. Restart the app to see changes.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Failed to join. Check the code and try again.');
    } finally {
      setJoining(false);
    }
  };

  const inputStyle = [
    styles.input,
    { backgroundColor: isDark ? '#1C1C1E' : '#F3F4F6', color: colors.text.primary, borderColor: isDark ? '#3A3A3C' : '#E5E7EB' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ThemedView variant="background" style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <ThemedText className="text-xl font-bold">Manage Partner</ThemedText>
        <View style={{ width: 24 }} />
      </ThemedView>

      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Share Section */}
        <ThemedView variant="card" style={styles.section}>
          <ThemedText className="text-base font-semibold mb-1">Invite Your Partner</ThemedText>
          <ThemedText variant="secondary" className="text-sm mb-4">
            Share your wedding code. Your partner can use it to join and see your planning.
          </ThemedText>
          <ThemedView variant="background" style={styles.codeBox}>
            <ThemedText className="text-base font-mono">{loading ? '...' : (weddingId ?? '—')}</ThemedText>
          </ThemedView>
          <ThemedButton
            title="Share Code"
            onPress={handleShareCode}
            variant="primary"
            color="pink"
            size="md"
            className="mt-3"
            leftIcon={<Ionicons name="share-outline" size={18} color="white" />}
          />
        </ThemedView>

        {/* Partner Email */}
        <ThemedView variant="card" style={styles.section}>
          <ThemedText className="text-base font-semibold mb-1">Partner Email</ThemedText>
          <ThemedText variant="secondary" className="text-sm mb-3">
            Record your partner's email for reference.
          </ThemedText>
          <TextInput
            style={inputStyle}
            value={partnerEmail}
            onChangeText={setPartnerEmail}
            placeholder="partner@email.com"
            placeholderTextColor={colors.text.muted}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <ThemedButton
            title={saving ? '' : 'Save'}
            onPress={handleSavePartner}
            disabled={saving || !partnerEmail.trim()}
            variant="outline"
            color="pink"
            size="md"
            className="mt-2"
            leftIcon={saving ? <ActivityIndicator color="#EC4899" size="small" /> : undefined}
          />
        </ThemedView>

        {/* Join a Wedding */}
        <ThemedView variant="card" style={styles.section}>
          <ThemedText className="text-base font-semibold mb-1">Join a Wedding</ThemedText>
          <ThemedText variant="secondary" className="text-sm mb-3">
            Have a wedding code from your partner? Enter it below to join their wedding.
          </ThemedText>
          <TextInput
            style={inputStyle}
            value={joinCode}
            onChangeText={setJoinCode}
            placeholder="Paste wedding code here"
            placeholderTextColor={colors.text.muted}
            autoCapitalize="none"
          />
          <ThemedButton
            title={joining ? '' : 'Join Wedding'}
            onPress={handleJoin}
            disabled={joining || !joinCode.trim()}
            variant="primary"
            color="blue"
            size="md"
            className="mt-2"
            leftIcon={joining ? <ActivityIndicator color="#fff" size="small" /> : undefined}
          />
        </ThemedView>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  scroll: { padding: 16, gap: 16, paddingBottom: 60 },
  section: { borderRadius: 16, padding: 16 },
  input: { borderWidth: 1, borderRadius: 10, padding: 13, fontSize: 15 },
  codeBox: { borderRadius: 10, padding: 14, alignItems: 'center' },
});
