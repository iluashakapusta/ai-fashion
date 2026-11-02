import Feather from '@expo/vector-icons/Feather';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LookCard } from '../../components/LookCard';
import { Btn, Chip, Row, Txt } from '../../components/ui';
import type { ChatMessage } from '../../data/types';
import { FREE_REQUESTS_PER_DAY, useStore } from '../../store/AppStore';
import { C, F, rub } from '../../theme';

const SUGGESTIONS = [
  'Собери мне 5 образов для отпуска в тёплой стране на 10 дней. Бюджет — 30 000 рублей. Нужна одежда для пляжа, прогулок, ресторанов и вечерних выходов.',
  'Подбери мне одежду на следующую неделю',
  'Найди образ для свидания',
  'Подбери одежду для собеседования',
];

export default function Stylist() {
  const { messages, ask, premium, requestsToday } = useStore();
  const { q } = useLocalSearchParams<{ q?: string }>();
  const [text, setText] = useState('');
  const lastQ = useRef<string | undefined>(undefined);
  const scroll = useRef<ScrollView>(null);

  useEffect(() => {
    if (q && q !== lastQ.current) {
      lastQ.current = q;
      ask(q);
      router.setParams({ q: undefined });
    }
  }, [q, ask]);

  const send = (t = text) => {
    const v = t.trim();
    if (!v) return;
    ask(v);
    setText('');
  };

  const left = Math.max(0, FREE_REQUESTS_PER_DAY - requestsToday);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.ground }}>
      <Row gap={10} style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: C.line }}>
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center' }}>
          <Feather name="zap" size={18} color="#FFFFFF" />
        </View>
        <View style={{ flex: 1 }}>
          <Txt v="h2">AI-стилист</Txt>
          <Txt v="small">{premium ? 'Premium · без ограничений' : `Бесплатно осталось сегодня: ${left} из ${FREE_REQUESTS_PER_DAY}`}</Txt>
        </View>
      </Row>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          ref={scroll}
          style={{ flex: 1, backgroundColor: C.surface }}
          contentContainerStyle={{ padding: 16, gap: 14 }}
          onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((m) => <Message key={m.id} m={m} />)}
          {messages.length === 1 && (
            <View style={{ gap: 8 }}>
              <Txt v="label">Попробуй спросить</Txt>
              {SUGGESTIONS.map((s) => (
                <Pressable key={s} accessibilityRole="button" onPress={() => send(s)} style={({ pressed }) => ({ backgroundColor: C.ground, borderRadius: 16, padding: 12, borderWidth: 1, borderColor: C.line, opacity: pressed ? 0.7 : 1 })}>
                  <Txt lines={2}>«{s}»</Txt>
                </Pressable>
              ))}
            </View>
          )}
        </ScrollView>

        <Row gap={8} style={{ padding: 10, paddingHorizontal: 16, borderTopWidth: 1, borderTopColor: C.line, backgroundColor: C.ground }}>
          <TextInput
            accessibilityLabel="Сообщение стилисту"
            value={text}
            onChangeText={setText}
            onSubmitEditing={() => send()}
            placeholder="Например: образ на свадьбу друга"
            placeholderTextColor={C.muted}
            returnKeyType="send"
            style={{ flex: 1, height: 46, borderRadius: 23, backgroundColor: C.surface, paddingHorizontal: 16, fontFamily: F.m, fontSize: 14, color: C.ink }}
          />
          <Pressable accessibilityRole="button" accessibilityLabel="Отправить" onPress={() => send()} style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center' }}>
            <Feather name="arrow-up" size={20} color="#FFFFFF" />
          </Pressable>
        </Row>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Message({ m }: { m: ChatMessage }) {
  const { looks, addLooksToCart, products } = useStore();
  if (m.role === 'user') {
    return (
      <View style={{ alignSelf: 'flex-end', maxWidth: '85%', backgroundColor: C.dark, borderRadius: 20, borderBottomRightRadius: 6, paddingVertical: 12, paddingHorizontal: 16 }}>
        <Txt color="#FFFFFF">{m.text}</Txt>
      </View>
    );
  }
  const lookList = (m.lookIds || []).map((id) => looks[id]).filter(Boolean);
  const buyIds = new Set<string>();
  lookList.forEach((l) => l.items.forEach((it) => it.source === 'product' && buyIds.add(it.id)));
  const buyTotal = [...buyIds].reduce((s, id) => s + (products.find((p) => p.id === id)?.price || 0), 0);

  return (
    <View style={{ gap: 10 }}>
      <View style={{ backgroundColor: C.ground, borderRadius: 20, borderBottomLeftRadius: 6, padding: 14, gap: 12 }}>
        {m.chips && <Row gap={6} wrap>{m.chips.map((c) => <Chip key={c} label={c} tone="soft" />)}</Row>}
        <Txt>{m.text}</Txt>
        {lookList.length > 0 && (
          <Row gap={14}>
            <Row gap={6}><View style={{ width: 12, height: 12, borderRadius: 4, backgroundColor: C.line }} /><Txt v="small">есть у тебя</Txt></Row>
            <Row gap={6}><View style={{ width: 12, height: 12, borderRadius: 4, borderWidth: 2, borderColor: C.accent }} /><Txt v="small">купить в приложении</Txt></Row>
          </Row>
        )}
        {m.paywall && <Btn label="Попробовать Premium" kind="accent" onPress={() => router.push('/premium')} />}
      </View>
      {lookList.map((l) => <LookCard key={l.id} look={l} />)}
      {buyIds.size > 0 && (
        <Btn
          label={`Купить все образы · ${rub(buyTotal)}`}
          kind="accent"
          icon="shopping-bag"
          onPress={() => {
            addLooksToCart(lookList.map((l) => l.id));
            router.push('/cart');
          }}
        />
      )}
    </View>
  );
}
