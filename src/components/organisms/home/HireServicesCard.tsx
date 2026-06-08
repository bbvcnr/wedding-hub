import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedButton } from '@/src/components/theme/themed-button';
import { ThemedText, ThemedView } from '@/src/components/theme/themed-view';
import { useTheme } from '@/src/components/theme/theme-provider';
import { HireService } from '@/src/types/home';

interface HireServicesCardProps {
  service: HireService;
  onPress?: () => void;
  index?: number;
}

const ACCENT_SEQUENCE: Array<'pink' | 'blue' | 'green'> = ['blue', 'pink', 'green'];

export function HireServicesCard({ service, onPress, index = 0 }: HireServicesCardProps) {
  const { colors } = useTheme();
  const accentKey = ACCENT_SEQUENCE[index % ACCENT_SEQUENCE.length];
  const accentColor = colors.accent[accentKey];

  return (
    <ThemedView variant="card" style={{ borderRadius: 16, padding: 16, borderLeftWidth: 3, borderLeftColor: accentColor }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
        <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: accentColor + '18', alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="sparkles-outline" size={20} color={accentColor} />
        </View>
        <View style={{ flex: 1 }}>
          <ThemedText style={{ fontSize: 16, fontWeight: '700' }}>{service.title}</ThemedText>
          <ThemedText variant="secondary" style={{ marginTop: 4, fontSize: 13, lineHeight: 19 }}>
            {service.description}
          </ThemedText>
        </View>
      </View>
      <View className="mt-4">
        <ThemedButton title={service.actionLabel} variant="primary" color={accentKey} onPress={onPress} />
      </View>
    </ThemedView>
  );
}
