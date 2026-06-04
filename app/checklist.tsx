import React, { useState, useEffect, useCallback } from 'react';
import {
  View, TextInput, TouchableOpacity, FlatList,
  StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, ThemedView } from '@/src/components/theme/themed-view';
import { useTheme } from '@/src/components/theme/theme-provider';
import { useAuth } from '@/src/context/AuthContext';
import { getChecklist, addChecklistItem, toggleChecklistItem, deleteChecklistItem } from '@/src/services/weddingService';
import { ChecklistItem } from '@/src/types/profile';

const SUGGESTIONS = [
  'Book a venue', 'Find a photographer', 'Find a videographer',
  'Book catering', 'Find a hairstylist', 'Find a make-up artist',
  'Choose wedding dress / suit', 'Book music / DJ', 'Choose flowers & florist',
  'Send invitations', 'Arrange transportation', 'Book honeymoon',
  'Choose wedding cake', 'Plan seating chart', 'Buy wedding rings',
];

export default function ChecklistScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { weddingId } = useAuth();
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    if (!weddingId) return;
    const data = await getChecklist(weddingId).catch(() => []);
    setItems(data);
    setLoading(false);
  }, [weddingId]);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async (value = text) => {
    if (!weddingId || !value.trim()) return;
    setAdding(true);
    const item = await addChecklistItem(weddingId, value.trim());
    setItems((prev) => [...prev, item]);
    setText('');
    setAdding(false);
  };

  const handleToggle = async (item: ChecklistItem) => {
    if (!weddingId) return;
    await toggleChecklistItem(weddingId, item.id, !item.done);
    setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, done: !i.done } : i));
  };

  const handleDelete = (item: ChecklistItem) => {
    Alert.alert('Delete', `Remove "${item.text}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          if (!weddingId) return;
          await deleteChecklistItem(weddingId, item.id);
          setItems((prev) => prev.filter((i) => i.id !== item.id));
        },
      },
    ]);
  };

  const done = items.filter((i) => i.done).length;
  const total = items.length;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  const existingTexts = new Set(items.map((i) => i.text.toLowerCase()));
  const filteredSuggestions = SUGGESTIONS.filter((s) => !existingTexts.has(s.toLowerCase()));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

        {/* Header */}
        <ThemedView variant="background" style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <ThemedText className="text-2xl font-semibold">My Checklist</ThemedText>
          <ThemedText variant="secondary" className="text-sm">{done}/{total}</ThemedText>
        </ThemedView>

        {/* Progress bar */}
        {total > 0 && (
          <ThemedView variant="background" style={styles.progressContainer}>
            <View style={[styles.progressTrack, { backgroundColor: isDark ? '#2C2C2E' : '#F3F4F6' }]}>
              <View style={[styles.progressFill, { width: `${percent}%` }]} />
            </View>
            <ThemedText variant="secondary" className="text-xs ml-3">{percent}%</ThemedText>
          </ThemedView>
        )}

        {/* Add input */}
        <ThemedView variant="background" style={styles.addRow}>
          <TextInput
            style={[styles.addInput, { backgroundColor: isDark ? '#1C1C1E' : '#F3F4F6', color: colors.text.primary, borderColor: isDark ? '#3A3A3C' : '#E5E7EB' }]}
            value={text}
            onChangeText={setText}
            placeholder="Add a new task..."
            placeholderTextColor={colors.text.muted}
            onSubmitEditing={() => handleAdd()}
            returnKeyType="done"
          />
          <TouchableOpacity
            onPress={() => handleAdd()}
            disabled={!text.trim() || adding}
            style={[styles.addBtn, { opacity: text.trim() ? 1 : 0.4 }]}
          >
            {adding ? <ActivityIndicator color="#fff" size="small" /> : <Ionicons name="add" size={22} color="#fff" />}
          </TouchableOpacity>
        </ThemedView>

        {loading ? (
          <ThemedView variant="background" className="flex-1 items-center justify-center">
            <ActivityIndicator color={colors.accent.pink} />
          </ThemedView>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(i) => i.id}
            contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleToggle(item)} activeOpacity={0.8}>
                <ThemedView
                  variant="card"
                  style={[styles.item, { opacity: item.done ? 0.6 : 1 }]}
                >
                  <Ionicons
                    name={item.done ? 'checkmark-circle' : 'ellipse-outline'}
                    size={24}
                    color={item.done ? '#10B981' : colors.text.muted}
                  />
                  <ThemedText
                    className="flex-1 ml-3 text-base"
                    style={{ textDecorationLine: item.done ? 'line-through' : 'none' }}
                  >
                    {item.text}
                  </ThemedText>
                  <TouchableOpacity onPress={() => handleDelete(item)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Ionicons name="trash-outline" size={18} color={colors.text.muted} />
                  </TouchableOpacity>
                </ThemedView>
              </TouchableOpacity>
            )}
            ListFooterComponent={filteredSuggestions.length > 0 ? (
              <View style={styles.suggestionsBlock}>
                <ThemedText variant="secondary" className="text-xs font-semibold uppercase mb-3">
                  Suggested tasks
                </ThemedText>
                <View style={styles.suggestions}>
                  {filteredSuggestions.slice(0, 8).map((s) => (
                    <TouchableOpacity
                      key={s}
                      onPress={() => handleAdd(s)}
                      style={[styles.chip, { borderColor: isDark ? '#3A3A3C' : '#E5E7EB', backgroundColor: isDark ? '#1C1C1E' : '#F9F9F9' }]}
                    >
                      <Ionicons name="add-circle-outline" size={14} color="#EC4899" />
                      <ThemedText variant="secondary" className="text-xs ml-1">{s}</ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : null}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  progressContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 8 },
  progressTrack: { flex: 1, height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#EC4899', borderRadius: 3 },
  addRow: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 12, gap: 8 },
  addInput: { flex: 1, borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, fontSize: 15 },
  addBtn: { width: 46, height: 46, borderRadius: 12, backgroundColor: '#EC4899', alignItems: 'center', justifyContent: 'center' },
  item: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 14, marginBottom: 8 },
  suggestionsBlock: { paddingTop: 24 },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
});
