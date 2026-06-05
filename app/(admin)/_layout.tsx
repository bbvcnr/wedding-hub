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

export default function AdminLayout() {
  const { isDark } = useTheme();

  return (
    <Tabs screenOptions={{
      tabBarShowLabel: false,
      tabBarBackground: () => (
        <BlurView
          tint={isDark ? 'dark' : 'light'}
          intensity={20}
          style={[StyleSheet.absoluteFill, { backgroundColor: isDark ? 'rgba(20,10,10,0.95)' : 'rgba(255,248,248,0.95)' }]}
        />
      ),
      tabBarItemStyle: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
      tabBarStyle: {
        backgroundColor: 'transparent', borderRadius: 50,
        marginHorizontal: 20, marginBottom: 20, height: 52,
        position: 'absolute', overflow: 'hidden',
        borderWidth: 1, borderColor: isDark ? '#4A1A1A' : '#F9A8D4',
      },
    }}>
      <Tabs.Screen name="overview" options={{
        headerShown: false,
        tabBarIcon: ({ focused }) => <TabIcon focused={focused} name="stats-chart" label="Overview" />,
      }} />
      <Tabs.Screen name="users" options={{
        headerShown: false,
        tabBarIcon: ({ focused }) => <TabIcon focused={focused} name="people" label="Users" />,
      }} />
      <Tabs.Screen name="vendors" options={{
        headerShown: false,
        tabBarIcon: ({ focused }) => <TabIcon focused={focused} name="storefront" label="Vendors" />,
      }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  activeTab: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#DC2626', borderRadius: 999,
    paddingHorizontal: 16, paddingVertical: 8, marginTop: 16,
  },
  inactiveTab: { alignItems: 'center', justifyContent: 'center', marginTop: 16 },
});
