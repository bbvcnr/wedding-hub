import React, { useEffect, useState } from 'react';
import {
  ScrollView, View, TextInput, TouchableOpacity,
  ActivityIndicator, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, ThemedView } from '@/src/components/theme/themed-view';
import { ThemedButton } from '@/src/components/theme/themed-button';
import { useTheme } from '@/src/components/theme/theme-provider';
import { useAuth } from '@/src/context/AuthContext';
import { getVendorProfile, updateVendorProfile, VendorProfileData } from '@/src/services/vendorService';

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

export default function VendorProfileScreen() {
  const { colors, isDark } = useTheme();
  const { userId } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [businessName, setBusinessName] = useState('');
  const [type, setType] = useState('');
  const [city, setCity] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [mainImageUrl, setMainImageUrl] = useState('');
  const [extraImages, setExtraImages] = useState(['', '', '', '']);

  useEffect(() => {
    if (!userId) return;
    getVendorProfile(userId).then((p) => {
      if (p) {
        setBusinessName(p.businessName ?? '');
        setType(p.type ?? '');
        setCity(p.city ?? '');
        setShortDescription(p.shortDescription ?? '');
        setFullDescription(p.fullDescription ?? '');
        setPhone(p.phone ?? '');
        setEmail(p.email ?? '');
        setWebsite(p.website ?? '');
        setMainImageUrl(p.imageUrl ?? '');
        const imgs = (p as any).images ?? [];
        setExtraImages([imgs[0] ?? '', imgs[1] ?? '', imgs[2] ?? '', imgs[3] ?? '']);
      }
      setLoading(false);
    });
  }, [userId]);

  const handleSave = async () => {
    if (!userId) return;
    if (!businessName.trim()) { Alert.alert('Required', 'Business name is required.'); return; }
    setSaving(true);
    try {
      const images = extraImages.map((u) => u.trim()).filter(Boolean);
      await updateVendorProfile(userId, {
        businessName: businessName.trim(),
        type,
        city: city.trim(),
        shortDescription: shortDescription.trim(),
        fullDescription: fullDescription.trim(),
        phone: phone.trim(),
        email: email.trim(),
        website: website.trim(),
        imageUrl: mainImageUrl.trim() || undefined,
        images: images.length > 0 ? images : undefined,
      } as any);
      Alert.alert('Saved', 'Your profile has been updated.');
    } catch {
      Alert.alert('Error', 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = [styles.input, {
    backgroundColor: isDark ? '#1C1C1E' : '#F3F4F6',
    color: colors.text.primary,
    borderColor: isDark ? '#3A3A3C' : '#E5E7EB',
  }];

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <ActivityIndicator style={{ flex: 1 }} color="#EC4899" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'left', 'right']}>
      <ThemedView variant="background" style={styles.header}>
        <ThemedText className="text-2xl font-bold">Business Profile</ThemedText>
      </ThemedView>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        <Label text="Business Name *" colors={colors} />
        <TextInput style={inputStyle} value={businessName} onChangeText={setBusinessName} placeholder="Your business name" placeholderTextColor={colors.text.muted} />

        <Label text="Category" colors={colors} />
        <View style={styles.chips}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.value}
              onPress={() => setType(cat.value)}
              style={[styles.chip, {
                borderColor: type === cat.value ? '#EC4899' : (isDark ? '#3A3A3C' : '#E5E7EB'),
                backgroundColor: type === cat.value ? '#EC4899' : 'transparent',
              }]}
            >
              <ThemedText className="text-xs font-semibold" style={{ color: type === cat.value ? '#fff' : colors.text.secondary }}>
                {cat.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        <Label text="City" colors={colors} />
        <TextInput style={inputStyle} value={city} onChangeText={setCity} placeholder="e.g. Sarajevo" placeholderTextColor={colors.text.muted} />

        <Label text="Short Description" colors={colors} />
        <TextInput
          style={[inputStyle, { minHeight: 70, textAlignVertical: 'top' }]}
          value={shortDescription}
          onChangeText={setShortDescription}
          placeholder="One sentence about your business"
          placeholderTextColor={colors.text.muted}
          multiline
        />

        <Label text="Full Description" colors={colors} />
        <TextInput
          style={[inputStyle, { minHeight: 120, textAlignVertical: 'top' }]}
          value={fullDescription}
          onChangeText={setFullDescription}
          placeholder="Detailed description of your services, experience, packages..."
          placeholderTextColor={colors.text.muted}
          multiline
        />

        <Label text="Phone" colors={colors} />
        <TextInput style={inputStyle} value={phone} onChangeText={setPhone} placeholder="+387 61 123 456" placeholderTextColor={colors.text.muted} keyboardType="phone-pad" />

        <Label text="Email" colors={colors} />
        <TextInput style={inputStyle} value={email} onChangeText={setEmail} placeholder="contact@yourbusiness.com" placeholderTextColor={colors.text.muted} autoCapitalize="none" keyboardType="email-address" />

        <Label text="Website" colors={colors} />
        <TextInput style={inputStyle} value={website} onChangeText={setWebsite} placeholder="www.yourbusiness.com" placeholderTextColor={colors.text.muted} autoCapitalize="none" />

        <Label text="Main Photo URL" colors={colors} />
        <TextInput style={inputStyle} value={mainImageUrl} onChangeText={setMainImageUrl} placeholder="https://... (your main profile image)" placeholderTextColor={colors.text.muted} autoCapitalize="none" />

        <Label text="Gallery Photos (up to 4 URLs)" colors={colors} />
        {extraImages.map((url, i) => (
          <TextInput
            key={i}
            style={[inputStyle, { marginBottom: 8 }]}
            value={url}
            onChangeText={(v) => setExtraImages((prev) => { const a = [...prev]; a[i] = v; return a; })}
            placeholder={`Photo ${i + 1} URL`}
            placeholderTextColor={colors.text.muted}
            autoCapitalize="none"
          />
        ))}

        <ThemedButton
          title={saving ? '' : 'Save Profile'}
          onPress={handleSave}
          disabled={saving}
          size="lg"
          className="mt-6"
          leftIcon={saving ? <ActivityIndicator color="#fff" size="small" /> : undefined}
        />

      </ScrollView>
    </SafeAreaView>
  );
}

function Label({ text, colors }: { text: string; colors: any }) {
  return (
    <ThemedText variant="secondary" style={{ fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, marginTop: 18 }}>
      {text}
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingVertical: 16 },
  scroll: { padding: 20, paddingTop: 4, paddingBottom: 100 },
  input: { borderWidth: 1, borderRadius: 12, padding: 13, fontSize: 15, marginBottom: 4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1.5, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
});
