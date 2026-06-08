import React, { useState, useEffect } from 'react';
import {
  ScrollView, View, TextInput, TouchableOpacity,
  ActivityIndicator, StyleSheet, Alert,
  KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, ThemedView } from '@/src/components/theme/themed-view';
import { ThemedButton } from '@/src/components/theme/themed-button';
import { useTheme } from '@/src/components/theme/theme-provider';
import { useAuth } from '@/src/context/AuthContext';
import { getWedding, updateWedding } from '@/src/services/weddingService';
import { getUserProfile, updateUserProfile } from '@/src/services/userService';
import { WeddingStyle } from '@/src/types/profile';

type UserRole = 'BRIDE' | 'GROOM';

const STYLES: WeddingStyle[] = ['MODERN', 'RUSTIC', 'LUXURY', 'TRADITIONAL', 'BOHO'];

export default function EditWeddingScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { weddingId, userId } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [userRole, setUserRole] = useState<UserRole | undefined>();
  const [coupleName, setCoupleName] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [city, setCity] = useState('');
  const [style, setStyle] = useState<WeddingStyle | undefined>();
  const [guestMin, setGuestMin] = useState('');
  const [guestMax, setGuestMax] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');

  useEffect(() => {
    if (!weddingId || !userId) return;
    Promise.all([getWedding(weddingId), getUserProfile(userId)]).then(([w, profile]) => {
      if (w) {
        setCoupleName(w.coupleName ?? '');
        setWeddingDate(w.weddingDate ?? '');
        setCity(w.city ?? '');
        setStyle(w.style);
        setGuestMin(w.guestCountRange?.min?.toString() ?? '');
        setGuestMax(w.guestCountRange?.max?.toString() ?? '');
        setBudgetMin(w.budgetRange?.min?.toString() ?? '');
        setBudgetMax(w.budgetRange?.max?.toString() ?? '');
      }
      if (profile?.userRole) setUserRole(profile.userRole);
      setLoading(false);
    });
  }, [weddingId, userId]);

  const handleSave = async () => {
    if (!weddingId) return;
    if (!coupleName.trim()) { Alert.alert('Required', 'Couple name is required.'); return; }

    setSaving(true);
    try {
      if (userId && userRole) {
        await updateUserProfile(userId, { userRole });
      }
      await updateWedding(weddingId, {
        coupleName: coupleName.trim(),
        weddingDate: weddingDate.trim() || undefined,
        city: city.trim() || undefined,
        style,
        guestCountRange: guestMin && guestMax
          ? { min: parseInt(guestMin), max: parseInt(guestMax) }
          : undefined,
        budgetRange: budgetMin && budgetMax
          ? { min: parseInt(budgetMin), max: parseInt(budgetMax), currency: 'EUR' }
          : undefined,
      });
      router.back();
    } catch {
      Alert.alert('Error', 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = [
    styles.input,
    { backgroundColor: isDark ? '#1C1C1E' : '#F3F4F6', color: colors.text.primary, borderColor: isDark ? '#3A3A3C' : '#E5E7EB' },
  ];

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <ActivityIndicator style={{ flex: 1 }} color="#EC4899" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ThemedView variant="background" style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <ThemedText className="text-xl font-bold">Edit Wedding Details</ThemedText>
        <View style={{ width: 24 }} />
      </ThemedView>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 16 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >

        <ThemedText variant="secondary" className="text-xs font-semibold uppercase mb-2">I am the...</ThemedText>
        <View style={styles.roleRow}>
          {(['BRIDE', 'GROOM'] as UserRole[]).map((r) => (
            <TouchableOpacity
              key={r}
              onPress={() => setUserRole(r)}
              style={[
                styles.roleCard,
                { borderColor: userRole === r ? '#EC4899' : (isDark ? '#3A3A3C' : '#E5E7EB'), backgroundColor: userRole === r ? '#EC4899' : 'transparent' },
              ]}
            >
              <ThemedText style={{ fontSize: 28 }}>{r === 'BRIDE' ? '👰' : '🤵'}</ThemedText>
              <ThemedText className="text-sm font-semibold" style={{ color: userRole === r ? '#fff' : colors.text.primary }}>
                {r.charAt(0) + r.slice(1).toLowerCase()}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        <ThemedText variant="secondary" className="text-xs font-semibold uppercase mb-1 mt-4">Couple Name</ThemedText>
        <TextInput style={inputStyle} value={coupleName} onChangeText={setCoupleName} placeholder='e.g. "Ana & Marko"' placeholderTextColor={colors.text.muted} />

        <ThemedText variant="secondary" className="text-xs font-semibold uppercase mb-1 mt-4">Wedding Date (YYYY-MM-DD)</ThemedText>
        <TextInput style={inputStyle} value={weddingDate} onChangeText={setWeddingDate} placeholder="e.g. 2027-06-15" placeholderTextColor={colors.text.muted} keyboardType="numbers-and-punctuation" />

        <ThemedText variant="secondary" className="text-xs font-semibold uppercase mb-1 mt-4">City</ThemedText>
        <TextInput style={inputStyle} value={city} onChangeText={setCity} placeholder="e.g. Sarajevo" placeholderTextColor={colors.text.muted} />

        <ThemedText variant="secondary" className="text-xs font-semibold uppercase mb-2 mt-4">Wedding Style</ThemedText>
        <View style={styles.styleRow}>
          {STYLES.map((s) => (
            <TouchableOpacity
              key={s}
              onPress={() => setStyle(s === style ? undefined : s)}
              style={[
                styles.styleChip,
                { borderColor: style === s ? '#EC4899' : (isDark ? '#3A3A3C' : '#E5E7EB'), backgroundColor: style === s ? '#EC4899' : 'transparent' },
              ]}
            >
              <ThemedText className="text-xs font-semibold" style={{ color: style === s ? '#fff' : colors.text.secondary }}>
                {s.charAt(0) + s.slice(1).toLowerCase()}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        <ThemedText variant="secondary" className="text-xs font-semibold uppercase mb-1 mt-4">Guest Count</ThemedText>
        <View style={styles.row}>
          <TextInput style={[inputStyle, { flex: 1 }]} value={guestMin} onChangeText={setGuestMin} placeholder="Min" placeholderTextColor={colors.text.muted} keyboardType="numeric" />
          <ThemedText variant="secondary" className="mx-3 mt-3">—</ThemedText>
          <TextInput style={[inputStyle, { flex: 1 }]} value={guestMax} onChangeText={setGuestMax} placeholder="Max" placeholderTextColor={colors.text.muted} keyboardType="numeric" />
        </View>

        <ThemedText variant="secondary" className="text-xs font-semibold uppercase mb-1 mt-4">Budget (EUR)</ThemedText>
        <View style={styles.row}>
          <TextInput style={[inputStyle, { flex: 1 }]} value={budgetMin} onChangeText={setBudgetMin} placeholder="Min" placeholderTextColor={colors.text.muted} keyboardType="numeric" />
          <ThemedText variant="secondary" className="mx-3 mt-3">—</ThemedText>
          <TextInput style={[inputStyle, { flex: 1 }]} value={budgetMax} onChangeText={setBudgetMax} placeholder="Max" placeholderTextColor={colors.text.muted} keyboardType="numeric" />
        </View>

        <ThemedButton
          title={saving ? '' : 'Save Changes'}
          onPress={handleSave}
          disabled={saving}
          size="lg"
          className="mt-8"
          leftIcon={saving ? <ActivityIndicator color="#fff" size="small" /> : undefined}
        />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  scroll: { padding: 20, paddingBottom: 120 },
  input: { borderWidth: 1, borderRadius: 10, padding: 13, fontSize: 15, marginBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'center' },
  styleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  styleChip: { borderWidth: 1.5, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  roleRow: { flexDirection: 'row', gap: 12, marginBottom: 4 },
  roleCard: { flex: 1, borderWidth: 1.5, borderRadius: 14, paddingVertical: 16, alignItems: 'center', gap: 6 },
});
