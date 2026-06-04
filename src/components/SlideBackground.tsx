import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';

const SLIDES = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1529636444744-adffc9135a5e?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&auto=format&fit=crop',
];

const INTERVAL_MS = 4000;

interface Props {
  children: React.ReactNode;
  overlayOpacity?: number;
}

export function SlideBackground({ children, overlayOpacity = 0.5 }: Props) {
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState(1);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (current + 1) % SLIDES.length;
      setNext(nextIndex);
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }).start(() => {
        setCurrent(nextIndex);
      });
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [current]);

  return (
    <View style={styles.container}>
      <Image source={{ uri: SLIDES[current] }} style={StyleSheet.absoluteFill} resizeMode="cover" />
      <Animated.Image
        source={{ uri: SLIDES[next] }}
        style={[StyleSheet.absoluteFill, { opacity: fadeAnim }]}
        resizeMode="cover"
      />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: `rgba(0,0,0,${overlayOpacity})` }]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a0a0f' },
});
