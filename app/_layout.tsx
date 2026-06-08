import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from "../src/components/theme/theme-provider";
import { AuthProvider, useAuth } from "../src/context/AuthContext";
import './globals.css';

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading, onboardingComplete, accountType } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[0] === 'onboarding';
    const inVendorOnboarding = segments[0] === 'vendor-onboarding';
    const inVendorGroup = segments[0] === '(vendor)';
    const inAdminGroup = segments[0] === '(admin)';

    if (!user) {
      if (!inAuthGroup) router.replace('/(auth)/login');
      return;
    }

    if (accountType === 'ADMIN') {
      if (!inAdminGroup) router.replace('/(admin)/overview');
      return;
    }

    if (accountType === 'VENDOR') {
      if (!onboardingComplete) {
        if (!inVendorOnboarding) router.replace('/vendor-onboarding');
      } else if (!inVendorGroup) {
        router.replace('/(vendor)/dashboard');
      }
      return;
    }

    // CLIENT flow
    if (!onboardingComplete) {
      if (!inOnboarding) router.replace('/onboarding');
      return;
    }
    if (inAuthGroup || inOnboarding) router.replace('/(tabs)');

  }, [user, loading, onboardingComplete, accountType, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#EC4899" />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <AuthGate>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(vendor)" options={{ headerShown: false }} />
              <Stack.Screen name="(admin)" options={{ headerShown: false }} />
              <Stack.Screen name="onboarding" options={{ headerShown: false }} />
              <Stack.Screen name="vendor-onboarding" options={{ headerShown: false }} />
              <Stack.Screen name="vendor/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="edit-wedding" options={{ headerShown: false }} />
              <Stack.Screen name="manage-partner" options={{ headerShown: false }} />
              <Stack.Screen name="shortlist" options={{ headerShown: false }} />
              <Stack.Screen name="checklist" options={{ headerShown: false }} />
              <Stack.Screen name="settings" options={{ headerShown: false }} />
            </Stack>
          </AuthGate>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
