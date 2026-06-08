import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from "../src/components/theme/theme-provider";
import { AuthProvider, useAuth } from "../src/context/AuthContext";
import './globals.css';

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading, onboardingComplete, accountType, weddingId } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const rootSegment = String(segments[0] ?? '');
  const nestedSegment = String(segments[1] ?? '');

  const inAuthGroup = rootSegment === '(auth)';
  const inOnboarding = rootSegment === 'onboarding';
  const inVendorOnboarding = rootSegment === 'vendor-onboarding';
  const inVendorGroup = rootSegment === '(vendor)';
  const inAdminGroup = rootSegment === '(admin)';
  const inOrganizerGroup = rootSegment === '(organizer)';

  useEffect(() => {
    if (loading) return;
    const inWeddingWorkspace =
      rootSegment === '(tabs)' ||
      rootSegment === 'checklist' ||
      rootSegment === 'shortlist' ||
      rootSegment === 'edit-wedding' ||
      rootSegment === 'manage-partner' ||
      rootSegment === 'manage-organizer' ||
      rootSegment === 'settings' ||
      rootSegment === 'vendor';

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

    if (accountType === 'ORGANIZER') {
      if (inOrganizerGroup) return;
      const inOrganizerProfileView = rootSegment === '(tabs)' && nestedSegment === 'profile';
      const inOrganizerVendorsView = rootSegment === '(tabs)' && nestedSegment === 'search';
      const inVendorDetailsView = rootSegment === 'vendor';
      if (inOrganizerProfileView || inOrganizerVendorsView || inVendorDetailsView) {
        if (!weddingId) router.replace('/(organizer)/dashboard' as any);
        return;
      }
      router.replace('/(organizer)/dashboard' as any);
      return;
    }

    // CLIENT flow
    if (!onboardingComplete) {
      if (!inOnboarding) router.replace('/onboarding');
      return;
    }
    if (inAuthGroup || inOnboarding || inOrganizerGroup) router.replace('/(tabs)');

  }, [user, loading, onboardingComplete, accountType, segments, weddingId]);

  const inOrganizerProfileView = rootSegment === '(tabs)' && nestedSegment === 'profile';
  const inOrganizerVendorsView = rootSegment === '(tabs)' && nestedSegment === 'search';
  const inVendorDetailsView = rootSegment === 'vendor';

  const isRouteReady = !user
    ? inAuthGroup
    : accountType === 'ADMIN'
      ? inAdminGroup
      : accountType === 'VENDOR'
        ? (!onboardingComplete ? inVendorOnboarding : inVendorGroup)
        : accountType === 'ORGANIZER'
          ? (inOrganizerGroup || (Boolean(weddingId) && (inOrganizerProfileView || inOrganizerVendorsView || inVendorDetailsView)))
          : (!onboardingComplete ? inOnboarding : !(inAuthGroup || inOnboarding || inOrganizerGroup));

  if (loading || !isRouteReady) {
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
              <Stack.Screen name="(organizer)" options={{ headerShown: false }} />
              <Stack.Screen name="(admin)" options={{ headerShown: false }} />
              <Stack.Screen name="onboarding" options={{ headerShown: false }} />
              <Stack.Screen name="vendor-onboarding" options={{ headerShown: false }} />
              <Stack.Screen name="vendor/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="edit-wedding" options={{ headerShown: false }} />
              <Stack.Screen name="manage-partner" options={{ headerShown: false }} />
              <Stack.Screen name="manage-organizer" options={{ headerShown: false }} />
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
