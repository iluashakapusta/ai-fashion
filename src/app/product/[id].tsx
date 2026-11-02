import Feather from '@expo/vector-icons/Feather';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { GarmentTile } from '../../components/GarmentIcon';
import { AdBadge, BackBar, Btn, Card, Chip, IconButton, Row, Screen, Txt } from '../../components/ui';
import { SELLERS, SELLER_TYPE_LABEL } from '../../data/demo';
import { CONDITION_LABEL } from '../../data/types';
import { harmonize, newOutfitsWith } from '../../engine/stylist';
import { useStore } from '../../store/AppStore';
import { C, F, addDays, plural, rub, shortDate } from '../../theme';

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { products, wardrobe, addToCart, cart, favorites, toggleFavorite, premium } = useStore();
  const p = products.find((x) => x.id === id);
  const [size, setSize] = useState<string | null>(null);

  if (!p) {
    return <Screen header={<BackBar label="Маркет" fallback="/market" />}><Txt>Товар не найден.</Txt></Screen>;
  }

  const seller = SELLERS.find((s) => s.id === p.sellerId)!;
  const pairs = wardrobe.filter((w) => harmonize(p, w));
  const extra = Math.max(0, newOutfitsWith(p, wardrobe));
  const inCart = cart.some((l) => l.productId === p.id);
  const fav = favorites.includes(p.id);
  const chosen = size ?? p.sizes[Math.floor(p.sizes.length / 2)];

  return (
    <Screen
      header={<BackBar label="Назад" fallback="/market" right={<IconButton icon="heart" label={fav ? 'Убрать из избранного' : 'В избранное'} dark={fav} onPress={() => toggleFavorite(p.id)} />} />}
      footer={
        <View style={{ padding: 20, paddingTop: 12, gap: 8, borderTopWidth: 1, borderTopColor: C.line }}>
          <Row style={{ justifyContent: 'space-between' }}>
            <Row gap={8}>
              <Txt style={{ fontFamily: F.d, fontSize: 22 }}>{rub(p.price)}</Txt>
              {p.oldPrice ? <Txt v="small" style={{ textDecorationLine: 'line-through' }}>{rub(p.oldPrice)}</Txt> : null}
            </Row>
            <Txt v="small">{premium ? 'Доставка бесплатно' : `Доставка ${shortDate(addDays(new Date(), p.deliveryDays))}`}</Txt>
          </Row>
          <Btn
            label={p.stock === 0 ? 'Нет в наличии' : inCart ? 'Перейти в корзину' : 'В корзину'}
            kind="accent"
            disabled={p.stock === 0}
            onPress={() => (inCart ? router.push('/cart') : addToCart(p.id, chosen))}
          />
        </View>
      }
    >
      <View>
        <GarmentTile item={p} radius={24} />
        {p.sponsored && <View style={{ position: 'absolute', top: 12, left: 12 }}><AdBadge /></View>}
      </View>

      <View style={{ gap: 4 }}>
        {p.brand ? (
          <Pressable accessibilityRole="link" onPress={() => router.push({ pathname: '/brand/[name]', params: { name: p.brand! } })}>
            <Txt v="label" color={C.accent}>{p.brand} · все предложения бренда</Txt>
          </Pressable>
        ) : null}
        <Txt v="display" style={{ fontSize: 22 }}>{p.name}</Txt>
        {p.condition ? <Txt v="small">Состояние: {CONDITION_LABEL[p.condition].toLowerCase()}</Txt> : null}
        <Row gap={6}>
          <Feather name="star" size={14} color={C.adInk} />
          <Txt v="small">{p.rating.toFixed(1).replace('.', ',')} · {p.reviews} {plural(p.reviews, ['отзыв', 'отзыва', 'отзывов'])} · {p.colorName}{p.material ? ` · ${p.material}` : ''}</Txt>
        </Row>
      </View>

      <Card tone="accent">
        <Row><Feather name="zap" size={18} color={C.accent} /><Txt v="title">Как это впишется в гардероб</Txt></Row>
        <Txt>
          Сочетается с <Txt v="bodyB">{pairs.length} {plural(pairs.length, ['вещью', 'вещами', 'вещами'])}</Txt>
          {extra > 0 ? <> и даёт <Txt v="bodyB">ещё {extra} {plural(extra, ['образ', 'образа', 'образов'])}</Txt>.</> : '.'}
        </Txt>
        {pairs.length > 0 && <Row gap={6} wrap>{pairs.slice(0, 6).map((w) => <GarmentTile key={w.id} item={w} size={48} radius={10} />)}</Row>}
        {wardrobe.some((w) => w.kind === p.kind && w.colorName === p.colorName) && (
          <Txt v="small" color={C.adInk}>Похожая вещь уже есть в гардеробе — проверь, нужна ли вторая.</Txt>
        )}
      </Card>

      <View style={{ gap: 8 }}>
        <Txt v="label">Размер</Txt>
        <Row gap={8} wrap>
          {p.sizes.map((s) => <Chip key={s} label={s} selected={chosen === s} onPress={() => setSize(s)} />)}
        </Row>
        <Txt v="small" color={p.stock <= 3 ? C.danger : C.muted}>{p.stock === 0 ? 'Нет в наличии' : p.stock <= 3 ? `Осталось ${p.stock} шт.` : 'В наличии'}</Txt>
      </View>

      <Txt>{p.description}</Txt>

      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <View style={{ gap: 2, flex: 1 }}>
            <Txt v="title">{seller.name}</Txt>
            <Txt v="small">{SELLER_TYPE_LABEL[seller.type]} · {seller.city} · рейтинг {seller.rating.toString().replace('.', ',')}</Txt>
          </View>
          <Feather name="chevron-right" size={20} color={C.muted} />
        </Row>
      </Card>
    </Screen>
  );
}
