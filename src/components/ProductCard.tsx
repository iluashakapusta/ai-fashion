import { Link } from 'expo-router';
import { Pressable, View } from 'react-native';
import type { Product } from '../data/types';
import { C, F, rub } from '../theme';
import { GarmentTile } from './GarmentIcon';
import { AdBadge, Row, Txt } from './ui';

export function ProductCard({ p, compat, width = '48%' }: { p: Product; compat: number; width?: `${number}%` | number }) {
  return (
    <Link href={{ pathname: '/product/[id]', params: { id: p.id } }} asChild>
      <Pressable accessibilityRole="link" accessibilityLabel={p.name} style={{ width, gap: 8 }}>
        <View>
          <GarmentTile item={p} radius={18} />
          {p.sponsored && <View style={{ position: 'absolute', top: 8, left: 8 }}><AdBadge /></View>}
        </View>
        <View style={{ gap: 2 }}>
          <Txt v="small" color={C.ink} style={{ fontFamily: F.b, fontSize: 13 }} lines={1}>{p.name}</Txt>
          <Row gap={6}>
            <Txt v="bodyB">{rub(p.price)}</Txt>
            {p.oldPrice ? <Txt v="small" style={{ textDecorationLine: 'line-through' }}>{rub(p.oldPrice)}</Txt> : null}
          </Row>
          <Txt v="small" color={compat > 0 ? C.accent : C.muted} style={{ fontSize: 11 }}>
            {compat > 0 ? `Сочетается с ${compat} твоими вещами` : 'Мало сочетаний с гардеробом'}
          </Txt>
        </View>
      </Pressable>
    </Link>
  );
}
