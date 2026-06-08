import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView,
  ActivityIndicator, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SlideBackground } from '@/src/components/SlideBackground';
import { useAuth, AccountType } from '@/src/context/AuthContext';

function getAuthError(code: string): string {
  switch (code) {
    case 'auth/email-already-in-use': return 'An account with this email already exists.';
    case 'auth/invalid-email': return 'Invalid email address.';
    case 'auth/weak-password': return 'Password must be at least 6 characters.';
    default: return 'Something went wrong. Please try again.';
  }
}

export default function RegisterScreen() {
  const { register } = useAuth();
  const router = useRouter();

  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const namePlaceholder =
    accountType === 'VENDOR'
      ? 'Business name'
      : accountType === 'ORGANIZER'
        ? 'Full name'
        : 'Couple name (e.g. "Ana & Marko")';

  const handleRegister = async () => {
    if (!accountType) { setError('Please select your account type.'); return; }
    if (!name.trim()) {
      setError(`Please enter your ${accountType === 'VENDOR' ? 'business name' : accountType === 'ORGANIZER' ? 'name' : 'couple name'}.`);
      return;
    }
    if (!email.trim()) { setError('Please enter your email.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setError('');
    setLoading(true);
    try {
      await register(email.trim(), password, name.trim(), accountType);
    } catch (e: any) {
      setError(getAuthError(e?.code ?? ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SlideBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>Who are you?</Text>

            {/* Account type selection */}
            <View style={styles.typeRow}>
              <TypeCard
                label="Planning a wedding"
                emoji="💍"
                selected={accountType === 'CLIENT'}
                onPress={() => setAccountType('CLIENT')}
              />
              <TypeCard
                label="I'm a vendor"
                emoji="🏪"
                selected={accountType === 'VENDOR'}
                onPress={() => setAccountType('VENDOR')}
              />
              <TypeCard
                label="I'm an organizer"
                emoji="🗓️"
                selected={accountType === 'ORGANIZER'}
                onPress={() => setAccountType('ORGANIZER')}
              />
            </View>

            <TextInput
              style={styles.input}
              placeholder={namePlaceholder}
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={name}
              onChangeText={setName}
              autoCapitalize={accountType === 'VENDOR' ? 'words' : 'words'}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
            <TextInput
              style={styles.input}
              placeholder="Password (min. 6 characters)"
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="new-password"
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.button, { opacity: loading ? 0.7 : 1 }]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.buttonText}>Create Account</Text>
              }
            </TouchableOpacity>

            <View style={styles.switchRow}>
              <Text style={styles.switchText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.switchLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SlideBackground>
  );
}

function TypeCard({ label, emoji, selected, onPress }: { label: string; emoji: string; selected: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.typeCard, selected && styles.typeCardSelected]}
    >
      <Text style={styles.typeEmoji}>{emoji}</Text>
      <Text style={[styles.typeLabel, { color: selected ? '#fff' : 'rgba(255,255,255,0.8)' }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 28, paddingBottom: 48 },
  title: { fontSize: 34, fontWeight: '700', color: '#FFFFFF', marginBottom: 6 },
  subtitle: { fontSize: 15, color: 'rgba(255,255,255,0.75)', marginBottom: 20 },
  typeRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  typeCard: {
    flex: 1, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 16, paddingVertical: 18, alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  typeCardSelected: { borderColor: '#EC4899', backgroundColor: '#EC4899' },
  typeEmoji: { fontSize: 30 },
  typeLabel: { fontSize: 13, fontWeight: '600', textAlign: 'center' },
  input: {
    backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)', borderRadius: 12,
    padding: 14, fontSize: 16, color: '#FFFFFF', marginBottom: 12,
  },
  error: { color: '#FCA5A5', fontSize: 13, marginBottom: 12 },
  button: { backgroundColor: '#EC4899', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 4 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  switchText: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  switchLink: { color: '#F9A8D4', fontSize: 14, fontWeight: '600' },
});
