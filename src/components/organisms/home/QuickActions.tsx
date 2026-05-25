import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedButton } from '@/src/components/theme/themed-button';
import { useTheme } from '@/src/components/theme/theme-provider';
import { QuickAction } from '@/src/types/home';

interface QuickActionsProps {
  actions: QuickAction[];
  onPress: (route: string) => void;
}

export function QuickActions({ actions, onPress }: QuickActionsProps) {
  const { colors } = useTheme();

  return (
    <View className="gap-2">
      {actions.map((action) => (
        <ThemedButton
          key={action.id}
          title={action.label}
          variant={action.color === 'neutral' ? 'outline' : 'primary'}
          color={action.color === 'neutral' ? 'pink' : action.color}
          leftIcon={
            <Ionicons
              name={action.icon as any}
              size={18}
              color={action.color === 'neutral' ? colors.accent.pink : '#FFFFFF'}
            />
          }
          onPress={() => onPress(action.route)}
        />
      ))}
    </View>
  );
}
