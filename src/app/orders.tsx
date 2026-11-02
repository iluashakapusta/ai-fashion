import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import { View } from 'react-native';
import { GarmentTile } from '../components/GarmentIcon';
import { BackBar, Btn, Card, Row, Screen, Txt } from '../components/ui';
import { SELLERS } from '../data/demo';
import { ORDER_STATUS } from '../data/types';
import { useStore } from '../store/AppStore';
import { C, plural, rub, shortDate } from '../theme';

export default function Orders() {
  const { orders, products } = useStore();
  const purchases = [...new Set(orders.map((o) => o.purchaseId))].map((pid) => orders.filter((o) => o.purchaseId === pid));

  return (
    <Screen header={<BackBar label="Назад" title="Заказы" fallback="/profile" />}>
      {!orders.length && (
        <View style={{ gap: 14, alignItems: 'center', paddingTop: 40 }}>
          <Feather name="package" size={40} color={C.muted} />
          <Txt v="small" center>Заказов пока нет.</Txt>
          <Btn label="В маркет" onPress={() => router.replace('/market')} />
        </View>
      )}

      {purchases.map((group, gi) => {
        const total = group.reduce((s, o) => s + o.total, 0);
        const last = Math.max(...group.map((o) => o.eta));
        return (
          <View key={group[0].purchaseId} style={{ gap: 10 }}>
            <Card tone="dark" style={{ gap: 8 }}>
              <Row gap={8}>
                <Feather name="check" size={16} color="#9FE3B8" />
                <Txt v="label" color="#9FE3B8">{gi === 0 ? 'Оплачено' : 'Покупка'}</Txt>
              </Row>
              <Txt v="h2" color="#FFFFFF">{rub(total)} · {group.length} {plural(group.length, ['заказ', 'заказа', 'заказов'])}</Txt>
              <Txt v="small" color={C.darkMuted}>Одна оплата — {group.length} {plural(group.length, ['продавец', 'продавца', 'продавцов'])}. Всё придёт до {shortDate(new Date(last))}.</Txt>
            </Card>
            {group.map((o) => {
              const seller = SELLERS.find((s) => s.id === o.sellerId)!;
              const ps = o.lines.map((l) => products.find((p) => p.id === l.productId)!).filter(Boolean);
              return (
                <Card key={o.id} style={{ gap: 10 }}>
                  <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View style={{ flex: 1, gap: 2 }}>
                      <Txt v="title">{seller.name}</Txt>
                      <Txt v="small">Заказ № {o.number}</Txt>
                    </View>
                    <Txt v="bodyB">{rub(o.total)}</Txt>
                  </Row>
                  <Row gap={8} wrap>
                    {ps.map((p) => <GarmentTile key={p.id} item={p} size={44} radius={10} />)}
                    <Txt v="small" style={{ flex: 1 }} lines={2}>{ps.map((p) => p.name).join(', ')}</Txt>
                  </Row>
                  <Row gap={4}>
                    {ORDER_STATUS.map((s, i) => (
                      <View key={s} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: i <= o.status ? C.accent : C.line }} />
                    ))}
                  </Row>
                  <Row style={{ justifyContent: 'space-between' }}>
                    <Txt v="small" color={C.accent}>{ORDER_STATUS[o.status]}</Txt>
                    <Txt v="small">Приедет {shortDate(new Date(o.eta))}</Txt>
                  </Row>
                </Card>
              );
            })}
          </View>
        );
      })}
    </Screen>
  );
}
