import React from 'react';
import { View } from 'react-native';
import { ThemedButton } from '@/src/components/theme/themed-button';
import { ThemedText, ThemedView } from '@/src/components/theme/themed-view';
import { HireService } from '@/src/types/home';

interface HireServicesCardProps {
  service: HireService;
  onPress?: () => void;
}

export function HireServicesCard({ service, onPress }: HireServicesCardProps) {
  return (
    <ThemedView variant="card" className="rounded-2xl p-4">
      <ThemedText className="text-lg font-semibold">{service.title}</ThemedText>
      <ThemedText variant="secondary" className="mt-2">
        {service.description}
      </ThemedText>
      <View className="mt-4">
        <ThemedButton title={service.actionLabel} variant="primary" color="pink" onPress={onPress} />
      </View>
    </ThemedView>
  );
}
