import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedButton } from '@/src/components/theme/themed-button';
import { SlideBackground } from '@/src/components/SlideBackground';

import { useAuth } from '@/src/context/AuthContext';

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

  const [coupleName, setCoupleName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!coupleName.trim()) {
      setError('Please enter your couple name (e.g. "Ana & Marko").');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register(email.trim(), password, coupleName.trim());
    } catch (e: any) {
      setError(getAuthError(e?.code ?? ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SlideBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>
              Start planning your perfect wedding day
            </Text>

            <TextInput
              style={styles.input}
              placeholder='Couple name (e.g. "Ana & Marko")'
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={coupleName}
              onChangeText={setCoupleName}
              autoCapitalize="words"
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

            <ThemedButton
              title={loading ? '' : 'Create Account'}
              onPress={handleRegister}
              disabled={loading}
              size="lg"
              style={styles.button}
              leftIcon={loading ? <ActivityIndicator color="#fff" size="small" /> : undefined}
            />

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

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 28,
  },
  title: {
    fontSize: 38,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 40,
    lineHeight: 22,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  error: {
    color: '#FCA5A5',
    fontSize: 13,
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  switchText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  switchLink: {
    color: '#F9A8D4',
    fontSize: 14,
    fontWeight: '600',
  },
});
