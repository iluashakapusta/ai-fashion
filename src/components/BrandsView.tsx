import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { POPULAR_BRANDS, brandsOnSale } from '../data/demo';
import { useStore } from '../store/AppStore';
import { C, F, plural, rub } from '../theme';
import { Divider, R, Txt } from './ui';

const openBrand = (name: string) => router.push({ pathname: '/brand/[name]', params: { name } });

/** Brand directory: every brand that has something on sale right now, from any seller. */
export function BrandsView() {
  const { products } = useStore();
  const [q, setQ] = useState('');
  const all = useMemo(() => brandsOnSale(products), [products]);
  const popular = POPULAR_BRANDS.map((n) => all.find((b) => b.name === n)).filter((b) => !!b);
  const found = all.filter((b) => !q.trim() || b.name.toLowerCase().includes(q.trim().toLowerCase()));

  return (
    <>
      <Txt v="small">Магазины, ресейлеры и частные продавцы — все предложения бренда в одном месте.</Txt>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, height: 46, paddingHorizontal: 14, borderRadius: R.input, backgroundColor: C.surface }}>
        <Feather name="search" size={18} color={C.muted} />
        <TextInput
          accessibilityLabel="Найти бренд"
          value={q}
          onChangeText={setQ}
          placeholder="Найти бренд"
          placeholderTextColor={C.muted}
          style={{ flex: 1, fontFamily: F.m, fontSize: 14, color: C.ink, height: 46 }}
        />
      </View>

      {!q.trim() && (
        <View style={{ gap: 10 }}>
          <Txt v="label">Популярные</Txt>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10 }}>
            {popular.map((b) => (
              <Pressable
                key={b.name}
                accessibilityRole="link"
                accessibilityLabel={b.name}
                onPress={() => openBrand(b.name)}
                style={{ width: '48.5%', minHeight: 96, padding: 14, borderRadius: R.card, borderWidth: 1, borderColor: C.line, backgroundColor: C.card, justifyContent: 'space-between' }}
              >
                <Text style={{ fontFamily: F.d, fontSize: 19, lineHeight: 24, color: C.ink }} numberOfLines={2}>{b.name}</Text>
                <Txt v="small">{b.count} {plural(b.count, ['предложение', 'предложения', 'предложений'])} · от {rub(b.minPrice)}</Txt>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      <View style={{ gap: 4 }}>
        <Txt v="label">{q.trim() ? 'Найдено' : 'Все бренды А–Я'}</Txt>
        {found.map((b, i) => (
          <View key={b.name}>
            {i > 0 && <Divider />}
            <Pressable accessibilityRole="link" onPress={() => openBrand(b.name)} style={{ flexDirection: 'row', alignItems: 'center', minHeight: 56, gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Txt v="bodyB">{b.name}</Txt>
                <Txt v="small">{b.count} {plural(b.count, ['предложение', 'предложения', 'предложений'])} · от {rub(b.minPrice)}</Txt>
              </View>
              <Feather name="chevron-right" size={20} color={C.muted} />
            </Pressable>
          </View>
        ))}
        {!found.length && <Txt v="small">Такого бренда пока нет в продаже.</Txt>}
      </View>
    </>
  );
}
