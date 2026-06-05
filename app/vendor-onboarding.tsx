import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, ActivityIndicator, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/src/context/AuthContext';
import { useTheme } from '@/src/components/theme/theme-provider';

const CATEGORIES = [
  { label: 'Venue', value: 'VENUE' },
  { label: 'Photography', value: 'PHOTOGRAPHY' },
  { label: 'Videography', value: 'VIDEOGRAPHY' },
  { label: 'Catering', value: 'CATERING' },
  { label: 'Florist', value: 'FLORIST' },
  { label: 'Music / DJ', value: 'DJ' },
  { label: 'Beauty', value: 'BEAUTY' },
  { label: 'Planning', value: 'WEDDING_ORGANIZER' },
  { label: 'Transportation', value: 'LUXURY_CAR' },
  { label: 'Decoration', value: 'DECORATOR' },
];

export default function VendorOnboardingScreen() {
  const { completeVendorOnboarding } = useAuth();
  const { colors, isDark } = useTheme();

  const [businessName, setBusinessName] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  const canProceed = businessName.trim() && selectedType && city.trim();

  const handleStart = async () => {
    if (!canProceed) { Alert.alert('Required', 'Please fill in business name, category and city.'); return; }
    setSaving(true);
    try {
      await completeVendorOnboarding(businessName.trim(), selectedType, city.trim(), description.trim(), phone.trim());
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      setSaving(false);
    }
  };

  const inputStyle = [styles.input, {
    backgroundColor: isDark ? '#1C1C1E' : '#F3F4F6',
    color: colors.text.primary,
    borderColor: isDark ? '#3A3A3C' : '#E5E7EB',
  }];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          <View style={styles.headerBlock}>
            <Text style={styles.emoji}>🏪</Text>
            <Text style={[styles.title, { color: colors.text.primary }]}>Set up your business</Text>
            <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
              Tell couples what you offer so they can find and contact you.
            </Text>
          </View>

          <Text style={[styles.label, { color: colors.text.secondary }]}>Business Name *</Text>
          <TextInput style={inputStyle} value={businessName} onChangeText={setBusinessName} placeholder="e.g. Lumière Studio" placeholderTextColor={colors.text.muted} />

          <Text style={[styles.label, { color: colors.text.secondary }]}>Category *</Text>
          <View style={styles.chips}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.value}
                onPress={() => setSelectedType(cat.value)}
                style={[styles.chip, {
                  borderColor: selectedType === cat.value ? '#EC4899' : (isDark ? '#3A3A3C' : '#E5E7EB'),
                  backgroundColor: selectedType === cat.value ? '#EC4899' : 'transparent',
                }]}
              >
                <Text style={{ fontSize: 13, fontWeight: '600', color: selectedType === cat.value ? '#fff' : colors.text.secondary }}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.label, { color: colors.text.secondary }]}>City *</Text>
          <TextInput style={inputStyle} value={city} onChangeText={setCity} placeholder="e.g. Sarajevo" placeholderTextColor={colors.text.muted} />

          <Text style={[styles.label, { color: colors.text.secondary }]}>Short Description <Text style={{ color: colors.text.muted }}>(optional)</Text></Text>
          <TextInput
            style={[inputStyle, { minHeight: 80, textAlignVertical: 'top' }]}
            value={description}
            onChangeText={setDescription}
            placeholder="What makes your business special?"
            placeholderTextColor={colors.text.muted}
            multiline
          />

          <Text style={[styles.label, { color: colors.text.secondary }]}>Phone <Text style={{ color: colors.text.muted }}>(optional)</Text></Text>
          <TextInput style={inputStyle} value={phone} onChangeText={setPhone} placeholder="+387 61 123 456" placeholderTextColor={colors.text.muted} keyboardType="phone-pad" />

          <TouchableOpacity
            style={[styles.button, { opacity: canProceed && !saving ? 1 : 0.5 }]}
            onPress={handleStart}
            disabled={!canProceed || saving}
            activeOpacity={0.85}
          >
            {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Go to My Dashboard 🚀</Text>}
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: 24, paddingBottom: 48 },
  headerBlock: { alignItems: 'center', marginBottom: 28 },
  emoji: { fontSize: 48, marginBottom: 10 },
  title: { fontSize: 26, fontWeight: '700', textAlign: 'center', marginBottom: 6 },
  subtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  label: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, marginTop: 18 },
  input: { borderWidth: 1, borderRadius: 12, padding: 13, fontSize: 15, marginBottom: 4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  chip: { borderWidth: 1.5, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  button: { marginTop: 28, backgroundColor: '#EC4899', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
