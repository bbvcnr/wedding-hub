import React from 'react';
import { View } from 'react-native';
import { AccentColor, colors } from '@/src/utils/colors';
import { ThemedText, ThemedView } from './themed-view';

interface ColorSwatchProps {
  color: AccentColor;
  label: string;
  className?: string;
}

export function ColorSwatch({ color, label, className = '' }: ColorSwatchProps) {
  return (
    <ThemedView variant="surface" className={`flex-row items-center space-x-3 ${className}`}>
      <View 
        className="w-8 h-8 rounded-full border-2 border-gray-300 mr-4"
        style={{ 
          backgroundColor: colors.accent[color],
          borderColor: '#E5E7EB'
        }}
      />
      <ThemedView variant="surface" className="flex-1">
        <ThemedText className="font-medium">{label}</ThemedText>
        <ThemedText variant="muted" className="text-sm">
          {colors.accent[color]}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}