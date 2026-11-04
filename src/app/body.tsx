import { useState } from 'react';
import { TextInput, View } from 'react-native';
import { BackBar, Btn, Card, Chip, R, Row, Screen, Txt, goBack } from '../components/ui';
import { FIT_LABEL, summarySizes, type BodyParams, type Fit } from '../engine/sizing';
import { useStore } from '../store/AppStore';
import { C, F } from '../theme';

type Field = Exclude<keyof BodyParams, 'fit'>;

const FIELDS: { key: Field; label: string; unit: string; hint: string }[] = [
  { key: 'height', label: 'Рост', unit: 'см', hint: 'Без обуви' },
  { key: 'weight', label: 'Вес', unit: 'кг', hint: '' },
  { key: 'chest', label: 'Обхват груди', unit: 'см', hint: 'По самым выступающим точкам' },
  { key: 'waist', label: 'Обхват талии', unit: 'см', hint: 'По самому узкому месту' },
  { key: 'hips', label: 'Обхват бёдер', unit: 'см', hint: 'По самым выступающим точкам' },
  { key: 'foot', label: 'Длина стопы', unit: 'см', hint: 'От пятки до большого пальца' },
];

export default function BodyScreen() {
  const { body, setBody } = useStore();
  const [draft, setDraft] = useState<Record<Field, string>>(
    () => Object.fromEntries(FIELDS.map((f) => [f.key, body[f.key] != null ? String(body[f.key]) : ''])) as Record<Field, string>,
  );
  const [fit, setFit] = useState<Fit>(body.fit);

  const parsed: BodyParams = {
    ...(Object.fromEntries(FIELDS.map((f) => {
      const n = parseFloat(draft[f.key].replace(',', '.'));
      return [f.key, Number.isFinite(n) && n > 0 ? n : null];
    })) as Record<Field, number | null>),
    fit,
  };
  const sizes = summarySizes(parsed);

  return (
    <Screen
      header={<BackBar label="Профиль" title="Мои параметры" fallback="/profile" />}
      footer={
        <View style={{ padding: 20, paddingTop: 12, borderTopWidth: 1, borderTopColor: C.line }}>
          <Btn label="Сохранить" onPress={() => { setBody(parsed); goBack('/profile'); }} />
        </View>
      }
    >
      <Txt>По этим параметрам стилист подбирает не только вещь, но и размер, а в маркете отмечает твой размер в каждом товаре.</Txt>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 }}>
        {FIELDS.map((f) => (
          <View key={f.key} style={{ width: '48%', borderWidth: 1, borderColor: C.line, borderRadius: R.input, paddingHorizontal: 14, paddingVertical: 10, gap: 4, backgroundColor: C.card }}>
            <Txt v="label">{f.label}</Txt>
            <Row gap={6}>
              <TextInput
                accessibilityLabel={`${f.label}, ${f.unit}`}
                value={draft[f.key]}
                onChangeText={(v) => setDraft((d) => ({ ...d, [f.key]: v }))}
                keyboardType="decimal-pad"
                placeholder="—"
                placeholderTextColor={C.muted}
                style={{ flex: 1, minWidth: 0, fontFamily: F.b, fontSize: 18, color: C.ink, height: 30, padding: 0 }}
              />
              <Txt v="small">{f.unit}</Txt>
            </Row>
            {f.hint ? <Txt v="small" style={{ fontSize: 11 }}>{f.hint}</Txt> : null}
          </View>
        ))}
      </View>

      <View style={{ gap: 8 }}>
        <Txt v="label">Как любишь носить</Txt>
        <Row gap={8}>
          {(Object.keys(FIT_LABEL) as Fit[]).map((k) => <Chip key={k} label={FIT_LABEL[k]} selected={fit === k} onPress={() => setFit(k)} />)}
        </Row>
        <Txt v="small">Если ты между размерами: облегающая — берём меньший, свободная — больший.</Txt>
      </View>

      <Card tone="accent">
        <Txt v="title">Твои размеры</Txt>
        <Txt>{sizes || 'Заполни обхваты и длину стопы — покажем размеры.'}</Txt>
      </Card>

      <Txt v="small">Параметры видишь только ты. Они хранятся в твоём профиле и используются только для подбора размера.</Txt>
    </Screen>
  );
}
