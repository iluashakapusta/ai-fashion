import { Link } from 'expo-router';
import { Pressable, View } from 'react-native';
import type { Garment, Look, Product } from '../data/types';
import { useStore } from '../store/AppStore';
import { C, plural, rub } from '../theme';
import { GarmentTile } from './GarmentIcon';
import { Row, Txt } from './ui';

export function useLookItems(look: Look | undefined) {
  const { wardrobe, products } = useStore();
  if (!look) return [];
  return look.items
    .map((it) => ({
      ...it,
      g: (it.source === 'wardrobe' ? wardrobe.find((w) => w.id === it.id) : products.find((p) => p.id === it.id)) as Garment | undefined,
    }))
    .filter((x) => x.g) as (Look['items'][number] & { g: Garment })[];
}

export function lookTotals(items: ReturnType<typeof useLookItems>) {
  const buy = items.filter((i) => i.source === 'product');
  return {
    own: items.length - buy.length,
    buy: buy.length,
    total: buy.reduce((s, i) => s + (i.g as Product).price, 0),
    sellers: new Set(buy.map((i) => (i.g as Product).sellerId)).size,
  };
}

export function LookCard({ look }: { look: Look }) {
  const items = useLookItems(look);
  const t = lookTotals(items);
  const note = t.buy
    ? `Из гардероба ${t.own} · докупить ${t.buy}${t.sellers > 1 ? ` у ${t.sellers} ${plural(t.sellers, ['продавца', 'продавцов', 'продавцов'])}` : ''}`
    : 'Всё есть в гардеробе';
  return (
    <Link href={{ pathname: '/look/[id]', params: { id: look.id } }} asChild>
      <Pressable accessibilityRole="link" style={{ backgroundColor: C.ground, borderRadius: 20, padding: 14, gap: 10 }}>
        <Row style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Txt v="title" style={{ flex: 1 }} lines={1}>{look.title}</Txt>
          <Txt v="bodyB">{t.total ? rub(t.total) : '0 ₽'}</Txt>
        </Row>
        <Row gap={8} wrap>
          {items.map((i) => (
            <GarmentTile key={i.slot + i.id} item={i.g} size={52} radius={12} ring={i.source === 'product'} />
          ))}
        </Row>
        <View>
          <Txt v="small">{note}</Txt>
        </View>
      </Pressable>
    </Link>
  );
}
