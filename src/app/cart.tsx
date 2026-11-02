import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { GarmentTile } from '../components/GarmentIcon';
import { BackBar, Btn, Card, IconButton, Row, Screen, Txt } from '../components/ui';
import { SELLERS, SELLER_TYPE_LABEL } from '../data/demo';
import { useStore } from '../store/AppStore';
import { C, F, addDays, plural, rub, shortDate } from '../theme';

const CHECKS = ['Наличие товаров', 'Актуальность цен', 'Возможность доставки', 'Распределение заказов по продавцам'];

export default function Cart() {
  const { cart, products, removeFromCart, checkout, premium } = useStore();
  const [stage, setStage] = useState<'cart' | 'checking' | 'ready'>('cart');
  const [done, setDone] = useState(0);

  useEffect(() => {
    if (stage !== 'checking') return;
    if (done >= CHECKS.length) {
      setStage('ready');
      return;
    }
    const t = setTimeout(() => setDone((n) => n + 1), 500);
    return () => clearTimeout(t);
  }, [stage, done]);

  const lines = cart.map((l, index) => ({ ...l, index, p: products.find((p) => p.id === l.productId)! })).filter((l) => l.p);
  const groups = SELLERS.map((s) => ({ s, lines: lines.filter((l) => l.p.sellerId === s.id) })).filter((g) => g.lines.length);
  const subtotal = lines.reduce((s, l) => s + l.p.price, 0);
  const delivery = premium ? 0 : groups.length * 199;
  const cashback = premium ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal + delivery;
  const lastDay = Math.max(0, ...lines.map((l) => l.p.deliveryDays));

  const pay = () => {
    checkout();
    router.replace('/orders');
  };

  return (
    <Screen
      header={<BackBar label="Назад" title="Корзина" fallback="/market" />}
      footer={lines.length ? (
        <View style={{ padding: 20, paddingTop: 14, gap: 10, borderTopWidth: 1, borderTopColor: C.line }}>
          <Row style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Txt v="small" style={{ flex: 1 }}>{lines.length} {plural(lines.length, ['товар', 'товара', 'товаров'])} · {groups.length} {plural(groups.length, ['заказ', 'заказа', 'заказов'])} · всё придёт до {shortDate(addDays(new Date(), lastDay))}</Txt>
            <Txt style={{ fontFamily: F.d, fontSize: 20 }}>{rub(total)}</Txt>
          </Row>
          {stage === 'ready' ? (
            <Btn label={`Оплатить ${rub(total)}`} kind="accent" icon="lock" onPress={pay} />
          ) : (
            <Btn label="Оформить" kind="accent" loading={stage === 'checking'} onPress={() => { setDone(0); setStage('checking'); }} />
          )}
          <Txt v="small" center>Одна оплата — отдельный заказ у каждого продавца. Демо: деньги не списываются.</Txt>
        </View>
      ) : undefined}
    >
      {!lines.length && (
        <View style={{ gap: 14, alignItems: 'center', paddingTop: 40 }}>
          <Feather name="shopping-cart" size={40} color={C.muted} />
          <Txt v="small" center>Корзина пуста. Попроси стилиста собрать образ — недостающие вещи можно купить в один клик.</Txt>
          <Btn label="К стилисту" onPress={() => router.replace('/stylist')} />
        </View>
      )}

      {groups.map(({ s, lines: ls }) => (
        <Card key={s.id} style={{ gap: 12 }}>
          <View style={{ gap: 2 }}>
            <Txt v="title">{s.name}</Txt>
            <Txt v="small">{SELLER_TYPE_LABEL[s.type]} · {s.city} · доставка {premium ? 'бесплатно' : rub(199)}</Txt>
          </View>
          {ls.map((l) => (
            <Row key={l.productId} gap={12}>
              <GarmentTile item={l.p} size={56} radius={12} />
              <View style={{ flex: 1, gap: 2 }}>
                <Txt v="bodyB" lines={1}>{l.p.name}</Txt>
                <Txt v="small">Размер {l.size} · приедет {shortDate(addDays(new Date(), l.p.deliveryDays))}</Txt>
                <Txt v="bodyB">{rub(l.p.price)}</Txt>
              </View>
              <IconButton icon="trash-2" label={`Убрать ${l.p.name}`} onPress={() => { setStage('cart'); removeFromCart(l.index); }} />
            </Row>
          ))}
        </Card>
      ))}

      {lines.length > 0 && (
        <Card tone="surface">
          <Row style={{ justifyContent: 'space-between' }}><Txt v="small">Товары</Txt><Txt v="bodyB">{rub(subtotal)}</Txt></Row>
          <Row style={{ justifyContent: 'space-between' }}><Txt v="small">Доставка</Txt><Txt v="bodyB">{delivery ? rub(delivery) : 'бесплатно с Premium'}</Txt></Row>
          {cashback > 0 && <Row style={{ justifyContent: 'space-between' }}><Txt v="small">Кэшбэк Premium</Txt><Txt v="bodyB" color={C.ok}>+{rub(cashback)}</Txt></Row>}
          {!premium && <Txt v="small" color={C.accent} style={{ fontFamily: F.b }} >С Premium доставка была бы бесплатной и вернулось бы {rub(Math.round(subtotal * 0.05))}</Txt>}
        </Card>
      )}

      {stage !== 'cart' && lines.length > 0 && (
        <View style={{ gap: 10 }}>
          {CHECKS.map((c, i) => (
            <Row key={c} gap={10}>
              <View style={{ width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: i < done ? C.ok : C.surface }}>
                {i < done && <Feather name="check" size={13} color={C.ground} />}
              </View>
              <Txt color={i < done ? C.ink : C.muted}>{c}</Txt>
            </Row>
          ))}
        </View>
      )}
    </Screen>
  );
}
