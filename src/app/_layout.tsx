import Feather from '@expo/vector-icons/Feather';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppStoreProvider } from '../store/AppStore';
import { C, FONT_ASSETS } from '../theme';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = { initialRouteName: '(tabs)' };

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({ ...FONT_ASSETS, ...Feather.font });

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
        {Platform.OS === 'web' ? <WebFrame><AppStack /></WebFrame> : <AppStack />}
      </AppStoreProvider>
    </SafeAreaProvider>
  );
}

function AppStack() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.ground } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="premium" options={{ presentation: 'modal' }} />
        <Stack.Screen name="item/new" options={{ presentation: 'modal' }} />
        <Stack.Screen name="post/new" options={{ presentation: 'modal' }} />
      </Stack>
    </>
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
