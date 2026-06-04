import React from 'react';
import { View, StyleSheet } from 'react-native';

interface Props {
  children: React.ReactNode;
  overlayOpacity?: number;
}

// Web fallback — expo-video doesn't support web; show a dark gradient background instead.
export function VideoBackground({ children }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.gradient} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a0a0f',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#2d0a1a',
    opacity: 0.95,
  },
});
