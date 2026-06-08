import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText, ThemedView } from '@/src/components/theme/themed-view';
import { useTheme } from '@/src/components/theme/theme-provider';
import { useAuth } from '@/src/context/AuthContext';
import { getUserProfile, updateUserProfile } from '@/src/services/userService';

const serialize = (value: string[]) => value.join(', ');
const deserialize = (value: string) => value.split(',').map((v) => v.trim()).filter(Boolean);

export default function OrganizerProfileScreen() {
  const { colors, isDark } = useTheme();
  const { userId, user, logout, refreshProfile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferredTypes, setPreferredTypes] = useState('');
  const [preferredCities, setPreferredCities] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!userId) return;
      const profile = await getUserProfile(userId);
      const prefs = profile?.organizerPreferences;
      setPreferredTypes(serialize(prefs?.preferredWeddingTypes ?? []));
      setPreferredCities(serialize(prefs?.preferredCities ?? []));
      setBio(prefs?.bio ?? '');
      setLoading(false);
    };
    load();
  }, [userId]);

  const inputStyle = {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginTop: 6,
    backgroundColor: isDark ? '#1C1C1E' : '#F3F4F6',
    color: colors.text.primary,
    borderColor: isDark ? '#3A3A3C' : '#E5E7EB',
  } as const;

  const onSave = async () => {
    if (!userId) return;
    setSaving(true);
    await updateUserProfile(userId, {
      organizerPreferences: {
        preferredWeddingTypes: deserialize(preferredTypes),
        preferredCities: deserialize(preferredCities),
        bio: bio.trim(),
      },
    });
    await refreshProfile();
    setSaving(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.accent.pink} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        <ThemedText style={{ fontSize: 28, fontWeight: '800' }}>Organizer Profile</ThemedText>
        <ThemedText variant="secondary" style={{ marginTop: 6 }}>{user?.email || ''}</ThemedText>

        <ThemedView variant="card" style={{ marginTop: 18, borderRadius: 16, padding: 16 }}>
          <ThemedText className="font-semibold">Preferred wedding types</ThemedText>
          <TextInput
            style={inputStyle}
            value={preferredTypes}
            onChangeText={setPreferredTypes}
            placeholder="Modern, Rustic, Luxury"
            placeholderTextColor={colors.text.muted}
          />

          <ThemedText className="font-semibold" style={{ marginTop: 14 }}>Preferred cities</ThemedText>
          <TextInput
            style={inputStyle}
            value={preferredCities}
            onChangeText={setPreferredCities}
            placeholder="Sarajevo, Mostar"
            placeholderTextColor={colors.text.muted}
          />

          <ThemedText className="font-semibold" style={{ marginTop: 14 }}>Bio</ThemedText>
          <TextInput
            style={[inputStyle, { minHeight: 90, textAlignVertical: 'top' }]}
            multiline
            value={bio}
            onChangeText={setBio}
            placeholder="Tell couples about your expertise."
            placeholderTextColor={colors.text.muted}
          />

          <TouchableOpacity
            disabled={saving}
            onPress={onSave}
            style={{ marginTop: 16, borderRadius: 10, paddingVertical: 12, alignItems: 'center', backgroundColor: colors.accent.pink }}
          >
            {saving
              ? <ActivityIndicator size="small" color="#fff" />
              : <ThemedText style={{ color: '#fff', fontWeight: '700' }}>Save Profile</ThemedText>}
          </TouchableOpacity>
        </ThemedView>

        <TouchableOpacity
          onPress={logout}
          style={{ marginTop: 16, borderRadius: 10, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: '#EF4444' }}
        >
          <ThemedText style={{ color: '#EF4444', fontWeight: '700' }}>Log Out</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
