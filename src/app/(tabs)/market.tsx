import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';
import { ProductCard } from '../../components/ProductCard';
import { Card, Chip, IconButton, Row, Screen, Txt } from '../../components/ui';
import { KIND_LABEL, type Kind } from '../../data/types';
import { compatCount } from '../../engine/stylist';
import { useStore } from '../../store/AppStore';
import { C, F } from '../../theme';

const CATS: (Kind | 'all')[] = ['all', 'top', 'bottom', 'dress', 'outer', 'shoes', 'acc'];
type Sort = 'match' | 'cheap' | 'fast';

export default function Market() {
  const { products, wardrobe, cart, orders, favorites } = useStore();
  const [cat, setCat] = useState<Kind | 'all'>('all');
  const [sort, setSort] = useState<Sort>('match');
  const [onlyFav, setOnlyFav] = useState(false);
  const [q, setQ] = useState('');

  const compat = useMemo(() => Object.fromEntries(products.map((p) => [p.id, compatCount(p, wardrobe)])), [products, wardrobe]);

  const list = products
    .filter((p) => (cat === 'all' || p.kind === cat) && (!onlyFav || favorites.includes(p.id)))
    .filter((p) => !q.trim() || `${p.name} ${p.colorName} ${p.material}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => (sort === 'cheap' ? a.price - b.price : sort === 'fast' ? a.deliveryDays - b.deliveryDays : compat[b.id] - compat[a.id]));

  // Paid placements are shown in their own labelled block, never mixed into the AI ranking.
  const organic = list.filter((p) => !p.sponsored);
  const promoted = list.filter((p) => p.sponsored);

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between' }}>
        <View style={{ gap: 4 }}>
          <Txt v="display">Маркет</Txt>
          <Txt v="small">Магазины, бренды и частные продавцы</Txt>
        </View>
        <Row>
          <IconButton icon="package" label="Мои заказы" badge={orders.length} onPress={() => router.push('/orders')} />
          <IconButton icon="shopping-cart" label="Корзина" badge={cart.length} onPress={() => router.push('/cart')} />
        </Row>
      </Row>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, height: 46, paddingHorizontal: 14, borderRadius: 23, backgroundColor: C.surface }}>
        <Feather name="search" size={18} color={C.muted} />
        <TextInput
          accessibilityLabel="Поиск товаров"
          value={q}
          onChangeText={setQ}
          placeholder="Льняная рубашка, лоферы…"
          placeholderTextColor={C.muted}
          style={{ flex: 1, fontFamily: F.m, fontSize: 14, color: C.ink, height: 46 }}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }} style={{ marginHorizontal: -20, paddingHorizontal: 20, flexGrow: 0 }}>
        {CATS.map((c) => <Chip key={c} label={c === 'all' ? 'Все' : KIND_LABEL[c]} selected={cat === c} onPress={() => setCat(c)} />)}
        <View style={{ width: 20 }} />
      </ScrollView>

      <Row gap={8} wrap>
        <Chip tone="soft" label="Под мой гардероб" selected={sort === 'match'} onPress={() => setSort('match')} />
        <Chip tone="soft" label="Дешевле" selected={sort === 'cheap'} onPress={() => setSort('cheap')} />
        <Chip tone="soft" label="Быстрая доставка" selected={sort === 'fast'} onPress={() => setSort('fast')} />
        <Chip tone="soft" label="Избранное" selected={onlyFav} onPress={() => setOnlyFav(!onlyFav)} />
      </Row>

      {promoted.length > 0 && (
        <Card tone="ad" style={{ gap: 12 }}>
          <Row style={{ justifyContent: 'space-between' }}>
            <Txt v="title" color="#5C3200">Предложения брендов</Txt>
            <Txt v="small" color={C.adInk}>Реклама</Txt>
          </Row>
          <Row gap={12} style={{ alignItems: 'flex-start' }}>
            {promoted.slice(0, 2).map((p) => <ProductCard key={p.id} p={p} compat={compat[p.id]} />)}
          </Row>
        </Card>
      )}

      <Txt v="h2">{sort === 'match' ? 'Подобрано под твой гардероб' : 'Все товары'}</Txt>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 18 }}>
        {organic.map((p) => <ProductCard key={p.id} p={p} compat={compat[p.id]} />)}
      </View>
      {!list.length && <Txt v="small">Ничего не нашлось.</Txt>}
    </Screen>
  );
}
