import Feather from '@expo/vector-icons/Feather';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Btn, Row, Txt, goBack } from '../components/ui';
import { useStore } from '../store/AppStore';
import { C } from '../theme';

const PERKS = [
  { title: 'Безлимитный AI-стилист', text: 'Сложные запросы: поездки, капсулы, «одежда на неделю»' },
  { title: 'Планировщик и чемодан', text: 'Образы на неделю по календарю и погоде, список вещей в поездку' },
  { title: '«Стоит ли покупать?»', text: 'Сканируй вещь в магазине или по ссылке — сколько образов она даст' },
  { title: 'Примерка на тебе', text: 'Образ на твоём фото до покупки' },
  { title: 'Подробная аналитика гардероба', text: 'Цена одного выхода, вещи без дела, перекосы по цветам' },
  { title: '5% кэшбэком и бесплатная доставка', text: 'На покупки в маркете и «Купить весь образ»' },
];

const PLANS = [
  { id: 'year', name: '12 месяцев', sub: '489 ₽ в месяц', price: '5 870 ₽', after: 'Потом 5 870 ₽ в год', badge: '−30%' },
  { id: 'half', name: '6 месяцев', sub: '549 ₽ в месяц', price: '3 290 ₽', after: 'Потом 3 290 ₽ за 6 месяцев', badge: '−22%' },
  { id: 'quarter', name: '3 месяца', sub: '597 ₽ в месяц', price: '1 790 ₽', after: 'Потом 1 790 ₽ за 3 месяца', badge: '−15%' },
  { id: 'month', name: '1 месяц', sub: 'помесячно', price: '699 ₽', after: 'Потом 699 ₽ в месяц', badge: '' },
];

export default function Premium() {
  const { premium, setPremium } = useStore();
  const [plan, setPlan] = useState('year');
  const cur = PLANS.find((p) => p.id === plan)!;

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: C.dark }}>
      <Row style={{ justifyContent: 'flex-end', paddingHorizontal: 12, paddingTop: 8 }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Закрыть" onPress={() => goBack('/profile')} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
          <Feather name="x" size={22} color={C.onDark} />
        </Pressable>
      </Row>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 22, gap: 20, paddingBottom: 20 }}>
        <View style={{ gap: 8 }}>
          <Txt v="label" color={C.onDarkAccent}>Premium</Txt>
          <Txt v="display" color={C.onDark}>Личный стилист, который окупается</Txt>
          <Txt color={C.onDarkMuted}>За октябрь Premium вернул бы тебе 780 ₽ кэшбэком, сэкономил 597 ₽ на доставке и уберёг от 2 покупок, которые дублируют гардероб.</Txt>
        </View>

        {!premium && (
          <View style={{ gap: 8 }}>
            {PLANS.map((p) => {
              const on = p.id === plan;
              return (
                <Pressable
                  key={p.id}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: on }}
                  onPress={() => setPlan(p.id)}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 62, paddingHorizontal: 16, borderRadius: 8, borderWidth: 2, borderColor: on ? C.onDark : C.onDarkMuted, backgroundColor: 'transparent' }}
                >
                  <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: on ? C.onDark : C.onDarkMuted, backgroundColor: on ? C.onDark : 'transparent' }} />
                  <View style={{ flex: 1 }}>
                    <Txt v="title" color={C.onDark}>{p.name}</Txt>
                    <Txt v="small" color={C.onDarkMuted}>{p.sub}</Txt>
                  </View>
                  {!!p.badge && (
                    <View style={{ height: 22, paddingHorizontal: 8, borderRadius: 3, backgroundColor: C.badgeBg, justifyContent: 'center' }}>
                      <Txt v="small" color={C.badgeInk} style={{ fontSize: 11 }}>{p.badge}</Txt>
                    </View>
                  )}
                  <Txt v="title" color={C.onDark}>{p.price}</Txt>
                </Pressable>
              );
            })}
          </View>
        )}

        <View style={{ gap: 14 }}>
          {PERKS.map((p) => (
            <Row key={p.title} gap={12} style={{ alignItems: 'flex-start' }}>
              <View style={{ width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: C.onDarkAccent, alignItems: 'center', justifyContent: 'center' }}>
                <Feather name="check" size={14} color={C.onDarkAccent} />
              </View>
              <View style={{ flex: 1, gap: 1 }}>
                <Txt v="title" color={C.onDark}>{p.title}</Txt>
                <Txt v="small" color={C.onDarkMuted} style={{ fontSize: 13 }}>{p.text}</Txt>
              </View>
            </Row>
          ))}
        </View>

      </ScrollView>

      <View style={{ paddingHorizontal: 22, paddingBottom: 12, paddingTop: 8, gap: 8 }}>
        {premium ? (
          <Btn label="Premium уже активен" kind="light" onPress={() => goBack('/profile')} />
        ) : (
          <>
            <Btn label="Попробовать 7 дней бесплатно" kind="light" onPress={() => { setPremium(true); goBack('/profile'); }} />
            <Txt v="small" color={C.onDarkMuted} center>{cur.after}. Отмена в любой момент. Демо: оплата не списывается.</Txt>
            <Btn label="Только на одну поездку? Пакет «Отпуск» — 399 ₽" kind="ghost" color={C.onDarkAccent} small onPress={() => { setPremium(true); goBack('/profile'); }} />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
