import Feather from '@expo/vector-icons/Feather';
import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { Avatar } from '../../components/PostCard';
import { ProductCard } from '../../components/ProductCard';
import { BackBar, Btn, Row, Screen, Txt } from '../../components/ui';
import { SELLERS, SELLER_TYPE_LABEL, SHOP_INFO } from '../../data/demo';
import { compatCount } from '../../engine/stylist';
import { useStore } from '../../store/AppStore';
import { C } from '../../theme';

export default function ShopScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { products, wardrobe, subscriptions, toggleSubscribe } = useStore();
  const s = SELLERS.find((x) => x.id === id);

  if (!s) return <Screen header={<BackBar label="Маркет" fallback="/market" />}><Txt>Магазин не найден.</Txt></Screen>;

  const info = SHOP_INFO[s.id];
  const list = products.filter((p) => p.sellerId === s.id);
  const on = subscriptions.includes(s.id);

  return (
    <Screen header={<BackBar label="Маркет" fallback="/market" />}>
      <Row gap={14}>
        <Avatar name={s.name} color={info.color} size={64} />
        <View style={{ flex: 1, gap: 2 }}>
          <Txt v="h2">{s.name}</Txt>
          <Txt v="small">{SELLER_TYPE_LABEL[s.type]} · {s.city}</Txt>
          <Row gap={4}>
            <Feather name="star" size={13} color={C.adInk} />
            <Txt v="small">{s.rating.toString().replace('.', ',')} · {list.length} товаров</Txt>
          </Row>
        </View>
      </Row>
      <Txt>{info.about}</Txt>
      <Btn
        label={on ? 'Вы подписаны' : 'Подписаться на новинки'}
        kind={on ? 'outline' : 'accent'}
        icon={on ? 'check' : 'bell'}
        onPress={() => toggleSubscribe(s.id)}
      />
      <Txt v="h2">Товары</Txt>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 18 }}>
        {list.map((p) => <ProductCard key={p.id} p={p} compat={compatCount(p, wardrobe)} />)}
      </View>
    </Screen>
  );
}
