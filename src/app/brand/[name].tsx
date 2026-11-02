import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { ProductCard } from '../../components/ProductCard';
import { BackBar, Chip, Row, Screen, Txt } from '../../components/ui';
import { SELLERS } from '../../data/demo';
import { CONDITION_LABEL, type Condition } from '../../data/types';
import { compatCount } from '../../engine/stylist';
import { useStore } from '../../store/AppStore';
import { plural } from '../../theme';

type CondFilter = 'all' | Condition;
type SellerFilter = 'all' | 'shop' | 'private';
type Sort = 'cheap' | 'expensive' | 'fast';

export default function BrandScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const { products, wardrobe } = useStore();
  const [cond, setCond] = useState<CondFilter>('all');
  const [seller, setSeller] = useState<SellerFilter>('all');
  const [sort, setSort] = useState<Sort>('cheap');

  const sellerType = (id: string) => SELLERS.find((s) => s.id === id)?.type;
  const all = products.filter((p) => p.brand === name && p.stock > 0);
  const list = all
    .filter((p) => cond === 'all' || p.condition === cond)
    .filter((p) => seller === 'all' || (seller === 'private' ? sellerType(p.sellerId) === 'private' : sellerType(p.sellerId) !== 'private'))
    .sort((a, b) => (sort === 'cheap' ? a.price - b.price : sort === 'expensive' ? b.price - a.price : a.deliveryDays - b.deliveryDays));
  const sellers = new Set(all.map((p) => p.sellerId)).size;

  return (
    <Screen header={<BackBar label="Бренды" fallback="/market" />}>
      <View style={{ gap: 4 }}>
        <Txt v="display">{name}</Txt>
        <Txt v="small">
          {all.length} {plural(all.length, ['предложение', 'предложения', 'предложений'])} от {sellers} {plural(sellers, ['продавца', 'продавцов', 'продавцов'])}
        </Txt>
      </View>

      <View style={{ gap: 8 }}>
        <Row gap={8} wrap>
          <Chip tone="soft" label="Любое состояние" selected={cond === 'all'} onPress={() => setCond('all')} />
          {(Object.keys(CONDITION_LABEL) as Condition[]).map((c) => (
            <Chip key={c} tone="soft" label={CONDITION_LABEL[c]} selected={cond === c} onPress={() => setCond(c)} />
          ))}
        </Row>
        <Row gap={8} wrap>
          <Chip tone="soft" label="Все продавцы" selected={seller === 'all'} onPress={() => setSeller('all')} />
          <Chip tone="soft" label="Магазины" selected={seller === 'shop'} onPress={() => setSeller('shop')} />
          <Chip tone="soft" label="Частные" selected={seller === 'private'} onPress={() => setSeller('private')} />
        </Row>
        <Row gap={8} wrap>
          <Chip tone="soft" label="Дешевле" selected={sort === 'cheap'} onPress={() => setSort('cheap')} />
          <Chip tone="soft" label="Дороже" selected={sort === 'expensive'} onPress={() => setSort('expensive')} />
          <Chip tone="soft" label="Быстрая доставка" selected={sort === 'fast'} onPress={() => setSort('fast')} />
        </Row>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 18 }}>
        {list.map((p) => <ProductCard key={p.id} p={p} compat={compatCount(p, wardrobe)} />)}
      </View>
      {!list.length && <Txt v="small">Под эти фильтры ничего нет.</Txt>}
    </Screen>
  );
}
