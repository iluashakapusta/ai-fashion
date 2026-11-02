import Feather from '@expo/vector-icons/Feather';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { GarmentTile } from '../../components/GarmentIcon';
import { BackBar, Btn, Chip, Row, Screen, Txt, goBack } from '../../components/ui';
import { CHANNELS } from '../../data/feed';
import { useStore } from '../../store/AppStore';
import { C, F } from '../../theme';

const MAX = 4;

export default function NewPost() {
  const { wardrobe, addPost } = useStore();
  const [picked, setPicked] = useState<string[]>([]);
  const [caption, setCaption] = useState('');
  const [channel, setChannel] = useState<string | undefined>(undefined);

  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length < MAX ? [...p, id] : p));

  const publish = () => {
    addPost({
      caption: caption.trim() || 'Мой образ дня',
      items: picked.map((id) => wardrobe.find((w) => w.id === id)!).filter(Boolean),
      channelId: channel,
      prompt: 'Собери повседневный образ на прогулку',
    });
    goBack('/feed');
  };

  return (
    <Screen
      header={<BackBar label="Лента" title="Новый образ" fallback="/feed" />}
      edges={['top', 'bottom']}
      footer={
        <View style={{ padding: 20, paddingTop: 12, borderTopWidth: 1, borderTopColor: C.line }}>
          <Btn label="Опубликовать" kind="accent" disabled={picked.length < 2} onPress={publish} />
        </View>
      }
    >
      <Txt v="label">Выбери вещи · {picked.length} из {MAX}</Txt>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {wardrobe.map((w) => {
          const on = picked.includes(w.id);
          return (
            <Pressable
              key={w.id}
              accessibilityRole="checkbox"
              accessibilityLabel={w.name}
              accessibilityState={{ checked: on }}
              onPress={() => toggle(w.id)}
              style={{ width: '22.5%' }}
            >
              <GarmentTile item={w} radius={14} ring={on} />
              {on && (
                <View style={{ position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: 11, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center' }}>
                  <Feather name="check" size={13} color={C.onAccent} />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      <View style={{ borderWidth: 1, borderColor: C.line, borderRadius: 6, paddingHorizontal: 14, paddingVertical: 10, gap: 4 }}>
        <Txt v="label">Подпись</Txt>
        <TextInput
          accessibilityLabel="Подпись"
          value={caption}
          onChangeText={setCaption}
          placeholder="Куда идёшь в этом образе?"
          placeholderTextColor={C.muted}
          multiline
          style={{ fontFamily: F.m, fontSize: 15, color: C.ink, minHeight: 60, textAlignVertical: 'top' }}
        />
      </View>

      <View style={{ gap: 8 }}>
        <Txt v="label">Где опубликовать</Txt>
        <Row gap={8} wrap>
          <Chip label="Общая лента" selected={!channel} onPress={() => setChannel(undefined)} />
          {CHANNELS.map((c) => <Chip key={c.id} label={c.name} selected={channel === c.id} onPress={() => setChannel(c.id)} />)}
        </Row>
      </View>
    </Screen>
  );
}
