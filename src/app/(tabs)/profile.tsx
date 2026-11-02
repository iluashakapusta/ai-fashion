import Feather from '@expo/vector-icons/Feather';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, Pressable, View } from 'react-native';
import { GarmentTile } from '../../components/GarmentIcon';
import { Btn, Card, Chip, Divider, IconButton, Row, Screen, ToggleRow, Txt, type IconName } from '../../components/ui';
import { countOutfits } from '../../engine/stylist';
import { useStore } from '../../store/AppStore';
import { C, plural } from '../../theme';

export default function Profile() {
  const { premium, setPremium, settings, updateSettings, orders, cart, reset, wardrobe } = useStore();
  const outfits = countOutfits(wardrobe);

  const confirmReset = () => {
    if (Platform.OS === 'web') {
      reset();
      return;
    }
    Alert.alert('Сбросить демо?', 'Гардероб, заказы, лента и чат вернутся к исходному состоянию.', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Сбросить', style: 'destructive', onPress: reset },
    ]);
  };

  return (
    <Screen>
      <Txt v="display">Профиль</Txt>

      <Card style={{ gap: 12 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <View style={{ gap: 2 }}>
            <Txt v="h2">Мой гардероб</Txt>
            <Txt v="small">{wardrobe.length} {plural(wardrobe.length, ['вещь', 'вещи', 'вещей'])} · {outfits} {plural(outfits, ['образ', 'образа', 'образов'])}</Txt>
          </View>
          <IconButton icon="plus" label="Добавить вещь" dark onPress={() => router.push('/item/new')} />
        </Row>
        <Link href="/wardrobe" asChild>
          <Pressable accessibilityRole="link" accessibilityLabel="Открыть гардероб" style={{ flexDirection: 'row', gap: 8 }}>
            {(['top', 'bottom', 'outer', 'shoes'] as const).map((k) => wardrobe.find((w) => w.kind === k)).filter((w) => !!w).map((w) => (
              <View key={w.id} style={{ flex: 1 }}>
                <GarmentTile item={w} radius={14} />
              </View>
            ))}
          </Pressable>
        </Link>
        <Btn label="Открыть гардероб" kind="outline" small onPress={() => router.push('/wardrobe')} />
      </Card>

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
        <NavRow icon="shopping-cart" label="Корзина" hint={cart.length ? `${cart.length} ${plural(cart.length, ['товар', 'товара', 'товаров'])}` : undefined} onPress={() => router.push('/cart')} />
      </View>

      <Collapsible icon="link" title="Источники данных" hint="Календарь, геолокация и погода">
        <ToggleRow label="Календарь" hint="Google Календарь, Apple Календарь" value={settings.calendar} onChange={(v) => updateSettings({ calendar: v })} />
        <Divider />
        <ToggleRow label="Геолокация и погода" hint="Образы с учётом температуры и осадков" value={settings.location} onChange={(v) => updateSettings({ location: v })} />
      </Collapsible>

      <Collapsible icon="bell" title="Уведомления" hint="Что присылать и как часто">
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
      </Collapsible>

      <Card tone="surface">
        <Txt v="bodyB">Демо-версия</Txt>
        <Txt v="small">Гардероб, товары, магазины и лента — примеры. Оплата не списывается, распознавание и ответы стилиста работают на демо-логике.</Txt>
        <Btn label="Сбросить демо" kind="outline" small onPress={confirmReset} style={{ alignSelf: 'flex-start' }} />
      </Card>
    </Screen>
  );
}

function Collapsible({ icon, title, hint, children }: { icon: IconName; title: string; hint: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ borderRadius: 22, borderWidth: 1, borderColor: C.line, paddingHorizontal: 16 }}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen(!open)}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 64 }}
      >
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' }}>
          <Feather name={icon} size={18} color={C.ink} />
        </View>
        <View style={{ flex: 1 }}>
          <Txt v="bodyB">{title}</Txt>
          <Txt v="small">{hint}</Txt>
        </View>
        <Feather name={open ? 'chevron-up' : 'chevron-down'} size={20} color={C.muted} />
      </Pressable>
      {open && <View style={{ paddingBottom: 12 }}>{children}</View>}
    </View>
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
