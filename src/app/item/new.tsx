import Feather from '@expo/vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { GarmentTile } from '../../components/GarmentIcon';
import { BackBar, Btn, Card, Chip, Row, Screen, Txt, goBack } from '../../components/ui';
import { KIND_LABEL, OCCASION_LABEL, type Garment, type Kind, type Occasion, type Tone, type Warmth } from '../../data/types';
import { compatCount, newOutfitsWith } from '../../engine/stylist';
import { useStore } from '../../store/AppStore';
import { C, F, plural } from '../../theme';

const COLORS: { hex: string; name: string; tone: Tone }[] = [
  { hex: '#1F2A44', name: 'тёмно-синий', tone: 'cool' },
  { hex: '#1E1E1E', name: 'чёрный', tone: 'neutral' },
  { hex: '#FFFFFF', name: 'белый', tone: 'neutral' },
  { hex: '#9A9C9F', name: 'серый', tone: 'neutral' },
  { hex: '#D8C8AA', name: 'бежевый', tone: 'warm' },
  { hex: '#5A3B28', name: 'коричневый', tone: 'warm' },
  { hex: '#4E6A8C', name: 'синий', tone: 'cool' },
  { hex: '#4B5A4A', name: 'хаки', tone: 'warm' },
  { hex: '#B5475B', name: 'бордовый', tone: 'bright' },
];
const KINDS: Kind[] = ['top', 'bottom', 'dress', 'outer', 'shoes', 'acc'];
const OCCASIONS: Occasion[] = ['casual', 'office', 'date', 'evening', 'party', 'beach', 'sport', 'interview'];
const WARMTH: { id: Warmth; label: string }[] = [
  { id: 'hot', label: 'Лето' }, { id: 'warm', label: 'Весна' }, { id: 'cool', label: 'Осень' }, { id: 'cold', label: 'Зима' },
];
const STEPS = ['Удаляем фон', 'Определяем тип вещи', 'Определяем цвет и материал', 'Подбираем стиль и сезон'];

type Draft = Omit<Garment, 'id'> & { photoUri?: string };

const RECOGNIZED: Draft = {
  name: 'Кардиган', kind: 'outer', color: '#1F2A44', colorName: 'тёмно-синий', tone: 'cool',
  material: 'шерсть', styles: ['casual', 'office', 'date'], warmth: ['cool', 'cold'],
};

