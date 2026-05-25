import { Stack } from "expo-router";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from "../src/components/theme/theme-provider";
import './globals.css';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="vendor/[id]"
            options={{ headerShown: false }}
          />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
