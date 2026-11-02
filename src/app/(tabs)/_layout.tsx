import Feather from '@expo/vector-icons/Feather';
import { Tabs } from 'expo-router';
import type { IconName } from '../../components/ui';
import { C, F } from '../../theme';

function icon(name: IconName) {
  function TabIcon({ color }: { color: string }) {
    return <Feather name={name} size={22} color={color} />;
  }
  return TabIcon;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: C.accent,
        tabBarInactiveTintColor: C.muted,
        tabBarLabelStyle: { fontFamily: F.b, fontSize: 11 },
        tabBarStyle: { borderTopColor: C.line, backgroundColor: C.ground },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Сегодня', tabBarIcon: icon('sun') }} />
      <Tabs.Screen name="feed" options={{ title: 'Лента', tabBarIcon: icon('layers') }} />
      <Tabs.Screen name="stylist" options={{ title: 'Стилист', tabBarIcon: icon('message-circle') }} />
      <Tabs.Screen name="market" options={{ title: 'Маркет', tabBarIcon: icon('shopping-bag') }} />
      <Tabs.Screen name="profile" options={{ title: 'Профиль', tabBarIcon: icon('user') }} />
    </Tabs>
  );
}
