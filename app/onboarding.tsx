import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView,
  ActivityIndicator, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/src/context/AuthContext';
import { useTheme } from '@/src/components/theme/theme-provider';

type Role = 'BRIDE' | 'GROOM';

export default function OnboardingScreen() {
  const { completeOnboarding } = useAuth();
  const { colors, isDark } = useTheme();

  const [role, setRole] = useState<Role | null>(null);
  const [city, setCity] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [saving, setSaving] = useState(false);

  const canProceed = !!role;

  const handleStart = async () => {
    if (!role) { Alert.alert('Required', 'Please select Bride or Groom.'); return; }
    setSaving(true);
    try {
      await completeOnboarding(role, city, weddingDate);
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      setSaving(false);
    }
  };

  const inputStyle = [
    styles.input,
    {
      backgroundColor: isDark ? '#1C1C1E' : '#F3F4F6',
      color: colors.text.primary,
      borderColor: isDark ? '#3A3A3C' : '#E5E7EB',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          {/* Header */}
          <View style={styles.headerBlock}>
            <Text style={[styles.emoji]}>💍</Text>
            <Text style={[styles.title, { color: colors.text.primary }]}>Almost there!</Text>
            <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
              Tell us a little about yourself so we can personalise your experience.
            </Text>
          </View>

          {/* Role selection */}
          <Text style={[styles.label, { color: colors.text.secondary }]}>I am the...</Text>
          <View style={styles.roleRow}>
            <RoleCard
              label="Bride"
              emoji="👰"
              selected={role === 'BRIDE'}
              onPress={() => setRole('BRIDE')}
              isDark={isDark}
              colors={colors}
            />
            <RoleCard
              label="Groom"
              emoji="🤵"
              selected={role === 'GROOM'}
              onPress={() => setRole('GROOM')}
              isDark={isDark}
              colors={colors}
            />
          </View>

          {/* City */}
          <Text style={[styles.label, { color: colors.text.secondary }]}>
            Wedding City <Text style={{ color: colors.text.muted }}>(optional)</Text>
          </Text>
          <TextInput
            style={inputStyle}
            value={city}
            onChangeText={setCity}
            placeholder="e.g. Sarajevo"
            placeholderTextColor={colors.text.muted}
          />

          {/* Wedding Date */}
          <Text style={[styles.label, { color: colors.text.secondary }]}>
            Wedding Date <Text style={{ color: colors.text.muted }}>(optional)</Text>
          </Text>
          <TextInput
            style={inputStyle}
            value={weddingDate}
            onChangeText={setWeddingDate}
            placeholder="YYYY-MM-DD (e.g. 2027-06-15)"
            placeholderTextColor={colors.text.muted}
            keyboardType="numbers-and-punctuation"
          />

          {/* CTA */}
          <TouchableOpacity
            style={[
              styles.button,
              { opacity: canProceed && !saving ? 1 : 0.5 },
            ]}
            onPress={handleStart}
            disabled={!canProceed || saving}
            activeOpacity={0.85}
          >
            {saving
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.buttonText}>Let's Start Planning! 🎉</Text>
            }
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

interface RoleCardProps {
  label: string;
  emoji: string;
  selected: boolean;
  onPress: () => void;
  isDark: boolean;
  colors: any;
}

function RoleCard({ label, emoji, selected, onPress, isDark, colors }: RoleCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.roleCard,
        {
          backgroundColor: selected ? '#EC4899' : (isDark ? '#1C1C1E' : '#F3F4F6'),
          borderColor: selected ? '#EC4899' : (isDark ? '#3A3A3C' : '#E5E7EB'),
        },
      ]}
    >
      <Text style={styles.roleEmoji}>{emoji}</Text>
      <Text style={[styles.roleLabel, { color: selected ? '#fff' : colors.text.primary }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 28, paddingBottom: 48 },
  headerBlock: { alignItems: 'center', marginBottom: 36 },
  emoji: { fontSize: 48, marginBottom: 12 },
  title: { fontSize: 30, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
  label: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10, marginTop: 20 },
  roleRow: { flexDirection: 'row', gap: 16 },
  roleCard: {
    flex: 1, borderWidth: 1.5, borderRadius: 16,
    paddingVertical: 24, alignItems: 'center', gap: 8,
  },
  roleEmoji: { fontSize: 36 },
  roleLabel: { fontSize: 16, fontWeight: '600' },
  input: {
    borderWidth: 1, borderRadius: 12, padding: 14,
    fontSize: 15, marginBottom: 4,
  },
  button: {
    marginTop: 32, backgroundColor: '#EC4899', borderRadius: 14,
    paddingVertical: 16, alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
