import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import { Alert, Platform, Pressable, View } from 'react-native';
import { Btn, Card, Chip, Divider, Row, Screen, ToggleRow, Txt, type IconName } from '../../components/ui';
import { useStore } from '../../store/AppStore';
import { C } from '../../theme';

export default function Profile() {
  const { premium, setPremium, settings, updateSettings, orders, reset } = useStore();

  const confirmReset = () => {
    if (Platform.OS === 'web') {
      reset();
      return;
    }
    Alert.alert('Сбросить демо?', 'Гардероб, заказы и чат вернутся к исходному состоянию.', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Сбросить', style: 'destructive', onPress: reset },
    ]);
  };

  return (
    <Screen>
      <Txt v="display">Профиль</Txt>

      <Card tone="dark" style={{ gap: 12 }}>
        <Txt v="label" color="#9AA4FF">{premium ? 'Premium активен' : 'Бесплатная версия'}</Txt>
        <Txt v="h2" color="#FFFFFF">{premium ? 'Стилист без ограничений, кэшбэк 5% и бесплатная доставка' : 'Личный стилист, который окупается'}</Txt>
        {premium ? (
          <Btn label="Отменить подписку" kind="light" small onPress={() => setPremium(false)} style={{ alignSelf: 'flex-start' }} />
        ) : (
          <Btn label="Попробовать 7 дней бесплатно" kind="light" onPress={() => router.push('/premium')} />
        )}
      </Card>

      <View>
        <NavRow icon="package" label="Мои заказы" hint={orders.length ? `${orders.length} в работе` : 'Пока нет заказов'} onPress={() => router.push('/orders')} />
        <Divider />
        <NavRow icon="shopping-cart" label="Корзина" onPress={() => router.push('/cart')} />
        <Divider />
        <NavRow icon="briefcase" label="Кабинет продавца" hint="Для магазинов, брендов и частных продавцов" onPress={() => router.push('/seller')} />
      </View>

      <Card>
        <Txt v="h2">Источники данных</Txt>
        <ToggleRow label="Календарь" hint="Google Календарь, Apple Календарь" value={settings.calendar} onChange={(v) => updateSettings({ calendar: v })} />
        <Divider />
        <ToggleRow label="Геолокация и погода" hint="Образы с учётом температуры и осадков" value={settings.location} onChange={(v) => updateSettings({ location: v })} />
      </Card>

      <Card>
        <Txt v="h2">Уведомления</Txt>
        <ToggleRow label="События в календаре" hint="«Завтра свидание в 19:00 — подберём образ?»" value={settings.notifyEvents} onChange={(v) => updateSettings({ notifyEvents: v })} />
        <Divider />
        <ToggleRow label="Изменение погоды" value={settings.notifyWeather} onChange={(v) => updateSettings({ notifyWeather: v })} />
        <Divider />
        <ToggleRow label="Поездки" hint="Напомним собрать чемодан" value={settings.notifyTrips} onChange={(v) => updateSettings({ notifyTrips: v })} />
        <Divider />
        <ToggleRow label="Советы и находки AI" value={settings.notifyAi} onChange={(v) => updateSettings({ notifyAi: v })} />
        <View style={{ gap: 8, paddingTop: 6 }}>
          <Txt v="small">Как часто</Txt>
          <Row gap={8}>
            <Chip label="Редко" selected={settings.frequency === 'rare'} onPress={() => updateSettings({ frequency: 'rare' })} />
            <Chip label="Обычно" selected={settings.frequency === 'normal'} onPress={() => updateSettings({ frequency: 'normal' })} />
            <Chip label="Часто" selected={settings.frequency === 'often'} onPress={() => updateSettings({ frequency: 'often' })} />
          </Row>
        </View>
      </Card>

      <Card tone="surface">
        <Txt v="bodyB">Демо-версия</Txt>
        <Txt v="small">Гардероб, товары и продавцы — примеры. Оплата не списывается, распознавание и ответы стилиста работают на демо-логике.</Txt>
        <Btn label="Сбросить демо" kind="outline" small onPress={confirmReset} style={{ alignSelf: 'flex-start' }} />
      </Card>
    </Screen>
  );
}

function NavRow({ icon, label, hint, onPress }: { icon: IconName; label: string; hint?: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 60, opacity: pressed ? 0.6 : 1 })}>
      <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' }}>
        <Feather name={icon} size={18} color={C.ink} />
      </View>
      <View style={{ flex: 1 }}>
        <Txt v="bodyB">{label}</Txt>
        {hint ? <Txt v="small">{hint}</Txt> : null}
      </View>
      <Feather name="chevron-right" size={20} color={C.muted} />
    </Pressable>
  );
}
