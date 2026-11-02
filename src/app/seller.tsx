import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { GarmentTile } from '../components/GarmentIcon';
import { BackBar, Btn, Card, IconButton, Row, Screen, Txt } from '../components/ui';
import { PRODUCTS } from '../data/demo';
import { ORDER_STATUS } from '../data/types';
import { useStore } from '../store/AppStore';
import { C, F, rub } from '../theme';

// Seller cabinet shown from the point of view of the demo shop (seller s1).
const SELLER_ID = 's1';

const DEMO_ORDERS = [
  { number: 10479, item: 'Льняная рубашка, L', source: 'AI-образ «Отпуск»', status: 1, sum: 3990 },
  { number: 10476, item: 'Сарафан миди, S', source: 'Каталог', status: 1, sum: 4800 },
  { number: 10470, item: 'Шерстяное пальто, M', source: 'AI-образ «Офис»', status: 2, sum: 14900 },
];

export default function Seller() {
  const { orders, products } = useStore();
  const mine = products.filter((p) => p.sellerId === SELLER_ID);
  const [stock, setStock] = useState<Record<string, number>>(() => Object.fromEntries(mine.map((p) => [p.id, p.stock])));

  const live = orders
    .filter((o) => o.sellerId === SELLER_ID)
    .map((o) => ({
      number: o.number,
      item: o.lines.map((l) => PRODUCTS.find((p) => p.id === l.productId)?.name).join(', '),
      source: 'AI-образ',
      status: o.status,
      sum: o.total,
    }));
  const rows = [...live, ...DEMO_ORDERS];

  return (
    <Screen header={<BackBar label="Профиль" title="Кабинет продавца" fallback="/profile" />}>
      <Row style={{ justifyContent: 'space-between' }}>
        <View style={{ gap: 4, flex: 1 }}>
          <Txt v="small">Городской магазин одежды · ноябрь</Txt>
          <Txt v="display">Обзор</Txt>
        </View>
        <IconButton icon="plus" label="Добавить товар" dark />
      </Row>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10 }}>
        <Kpi label="Продажи" value={rub(184300 + live.reduce((s, o) => s + o.sum, 0))} hint="+18% к октябрю" hintColor={C.ok} />
        <Kpi label="Заказы" value={String(47 + live.length)} hint={`${2 + live.length} ждут отправки`} />
        <Kpi label="Из AI-образов" value="62%" hint="через «Купить весь образ»" accent />
        <Kpi label="Рейтинг" value="4,8" hint="по 312 отзывам" />
      </View>

      <Card>
        <Txt v="h2">Новые заказы</Txt>
        <ScrollView horizontal showsHorizontalScrollIndicator>
          <View style={{ minWidth: 520 }}>
            <Row style={{ paddingVertical: 8 }}>
              <Th w={80}>Заказ</Th><Th w={170}>Товар</Th><Th w={130}>Откуда</Th><Th w={90}>Статус</Th><Th w={50}>Сумма</Th>
            </Row>
            {rows.map((r) => (
              <Row key={r.number} style={{ paddingVertical: 10, borderTopWidth: 1, borderTopColor: C.line }}>
                <Td w={80} bold>№ {r.number}</Td>
                <Td w={170}>{r.item}</Td>
                <Td w={130} muted>{r.source}</Td>
                <View style={{ width: 90 }}>
                  <View style={{ alignSelf: 'flex-start', height: 24, paddingHorizontal: 8, borderRadius: 12, justifyContent: 'center', backgroundColor: r.status === 0 ? C.accentSoft : r.status === 1 ? C.adBg : C.okSoft }}>
                    <Txt v="small" style={{ fontSize: 11, fontFamily: F.xb }} color={r.status === 0 ? C.accentInk : r.status === 1 ? C.adInk : '#14582F'}>{r.status === 0 ? 'Новый' : ORDER_STATUS[r.status]}</Txt>
                  </View>
                </View>
                <Td w={70} bold>{rub(r.sum)}</Td>
              </Row>
            ))}
          </View>
        </ScrollView>
      </Card>

      <Card>
        <Txt v="h2">Товары и остатки</Txt>
        {mine.map((p) => (
          <Row key={p.id} gap={12} style={{ paddingTop: 10, borderTopWidth: 1, borderTopColor: C.line }}>
            <GarmentTile item={p} size={48} radius={10} />
            <View style={{ flex: 1, gap: 2 }}>
              <Txt v="bodyB" lines={1}>{p.name}</Txt>
              <Txt v="small" color={stock[p.id] <= 3 ? C.danger : C.muted}>{rub(p.price)} · осталось {stock[p.id]}</Txt>
            </View>
            <IconButton icon="minus" label="Уменьшить остаток" onPress={() => setStock((s) => ({ ...s, [p.id]: Math.max(0, s[p.id] - 1) }))} />
            <IconButton icon="plus" label="Увеличить остаток" onPress={() => setStock((s) => ({ ...s, [p.id]: s[p.id] + 1 }))} />
          </Row>
        ))}
      </Card>

      <Card tone="ad">
        <Txt v="h2" color="#5C3200">Продвижение</Txt>
        <Txt color="#3D2400">Ваши товары показываются только тем, кому они подходят по гардеробу и стилю — всегда с пометкой «Реклама», отдельно от независимых советов AI.</Txt>
        <Btn label="Запустить кампанию" small style={{ alignSelf: 'flex-start', backgroundColor: '#5C3200' }} />
      </Card>
    </Screen>
  );
}

function Kpi({ label, value, hint, hintColor, accent }: { label: string; value: string; hint: string; hintColor?: string; accent?: boolean }) {
  return (
    <View style={{ width: '48.5%', borderRadius: 20, padding: 14, gap: 4, backgroundColor: accent ? C.accent : C.surface }}>
      <Txt v="small" color={accent ? '#DADEFC' : C.muted}>{label}</Txt>
      <Txt style={{ fontFamily: F.dm, fontSize: 20 }} color={accent ? '#FFFFFF' : C.ink}>{value}</Txt>
      <Txt v="small" color={accent ? '#DADEFC' : hintColor ?? C.muted} style={{ fontSize: 11 }}>{hint}</Txt>
    </View>
  );
}

function Th({ children, w }: { children: string; w: number }) {
  return <View style={{ width: w }}><Txt v="small">{children}</Txt></View>;
}

function Td({ children, w, bold, muted }: { children: React.ReactNode; w: number; bold?: boolean; muted?: boolean }) {
  return (
    <View style={{ width: w, paddingRight: 8 }}>
      <Txt v={bold ? 'bodyB' : 'body'} color={muted ? C.muted : C.ink} style={{ fontSize: 13 }}>{children}</Txt>
    </View>
  );
}
