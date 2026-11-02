import Feather from '@expo/vector-icons/Feather';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppStoreProvider } from '../store/AppStore';
import { ThemeProvider, savedThemeId } from '../store/ThemeStore';
import { C, T, applyTheme, themeById } from '../theme';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = { initialRouteName: '(tabs)' };

SplashScreen.preventAutoHideAsync();

// Apply the saved theme before the first render so nothing flashes in the default palette.
const INITIAL_THEME = savedThemeId();
applyTheme(INITIAL_THEME);

export default function RootLayout() {
  const [loaded, error] = useFonts({ ...themeById(INITIAL_THEME).assets, ...Feather.font });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <SafeAreaProvider>
      <AppStoreProvider>
        <ThemeProvider initial={INITIAL_THEME}>
          {(themeId) => {
            // Colours and fonts are read at render time, so a theme switch remounts the navigator.
            const app = (
              <View key={themeId} style={{ flex: 1 }}>
                <StatusBar style={T.dark ? 'light' : 'dark'} />
                <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.ground } }}>
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="premium" options={{ presentation: 'modal' }} />
                  <Stack.Screen name="item/new" options={{ presentation: 'modal' }} />
                  <Stack.Screen name="post/new" options={{ presentation: 'modal' }} />
                </Stack>
              </View>
            );
            return Platform.OS === 'web' ? <WebFrame>{app}</WebFrame> : app;
          }}
        </ThemeProvider>
      </AppStoreProvider>
    </SafeAreaProvider>
  );
}

/** On a wide screen the web demo is shown at phone width, centred. */
function WebFrame({ children }: { children: React.ReactNode }) {
  return (
    <View style={{ flex: 1, backgroundColor: C.frame, alignItems: 'center' }}>
      <View style={{ flex: 1, width: '100%', maxWidth: 440, backgroundColor: C.ground, overflow: 'hidden', boxShadow: '0 0 40px rgba(0,0,0,0.10)' }}>
        {children}
      </View>
    </View>
  );
}
