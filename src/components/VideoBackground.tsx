import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

// Free wedding stock video from Pexels (pexels.com/videos — search "wedding" to find alternatives)
const WEDDING_VIDEO_URL =
  'https://videos.pexels.com/video-files/3827368/3827368-hd_1080_1920_25fps.mp4';

interface Props {
  children: React.ReactNode;
  overlayOpacity?: number;
}

export function VideoBackground({ children, overlayOpacity = 0.55 }: Props) {
  const player = useVideoPlayer(WEDDING_VIDEO_URL, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  return (
    <View style={styles.container}>
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        allowsFullscreen={false}
        nativeControls={false}
      />
      {/* Dark overlay so text stays readable */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: `rgba(0,0,0,${overlayOpacity})` }]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
