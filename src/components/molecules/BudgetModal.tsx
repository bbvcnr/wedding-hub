import React, { useState } from 'react';
import { Modal, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/src/components/theme/themed-view';
import { ThemedButton } from '@/src/components/theme/themed-button';
import { useTheme } from '@/src/components/theme/theme-provider';
import { useAuth } from '@/src/context/AuthContext';
import { updateWedding } from '@/src/services/weddingService';
import { Wedding } from '@/src/types/profile';

const CURRENCIES = ['EUR', 'USD', 'BAM'] as const;
type Currency = typeof CURRENCIES[number];

interface Props {
  visible: boolean;
  wedding: Wedding | null;
  onClose: () => void;
  onSaved: (data: Partial<Wedding>) => void;
}

export function BudgetModal({ visible, wedding, onClose, onSaved }: Props) {
  const { colors, isDark } = useTheme();
  const { weddingId } = useAuth();
  const [totalBudget, setTotalBudget] = useState(wedding?.totalBudget?.toString() ?? '');
  const [spentBudget, setSpentBudget] = useState(wedding?.spentBudget?.toString() ?? '');
  const [currency, setCurrency] = useState<Currency>(wedding?.budgetCurrency ?? 'EUR');
  const [saving, setSaving] = useState(false);

  const remaining = totalBudget && spentBudget
    ? Number(totalBudget) - Number(spentBudget)
    : null;
  const overBudget = remaining !== null && remaining < 0;

  const handleSave = async () => {
    if (!weddingId) return;
    setSaving(true);
    const data: Partial<Wedding> = {
      totalBudget: totalBudget ? Number(totalBudget) : undefined,
      spentBudget: spentBudget ? Number(spentBudget) : undefined,
      budgetCurrency: currency,
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
            <ThemedText className="text-lg font-bold">Budget Tracker</ThemedText>
            <TouchableOpacity onPress={onClose}><Ionicons name="close" size={24} color={colors.text.secondary} /></TouchableOpacity>
          </View>

          {/* Currency selector */}
          <ThemedText variant="secondary" className="text-xs font-semibold uppercase mb-2">Currency</ThemedText>
          <View style={styles.currencyRow}>
            {CURRENCIES.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => setCurrency(c)}
                style={[styles.currencyChip, { borderColor: currency === c ? '#EC4899' : (isDark ? '#3A3A3C' : '#E5E7EB'), backgroundColor: currency === c ? '#EC4899' : 'transparent' }]}
              >
                <ThemedText className="text-sm font-semibold" style={{ color: currency === c ? '#fff' : colors.text.secondary }}>{c}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>

          <ThemedText variant="secondary" className="text-xs font-semibold uppercase mb-2 mt-4">Total Budget</ThemedText>
          <TextInput style={inputStyle} value={totalBudget} onChangeText={setTotalBudget} placeholder={`e.g. 15000 ${currency}`} placeholderTextColor={colors.text.muted} keyboardType="numeric" />

          <ThemedText variant="secondary" className="text-xs font-semibold uppercase mb-2 mt-3">Already Spent</ThemedText>
          <TextInput style={inputStyle} value={spentBudget} onChangeText={setSpentBudget} placeholder="0" placeholderTextColor={colors.text.muted} keyboardType="numeric" />

          {remaining !== null && (
            <View style={[styles.calcRow, { backgroundColor: overBudget ? '#FEF2F2' : (isDark ? '#2C2C2E' : '#F0FDF4') }]}>
              <ThemedText variant="secondary" className="text-sm">Remaining</ThemedText>
              <ThemedText className="text-base font-bold" style={{ color: overBudget ? '#EF4444' : '#10B981' }}>
                {overBudget ? '-' : ''}{currency} {Math.abs(remaining).toLocaleString()}
              </ThemedText>
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

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  handle: { width: 40, height: 4, backgroundColor: '#D1D5DB', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 15, marginBottom: 4 },
  currencyRow: { flexDirection: 'row', gap: 8 },
  currencyChip: { borderWidth: 1.5, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 7 },
  calcRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 12, padding: 14, marginTop: 16, marginBottom: 4 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 16 },
  btn: { flex: 1 },
});
