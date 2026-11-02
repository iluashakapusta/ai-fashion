import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { GarmentTile } from '../../components/GarmentIcon';
import { BackBar, Btn, Card, Chip, Row, Screen, Txt, goBack } from '../../components/ui';
import { KIND_LABEL, OCCASION_LABEL } from '../../data/types';
import { harmonize } from '../../engine/stylist';
import { useStore } from '../../store/AppStore';
import { plural, rub } from '../../theme';

const SEASON = { hot: 'лето', warm: 'весна', cool: 'осень', cold: 'зима' } as const;

export default function ItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { wardrobe, removeItem } = useStore();
  const item = wardrobe.find((w) => w.id === id);

  if (!item) {
    return (
      <Screen header={<BackBar label="Гардероб" fallback="/wardrobe" />}>
        <Txt>Вещь не найдена.</Txt>
      </Screen>
    );
  }

  const pairs = wardrobe.filter((w) => w.id !== item.id && harmonize(item, w));
  const perWear = item.price && item.wears ? item.price / item.wears : null;

  return (
    <Screen header={<BackBar label="Гардероб" fallback="/wardrobe" />}>
      <GarmentTile item={item} radius={24} />
      <View style={{ gap: 4 }}>
        <Txt v="display" style={{ fontSize: 22 }}>{item.name}</Txt>
        <Txt v="small">{KIND_LABEL[item.kind]} · {item.colorName}{item.material ? ` · ${item.material}` : ''}</Txt>
      </View>
      <Row gap={8} wrap>
        {item.styles.map((s) => <Chip key={s} tone="soft" label={OCCASION_LABEL[s]} />)}
        {item.warmth.map((w) => <Chip key={w} tone="soft" label={SEASON[w]} />)}
      </Row>
      <Card tone="surface">
        <Row style={{ justifyContent: 'space-between' }}><Txt v="small">Выходов в этой вещи</Txt><Txt v="bodyB">{item.wears}</Txt></Row>
        {perWear ? <Row style={{ justifyContent: 'space-between' }}><Txt v="small">Цена одного выхода</Txt><Txt v="bodyB">{rub(perWear)}</Txt></Row> : null}
        <Row style={{ justifyContent: 'space-between' }}><Txt v="small">Сочетается с</Txt><Txt v="bodyB">{pairs.length} {plural(pairs.length, ['вещью', 'вещами', 'вещами'])}</Txt></Row>
      </Card>
      {pairs.length > 0 && (
        <View style={{ gap: 10 }}>
          <Txt v="h2">С чем носить</Txt>
          <Row gap={8} wrap>
            {pairs.slice(0, 8).map((p) => <GarmentTile key={p.id} item={p} size={72} radius={14} />)}
          </Row>
        </View>
      )}
      <Btn label="Подобрать образ с этой вещью" kind="accent" onPress={() => router.push({ pathname: '/stylist', params: { q: `Собери образ на каждый день с вещью «${item.name}»` } })} />
      {item.wears <= 1 && <Btn label="Продать в маркете" kind="outline" icon="tag" onPress={() => router.push('/seller')} />}
      <Btn label="Удалить из гардероба" kind="ghost" onPress={() => { removeItem(item.id); goBack('/wardrobe'); }} />
    </Screen>
  );
}
