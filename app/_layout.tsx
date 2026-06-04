import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from "../src/components/theme/theme-provider";
import { AuthProvider, useAuth } from "../src/context/AuthContext";
import './globals.css';

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading, onboardingComplete } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[0] === 'onboarding';
    const inTabs = segments[0] === '(tabs)';

    if (!user) {
      // Not logged in → send to login
      if (!inAuthGroup) router.replace('/(auth)/login');
      return;
    }

    // Logged in but onboarding not done
    if (!onboardingComplete) {
      if (!inOnboarding) router.replace('/onboarding');
      return;
    }

    // Logged in + onboarding done → get out of auth/onboarding
    if (inAuthGroup || inOnboarding) {
      router.replace('/(tabs)');
    }
  }, [user, loading, onboardingComplete, segments]);

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
              <Stack.Screen name="onboarding" options={{ headerShown: false }} />
              <Stack.Screen name="vendor/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="edit-wedding" options={{ headerShown: false }} />
              <Stack.Screen name="manage-partner" options={{ headerShown: false }} />
              <Stack.Screen name="shortlist" options={{ headerShown: false }} />
              <Stack.Screen name="checklist" options={{ headerShown: false }} />
            </Stack>
          </AuthGate>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
