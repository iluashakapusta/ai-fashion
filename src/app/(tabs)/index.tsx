import Feather from '@expo/vector-icons/Feather';
import { Link, router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { GarmentTile } from '../../components/GarmentIcon';
import { Btn, Card, IconButton, Row, Screen, Txt } from '../../components/ui';
import { WEATHER, demoEvents } from '../../data/demo';
import { planLooks } from '../../engine/stylist';
import { useStore } from '../../store/AppStore';
import { C, longDate, shortDate } from '../../theme';

export default function Today() {
  const { wardrobe, products, todayVariant, nextTodayLook, settings, cart } = useStore();
  const now = new Date();
  const events = demoEvents(now);
  const hour = now.getHours();
  const hello = hour < 12 ? 'Доброе утро' : hour < 18 ? 'Добрый день' : 'Добрый вечер';

  const look = useMemo(() => {
    const plan = planLooks(
      { wardrobe, products },
      { occasions: ['office'], titles: ['Офис'], warmth: WEATHER.warmth, budget: null, days: null, allowBuy: false, topic: 'сегодня' },
      'today', todayVariant,
    );
    return plan.looks[0];
  }, [wardrobe, products, todayVariant]);

  const askAbout = (q: string) => router.push({ pathname: '/stylist', params: { q } });

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ gap: 4, flex: 1 }}>
          <Txt v="small">{longDate(now)}</Txt>
          <Txt v="display">{hello}</Txt>
        </View>
        <Row>
          <IconButton icon="shopping-cart" label="Корзина" badge={cart.length} onPress={() => router.push('/cart')} />
          <IconButton icon="bell" label="Уведомления" onPress={() => router.push('/profile')} />
        </Row>
      </Row>

      {settings.location ? (
        <Card tone="surface" style={{ gap: 12 }}>
          <Row gap={16}>
            <Txt v="big">+{WEATHER.temp}°</Txt>
            <View style={{ gap: 2, flex: 1 }}>
              <Txt v="title">{WEATHER.city}</Txt>
              <Txt v="small">{WEATHER.text}</Txt>
              <Txt v="small">Ветер {WEATHER.wind} м/с · ощущается как {WEATHER.feels}°</Txt>
            </View>
          </Row>
          <View style={{ borderTopWidth: 1, borderTopColor: C.line, paddingTop: 12 }}>
            <Txt>Возьми непромокаемый тренч и ботинки вместо кед — к вечеру будет дождь.</Txt>
          </View>
        </Card>
      ) : (
        <Card tone="surface">
          <Txt v="bodyB">Геолокация выключена</Txt>
          <Txt v="small">Включи её в профиле, чтобы образы учитывали погоду.</Txt>
        </Card>
      )}

      <View style={{ gap: 10 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <Txt v="h2">Образ на сегодня</Txt>
          <Pressable accessibilityRole="button" onPress={nextTodayLook} style={{ minHeight: 36, justifyContent: 'center' }}>
            <Txt v="small" color={C.accent} style={{ fontSize: 13 }}>Другой вариант</Txt>
          </Pressable>
        </Row>
        <Row gap={8}>
          {look.items.map((it) => {
            const g = wardrobe.find((w) => w.id === it.id);
            if (!g) return null;
            return (
              <Link key={it.id} href={{ pathname: '/item/[id]', params: { id: g.id } }} asChild>
                <Pressable accessibilityRole="link" accessibilityLabel={g.name} style={{ flex: 1 }}>
                  <GarmentTile item={g} radius={14} />
                </Pressable>
              </Link>
            );
          })}
        </Row>
      </View>

      {settings.calendar ? (
        <View style={{ gap: 10 }}>
          <Txt v="h2">Скоро в календаре</Txt>
          {events.map((e, i) => (
            <Card key={e.id} style={{ gap: 12 }}>
              <Row>
                <Feather name="calendar" size={16} color={C.accent} />
                <Txt v="label" color={C.accent}>{i === 0 ? 'Завтра' : shortDate(e.when)} · {String(e.when.getHours()).padStart(2, '0')}:00</Txt>
              </Row>
              <View style={{ gap: 2 }}>
                <Txt v="h2" style={{ fontSize: 18 }}>{e.title}</Txt>
                <Txt v="small">{e.place} · {e.weather}</Txt>
              </View>
              {i === 0 && <Txt>Давай подберём подходящий образ? У тебя есть удачные сочетания для вечера.</Txt>}
              <Btn label={i === 2 ? 'Собрать чемодан' : 'Подобрать образ'} kind={i === 0 ? 'dark' : 'outline'} small={i !== 0} onPress={() => askAbout(e.prompt)} />
            </Card>
          ))}
        </View>
      ) : (
        <Card tone="surface">
          <Txt v="bodyB">Календарь не подключён</Txt>
          <Txt v="small">Подключи Google или Apple Календарь в профиле — стилист будет заранее предлагать образы к событиям.</Txt>
        </Card>
      )}
    </Screen>
  );
}
