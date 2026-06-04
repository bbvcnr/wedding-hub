import React, { useState } from 'react';
import {
  Modal,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/src/components/theme/themed-view';
import { ThemedButton } from '@/src/components/theme/themed-button';
import { useTheme } from '@/src/components/theme/theme-provider';
import { useAuth } from '@/src/context/AuthContext';
import { addInquiry } from '@/src/services/weddingService';

interface Props {
  visible: boolean;
  vendorId: string;
  vendorName: string;
  onClose: () => void;
}

export function ContactModal({ visible, vendorId, vendorName, onClose }: Props) {
  const { colors, isDark } = useTheme();
  const { weddingId } = useAuth();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!weddingId || !message.trim()) return;
    setLoading(true);
    try {
      await addInquiry(weddingId, vendorId, message.trim());
      setSent(true);
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSent(false);
    setMessage('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={handleClose} />
        <View style={[styles.sheet, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
          {/* Handle bar */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <ThemedText className="text-lg font-bold">{vendorName}</ThemedText>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>

          {sent ? (
            <View style={styles.successContainer}>
              <Ionicons name="checkmark-circle" size={56} color="#10B981" />
              <ThemedText className="text-lg font-semibold mt-4 text-center">
                Inquiry Sent!
              </ThemedText>
              <ThemedText variant="secondary" className="text-sm mt-2 text-center">
                The vendor will get back to you soon.
              </ThemedText>
              <ThemedButton title="Close" onPress={handleClose} className="mt-6" size="lg" />
            </View>
          ) : (
            <>
              <ThemedText variant="secondary" className="text-sm mb-4">
                Send a message to enquire about availability, pricing, or anything else.
              </ThemedText>

              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isDark ? '#2C2C2E' : '#F3F4F6',
                    color: colors.text.primary,
                    borderColor: isDark ? '#3A3A3C' : '#E5E7EB',
                  },
                ]}
                placeholder="Write your message here..."
                placeholderTextColor={colors.text.muted}
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />

              <View style={styles.actions}>
                <ThemedButton
                  title="Cancel"
                  variant="outline"
                  onPress={handleClose}
                  style={styles.actionBtn}
                />
                <ThemedButton
                  title={loading ? '' : 'Send Inquiry'}
                  onPress={handleSend}
                  disabled={loading || !message.trim()}
                  style={styles.actionBtn}
                  leftIcon={loading ? <ActivityIndicator color="#fff" size="small" /> : undefined}
                />
              </View>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    minHeight: 120,
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
});