export default function NewItem() {
  const { wardrobe, addItem } = useStore();
  const [stage, setStage] = useState<'pick' | 'processing' | 'edit'>('pick');
  const [done, setDone] = useState(0);
  const [d, setD] = useState<Draft>(RECOGNIZED);

  useEffect(() => {
    if (stage !== 'processing') return;
    if (done >= STEPS.length) {
      const t = setTimeout(() => setStage('edit'), 350);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setDone((n) => n + 1), 650);
    return () => clearTimeout(t);
  }, [stage, done]);

  const start = (photoUri?: string) => {
    setD({ ...RECOGNIZED, photoUri });
    setDone(0);
    setStage('processing');
  };

  const fromCamera = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return fromLibrary();
    const r = await ImagePicker.launchCameraAsync({ quality: 0.7, allowsEditing: true, aspect: [1, 1] });
    if (!r.canceled) start(r.assets[0].uri);
  };
  const fromLibrary = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7, allowsEditing: true, aspect: [1, 1] });
    if (!r.canceled) start(r.assets[0].uri);
  };

  const preview: Garment = { ...d, id: 'draft' };
  const pairs = compatCount(preview, wardrobe);
  const extra = Math.max(0, newOutfitsWith(preview, wardrobe));

  const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  if (stage === 'pick') {
    return (
      <Screen header={<BackBar label="Гардероб" title="Новая вещь" fallback="/wardrobe" />} edges={['top', 'bottom']}>
        <View style={{ height: 240, borderRadius: 24, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <Feather name="camera" size={40} color={C.muted} />
          <Txt v="small" center style={{ maxWidth: 240 }}>Сфотографируй вещь на любом фоне — AI сам удалит фон и заполнит описание</Txt>
        </View>
        <Btn label="Сфотографировать" icon="camera" onPress={fromCamera} />
        <Btn label="Выбрать из галереи" icon="image" kind="outline" onPress={fromLibrary} />
        <Btn label="Показать на примере" kind="ghost" onPress={() => start()} />
      </Screen>
    );
  }

  if (stage === 'processing') {
    return (
      <Screen header={<BackBar label="Гардероб" title="Новая вещь" fallback="/wardrobe" />} edges={['top', 'bottom']}>
        <GarmentTile item={preview} radius={24} style={{ opacity: 0.35 + (done / STEPS.length) * 0.65 }} />
        <View style={{ gap: 12 }}>
          {STEPS.map((s, i) => (
            <Row key={s} gap={10}>
              <View style={{ width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: i < done ? C.ok : C.surface }}>
                {i < done && <Feather name="check" size={14} color="#FFFFFF" />}
              </View>
              <Txt color={i < done ? C.ink : C.muted}>{s}</Txt>
            </Row>
          ))}
        </View>
      </Screen>
    );
  }

  return (
    <Screen
      header={<BackBar label="Гардероб" title="Новая вещь" fallback="/wardrobe" />}
      edges={['top', 'bottom']}
      footer={
        <View style={{ padding: 20, paddingTop: 12, borderTopWidth: 1, borderTopColor: C.line }}>
          <Btn label="Сохранить в гардероб" disabled={!d.name.trim() || !d.styles.length || !d.warmth.length} onPress={() => { addItem(d); goBack('/wardrobe'); }} />
        </View>
      }
    >
      <View>
        <GarmentTile item={preview} radius={24} style={{ height: 220, aspectRatio: undefined }} />
        <View style={{ position: 'absolute', top: 12, left: 12, flexDirection: 'row', alignItems: 'center', gap: 6, height: 30, paddingHorizontal: 12, borderRadius: 15, backgroundColor: '#FFFFFF' }}>
          <Feather name="check" size={14} color={C.ok} />
          <Txt v="small" color={C.ink}>{d.photoUri ? 'Фото обработано' : 'Фон удалён'}</Txt>
        </View>
      </View>

      <Row>
        <Feather name="zap" size={18} color={C.accent} />
        <Txt v="h2" style={{ flex: 1 }}>AI распознал вещь</Txt>
        <Txt v="small">можно поправить</Txt>
      </Row>

      <Field label="Название">
        <TextInput accessibilityLabel="Название" value={d.name} onChangeText={(name) => setD({ ...d, name })} style={inputStyle} />
      </Field>
      <Field label="Материал">
        <TextInput accessibilityLabel="Материал" value={d.material} onChangeText={(material) => setD({ ...d, material })} style={inputStyle} />
      </Field>

      <Group label="Тип">
        {KINDS.map((k) => <Chip key={k} label={KIND_LABEL[k]} selected={d.kind === k} onPress={() => setD({ ...d, kind: k })} />)}
      </Group>

      <Group label={`Цвет · ${d.colorName}`}>
        {COLORS.map((c) => (
          <Pressable
            key={c.hex}
            accessibilityRole="button"
            accessibilityLabel={c.name}
            accessibilityState={{ selected: d.color === c.hex }}
            onPress={() => setD({ ...d, color: c.hex, colorName: c.name, tone: c.tone })}
            style={{ width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: d.color === c.hex ? C.accent : 'transparent' }}
          >
            <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: c.hex, borderWidth: 1, borderColor: C.line }} />
          </Pressable>
        ))}
      </Group>

      <Group label="Куда носить">
        {OCCASIONS.map((o) => <Chip key={o} label={OCCASION_LABEL[o]} selected={d.styles.includes(o)} onPress={() => setD({ ...d, styles: toggle(d.styles, o) })} />)}
      </Group>

      <Group label="Сезон">
        {WARMTH.map((w) => <Chip key={w.id} label={w.label} selected={d.warmth.includes(w.id)} onPress={() => setD({ ...d, warmth: toggle(d.warmth, w.id) })} />)}
      </Group>

      <Card tone="accent">
        <Txt>
          Сочетается с <Txt v="bodyB">{pairs} {plural(pairs, ['вещью', 'вещами', 'вещами'])}</Txt> из твоего гардероба
          {extra > 0 ? <> — это ещё <Txt v="bodyB">{extra} {plural(extra, ['новый образ', 'новых образа', 'новых образов'])}</Txt>.</> : '.'}
        </Txt>
      </Card>
    </Screen>
  );
}

const inputStyle = { fontFamily: F.b, fontSize: 15, color: C.ink, height: 28, padding: 0 } as const;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ borderWidth: 1, borderColor: C.line, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, gap: 4 }}>
      <Txt v="label">{label}</Txt>
      {children}
    </View>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 8 }}>
      <Txt v="label">{label}</Txt>
      <Row gap={8} wrap>{children}</Row>
    </View>
  );
}
