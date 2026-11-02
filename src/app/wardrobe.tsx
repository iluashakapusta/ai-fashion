import Feather from '@expo/vector-icons/Feather';
import { Link, router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { GarmentTile } from '../components/GarmentIcon';
import { BackBar, Btn, Card, IconButton, Row, Screen, Txt, Chip } from '../components/ui';
import { WEATHER } from '../data/demo';
import { KIND_LABEL, type Kind } from '../data/types';
import { countOutfits, gaps } from '../engine/stylist';
import { useStore } from '../store/AppStore';
import { C, F, plural, rub } from '../theme';

const CATS: (Kind | 'all')[] = ['all', 'top', 'bottom', 'dress', 'outer', 'shoes', 'acc'];

export default function Wardrobe() {
  const { wardrobe, premium } = useStore();
  const [cat, setCat] = useState<Kind | 'all'>('all');
  const [q, setQ] = useState('');

  const outfits = useMemo(() => countOutfits(wardrobe), [wardrobe]);
  const missing = useMemo(() => gaps(wardrobe, WEATHER.warmth), [wardrobe]);

  const shown = wardrobe.filter((w) => {
    if (cat !== 'all' && w.kind !== cat) return false;
    if (!q.trim()) return true;
    const s = q.toLowerCase();
    return [w.name, w.colorName, w.material || '', KIND_LABEL[w.kind]].some((x) => x.toLowerCase().includes(s));
  });

  const total = wardrobe.reduce((s, w) => s + (w.price || 0), 0);
  const wears = wardrobe.reduce((s, w) => s + w.wears, 0);
  const unused = wardrobe.filter((w) => w.wears <= 1);

  return (
    <Screen header={<BackBar label="Профиль" fallback="/profile" />}>
      <Row style={{ justifyContent: 'space-between' }}>
        <View style={{ gap: 4 }}>
          <Txt v="display">Гардероб</Txt>
          <Txt v="small">{wardrobe.length} {plural(wardrobe.length, ['вещь', 'вещи', 'вещей'])} · {outfits} {plural(outfits, ['образ', 'образа', 'образов'])}</Txt>
        </View>
        <IconButton icon="plus" label="Добавить вещь" dark onPress={() => router.push('/item/new')} />
      </Row>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, height: 46, paddingHorizontal: 14, borderRadius: 3, backgroundColor: C.surface }}>
        <Feather name="search" size={18} color={C.muted} />
        <TextInput
          accessibilityLabel="Поиск по гардеробу"
          value={q}
          onChangeText={setQ}
          placeholder="Например: синее, шерсть, обувь"
          placeholderTextColor={C.muted}
          style={{ flex: 1, fontFamily: F.m, fontSize: 14, color: C.ink, height: 46 }}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }} style={{ marginHorizontal: -20, paddingHorizontal: 20, flexGrow: 0 }}>
        {CATS.map((c) => (
          <Chip key={c} label={c === 'all' ? 'Все' : KIND_LABEL[c]} selected={cat === c} onPress={() => setCat(c)} />
        ))}
        <View style={{ width: 20 }} />
      </ScrollView>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: 14, columnGap: 10 }}>
        {shown.map((w) => (
          <Link key={w.id} href={{ pathname: '/item/[id]', params: { id: w.id } }} asChild>
            <Pressable accessibilityRole="link" accessibilityLabel={w.name} style={{ width: '31%', gap: 6 }}>
              <GarmentTile item={w} />
              <View>
                <Txt v="small" color={C.ink} style={{ fontFamily: F.b, fontSize: 13 }} lines={1}>{w.name}</Txt>
                <Txt v="small" style={{ fontSize: 11 }} lines={1}>{w.colorName}{w.material ? ` · ${w.material}` : ''}</Txt>
              </View>
            </Pressable>
          </Link>
        ))}
        {!shown.length && <Txt v="small">Ничего не нашлось.</Txt>}
      </View>

      {missing.length > 0 && (
        <Card tone="accent">
          <Row>
            <Feather name="zap" size={18} color={C.accent} />
            <Txt v="title">Анализ гардероба</Txt>
          </Row>
          <Txt>Не хватает {missing.join(', ')}.</Txt>
          <Btn label="Подобрать в маркете" kind="accent" small onPress={() => router.push('/market')} style={{ alignSelf: 'flex-start' }} />
        </Card>
      )}

      <Card tone={premium ? 'line' : 'surface'}>
        <Row style={{ justifyContent: 'space-between' }}>
          <Txt v="title">Подробная аналитика</Txt>
          {!premium && <Row gap={4}><Feather name="lock" size={14} color={C.muted} /><Txt v="small">Premium</Txt></Row>}
        </Row>
        {premium ? (
          <View style={{ gap: 8 }}>
            <Stat label="Стоимость гардероба" value={rub(total)} />
            <Stat label="Средняя цена одного выхода" value={rub(wears ? total / wears : 0)} />
            <Stat label="Почти не носишь" value={`${unused.length} ${plural(unused.length, ['вещь', 'вещи', 'вещей'])}`} />
            {unused.length > 0 && <Txt v="small">{unused.map((u) => u.name).join(', ')} — попробуй их в новых образах или продай в маркете.</Txt>}
          </View>
        ) : (
          <>
            <Txt>Сколько стоит один выход в каждой вещи, что лежит без дела и какие цвета перевешивают.</Txt>
            <Btn label="Открыть с Premium" kind="outline" small onPress={() => router.push('/premium')} style={{ alignSelf: 'flex-start' }} />
          </>
        )}
      </Card>
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Row style={{ justifyContent: 'space-between' }}>
      <Txt v="small" style={{ fontSize: 13 }}>{label}</Txt>
      <Txt v="bodyB">{value}</Txt>
    </Row>
  );
}
