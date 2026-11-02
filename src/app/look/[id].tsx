import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, View } from 'react-native';
import { GarmentTile } from '../../components/GarmentIcon';
import { lookTotals, useLookItems } from '../../components/LookCard';
import { AdBadge, BackBar, Btn, Card, Row, Screen, Txt } from '../../components/ui';
import { SELLERS } from '../../data/demo';
import { OCCASION_LABEL, type Product } from '../../data/types';
import { useStore } from '../../store/AppStore';
import { C, F, addDays, plural, rub, shortDate } from '../../theme';

export default function LookScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { looks, replaceInLook, addLooksToCart, wardrobe } = useStore();
  const look = looks[id];
  const items = useLookItems(look);

  if (!look) {
    return (
      <Screen header={<BackBar label="Стилист" fallback="/stylist" />}>
        <Txt>Образ не найден. Попроси стилиста собрать новый.</Txt>
      </Screen>
    );
  }

  const t = lookTotals(items);
  const maxDays = Math.max(0, ...items.filter((i) => i.source === 'product').map((i) => (i.g as Product).deliveryDays));
  const bought = items.filter((i) => i.source === 'product');
  const reuse = bought.length
    ? wardrobe.filter((w) => bought.some((b) => b.g.kind !== w.kind && b.g.styles.some((s) => w.styles.includes(s)))).length
    : 0;

  return (
    <Screen
      header={<BackBar label="Все образы" fallback="/stylist" />}
      footer={
        <View style={{ padding: 20, paddingTop: 14, gap: 10, borderTopWidth: 1, borderTopColor: C.line, backgroundColor: C.ground }}>
          {t.buy > 0 ? (
            <>
              <Row style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Txt v="small" style={{ flex: 1 }}>
                  {t.buy} {plural(t.buy, ['товар', 'товара', 'товаров'])} · {t.sellers} {plural(t.sellers, ['продавец', 'продавца', 'продавцов'])} · доставка до {shortDate(addDays(new Date(), maxDays))}
                </Txt>
                <Txt style={{ fontFamily: F.d, fontSize: 20 }}>{rub(t.total)}</Txt>
              </Row>
              <Btn label="Купить весь образ" kind="accent" onPress={() => { addLooksToCart([look.id]); router.push('/cart'); }} />
            </>
          ) : (
            <Btn label="Всё есть — надеть" onPress={() => router.push('/')} />
          )}
        </View>
      }
    >
      <View style={{ gap: 4 }}>
        <Txt v="label" color={C.accent}>{OCCASION_LABEL[look.occasion]}</Txt>
        <Txt v="display" style={{ fontSize: 24 }}>{look.title}</Txt>
      </View>

      <View>
        {items.map((i, index) => {
          const p = i.source === 'product' ? (i.g as Product) : null;
          const seller = p ? SELLERS.find((s) => s.id === p.sellerId) : null;
          const body = (
            <>
              <GarmentTile item={i.g} size={72} radius={16} ring={!!p} />
              <View style={{ flex: 1, gap: 3 }}>
                <Row gap={6}>
                  <Txt v="title" lines={1} style={{ flexShrink: 1 }}>{i.g.name}</Txt>
                  {p?.sponsored && <AdBadge />}
                </Row>
                <Txt v="small" lines={1}>{p ? `${seller?.name} · доставка ${shortDate(addDays(new Date(), p.deliveryDays))}` : 'Из твоего гардероба'}</Txt>
                <Txt v="bodyB" color={p ? C.ink : C.ok}>{p ? rub(p.price) : 'Уже есть'}</Txt>
              </View>
            </>
          );
          return (
            <Row key={i.slot + index} gap={12} style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.line }}>
              {p ? (
                <Pressable accessibilityRole="link" onPress={() => router.push({ pathname: '/product/[id]', params: { id: p.id } })} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  {body}
                </Pressable>
              ) : (
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 }}>{body}</View>
              )}
              <Btn label="Заменить" kind="outline" small onPress={() => replaceInLook(look.id, index)} />
            </Row>
          );
        })}
      </View>

      {reuse > 0 && (
        <Card tone="accent">
          <Txt>Новые вещи подойдут ещё к <Txt v="bodyB">{reuse} {plural(reuse, ['вещи', 'вещам', 'вещам'])}</Txt> из твоего гардероба — пригодятся и потом.</Txt>
        </Card>
      )}
    </Screen>
  );
}
