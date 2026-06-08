import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { QuickAction } from '@/src/types/home';
import { useTheme } from '@/src/components/theme/theme-provider';

interface QuickActionsProps {
  actions: QuickAction[];
  onPress: (route: string) => void;
}

const BG: Record<string, string> = {
  pink:    '#EC4899',
  blue:    '#3B82F6',
  green:   '#14B8A6',
  neutral: '#6B7280',
};

export function QuickActions({ actions, onPress }: QuickActionsProps) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
      {actions.map((action) => {
        const bg = BG[action.color] ?? BG.neutral;
        return (
          <TouchableOpacity
            key={action.id}
            onPress={() => onPress(action.route)}
            activeOpacity={0.82}
            style={{
              flex: 1,
              minWidth: 140,
              borderRadius: 18,
              backgroundColor: bg,
              padding: 18,
              minHeight: 110,
              justifyContent: 'space-between',
            }}
          >
            <View style={{ width: 28, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.45)', marginBottom: 12 }} />
            <Ionicons name={action.icon as any} size={22} color="rgba(255,255,255,0.7)" />
            <Text style={{ color: '#fff', fontSize: 15, fontWeight: '800', marginTop: 10, lineHeight: 21 }}>
              {action.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
