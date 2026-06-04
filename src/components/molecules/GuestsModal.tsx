import React, { useState } from 'react';
import { Modal, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/src/components/theme/themed-view';
import { ThemedButton } from '@/src/components/theme/themed-button';
import { useTheme } from '@/src/components/theme/theme-provider';
import { useAuth } from '@/src/context/AuthContext';
import { updateWedding } from '@/src/services/weddingService';
import { Wedding } from '@/src/types/profile';

interface Props {
  visible: boolean;
  wedding: Wedding | null;
  onClose: () => void;
  onSaved: (data: Partial<Wedding>) => void;
}

export function GuestsModal({ visible, wedding, onClose, onSaved }: Props) {
  const { colors, isDark } = useTheme();
  const { weddingId } = useAuth();
  const [totalGuests, setTotalGuests] = useState(wedding?.totalGuests?.toString() ?? '');
  const [numberOfTables, setNumberOfTables] = useState(wedding?.numberOfTables?.toString() ?? '');
  const [vipTables, setVipTables] = useState(wedding?.vipTables?.toString() ?? '');
  const [saving, setSaving] = useState(false);

  const guestsPerTable = totalGuests && numberOfTables && Number(numberOfTables) > 0
    ? Math.round(Number(totalGuests) / Number(numberOfTables))
    : null;

  const handleSave = async () => {
    if (!weddingId) return;
    setSaving(true);
    const data: Partial<Wedding> = {
      totalGuests: totalGuests ? Number(totalGuests) : undefined,
      numberOfTables: numberOfTables ? Number(numberOfTables) : undefined,
      vipTables: vipTables ? Number(vipTables) : undefined,
    };
    await updateWedding(weddingId, data);
    onSaved(data);
    setSaving(false);
    onClose();
  };

  const inputStyle = [styles.input, { backgroundColor: isDark ? '#2C2C2E' : '#F3F4F6', color: colors.text.primary, borderColor: isDark ? '#3A3A3C' : '#E5E7EB' }];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={[styles.sheet, { backgroundColor: isDark ? '#1C1C1E' : '#fff' }]}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <ThemedText className="text-lg font-bold">Guests & Seating</ThemedText>
            <TouchableOpacity onPress={onClose}><Ionicons name="close" size={24} color={colors.text.secondary} /></TouchableOpacity>
          </View>

          <Row label="Total guests">
            <TextInput style={inputStyle} value={totalGuests} onChangeText={setTotalGuests} placeholder="e.g. 150" placeholderTextColor={colors.text.muted} keyboardType="numeric" />
          </Row>
          <Row label="Number of tables">
            <TextInput style={inputStyle} value={numberOfTables} onChangeText={setNumberOfTables} placeholder="e.g. 15" placeholderTextColor={colors.text.muted} keyboardType="numeric" />
          </Row>
          <Row label="VIP / reserved tables">
            <TextInput style={inputStyle} value={vipTables} onChangeText={setVipTables} placeholder="e.g. 2" placeholderTextColor={colors.text.muted} keyboardType="numeric" />
          </Row>

          {guestsPerTable !== null && (
            <View style={[styles.calcRow, { backgroundColor: isDark ? '#2C2C2E' : '#F9F0F4' }]}>
              <ThemedText variant="secondary" className="text-sm">Guests per table</ThemedText>
              <ThemedText className="text-base font-bold" style={{ color: '#EC4899' }}>{guestsPerTable}</ThemedText>
            </View>
          )}

          <View style={styles.actions}>
            <ThemedButton title="Cancel" variant="outline" onPress={onClose} style={styles.btn} />
            <ThemedButton title={saving ? '' : 'Save'} onPress={handleSave} disabled={saving} style={styles.btn}
              leftIcon={saving ? <ActivityIndicator color="#fff" size="small" /> : undefined} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.row}>
      <ThemedText variant="secondary" className="text-sm" style={{ width: 160 }}>{label}</ThemedText>
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  handle: { width: 40, height: 4, backgroundColor: '#D1D5DB', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderRadius: 10, padding: 10, fontSize: 15 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  calcRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 12, padding: 14, marginBottom: 20 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  btn: { flex: 1 },
});
