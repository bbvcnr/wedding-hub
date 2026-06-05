import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/components/theme/theme-provider';
import { ThemedText } from '@/src/components/theme/themed-view';

function TabIcon({ focused, name, label }: { focused: boolean; name: keyof typeof Ionicons.glyphMap; label: string }) {
  if (focused) {
    return (
      <View style={styles.activeTab}>
        <Ionicons name={name} size={18} color="white" />
        <ThemedText className="text-sm font-semibold ml-2" style={{ color: 'white' }}>{label}</ThemedText>
      </View>
    );
  }
  return (
    <View style={styles.inactiveTab}>
      <Ionicons name={name} size={20} color="gray" />
    </View>
  );
}

export default function VendorLayout() {
  const { isDark } = useTheme();

  return (
    <Tabs screenOptions={{
      tabBarShowLabel: false,
      tabBarBackground: () => (
        <BlurView
          tint={isDark ? 'dark' : 'light'}
          intensity={20}
          style={[StyleSheet.absoluteFill, { backgroundColor: isDark ? 'rgba(31,31,31,0.9)' : 'rgba(248,250,252,0.9)' }]}
        />
      ),
      tabBarItemStyle: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
      tabBarStyle: {
        backgroundColor: 'transparent', borderRadius: 50,
        marginHorizontal: 20, marginBottom: 20, height: 52,
        position: 'absolute', overflow: 'hidden',
        borderWidth: 1, borderColor: isDark ? '#333333' : 'white',
      },
    }}>
      <Tabs.Screen name="dashboard" options={{
        headerShown: false,
        tabBarIcon: ({ focused }) => <TabIcon focused={focused} name="grid-outline" label="Dashboard" />,
      }} />
      <Tabs.Screen name="profile" options={{
        headerShown: false,
        tabBarIcon: ({ focused }) => <TabIcon focused={focused} name="business-outline" label="Profile" />,
      }} />
      <Tabs.Screen name="inquiries" options={{
        headerShown: false,
        tabBarIcon: ({ focused }) => <TabIcon focused={focused} name="chatbubbles-outline" label="Inquiries" />,
      }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  activeTab: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#EC4899', borderRadius: 999,
    paddingHorizontal: 16, paddingVertical: 8, marginTop: 16,
  },
  inactiveTab: { alignItems: 'center', justifyContent: 'center', marginTop: 16 },
});
