import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Avatar, PostCard } from '../../components/PostCard';
import { Btn, IconButton, Row, Screen, Txt } from '../../components/ui';
import { CHANNELS, NEWS, POSTS, ago } from '../../data/feed';
import { useStore } from '../../store/AppStore';
import { C, F } from '../../theme';

type Section = 'news' | 'community';

export default function Feed() {
  const [section, setSection] = useState<Section>('news');
  const { myPosts, subscriptions } = useStore();
  const myChannels = CHANNELS.filter((c) => subscriptions.includes(c.id));
  const others = CHANNELS.filter((c) => !subscriptions.includes(c.id));

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between' }}>
        <Txt v="display">Лента</Txt>
        {section === 'community' && <IconButton icon="plus" label="Опубликовать образ" dark onPress={() => router.push('/post/new')} />}
      </Row>

      <View accessibilityRole="tablist" style={{ flexDirection: 'row', backgroundColor: C.surface, borderRadius: 24, padding: 4 }}>
        {(['news', 'community'] as Section[]).map((s) => {
          const on = section === s;
          return (
            <Pressable
              key={s}
              accessibilityRole="tab"
              accessibilityState={{ selected: on }}
              onPress={() => setSection(s)}
              style={{ flex: 1, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: on ? C.ground : 'transparent' }}
            >
              <Txt v="bodyB" color={on ? C.ink : C.muted}>{s === 'news' ? 'Новости' : 'Сообщество'}</Txt>
            </Pressable>
          );
        })}
      </View>

      {section === 'news' ? (
        NEWS.map((n) => (
          <View key={n.id} style={{ borderRadius: 22, overflow: 'hidden', borderWidth: 1, borderColor: C.line }}>
            <View style={{ height: 120, backgroundColor: n.color, padding: 16, justifyContent: 'flex-end' }}>
              <View style={{ alignSelf: 'flex-start', height: 26, paddingHorizontal: 10, borderRadius: 13, backgroundColor: '#FFFFFF', justifyContent: 'center' }}>
                <Txt v="small" color={C.ink} style={{ fontFamily: F.b }}>{n.tag}</Txt>
              </View>
            </View>
            <View style={{ padding: 16, gap: 6 }}>
              <Txt v="h2">{n.title}</Txt>
              <Txt>{n.text}</Txt>
              <Txt v="small">{ago(n.hoursAgo)} · {n.minutes} мин чтения</Txt>
            </View>
          </View>
        ))
      ) : (
        <>
          <View style={{ gap: 10 }}>
            <Txt v="label">Каналы</Txt>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 14 }} style={{ marginHorizontal: -20, paddingHorizontal: 20, flexGrow: 0 }}>
              {[...myChannels, ...others].map((c) => (
                <Pressable
                  key={c.id}
                  accessibilityRole="link"
                  onPress={() => router.push({ pathname: '/channel/[id]', params: { id: c.id } })}
                  style={{ width: 76, alignItems: 'center', gap: 6 }}
                >
                  <View style={{ padding: 2, borderRadius: 32, borderWidth: 2, borderColor: subscriptions.includes(c.id) ? C.accent : 'transparent' }}>
                    <Avatar name={c.name} color={c.color} size={56} />
                  </View>
                  <Txt v="small" color={C.ink} center lines={2} style={{ fontSize: 11 }}>{c.name}</Txt>
                </Pressable>
              ))}
              <View style={{ width: 20 }} />
            </ScrollView>
          </View>

          {myPosts.length === 0 && (
            <View style={{ borderRadius: 22, backgroundColor: C.accentSoft, padding: 16, gap: 10 }}>
              <Txt v="title">Покажи свой образ</Txt>
              <Txt>Собери образ из своего гардероба и опубликуй — в общей ленте или в тематическом канале.</Txt>
              <Btn label="Опубликовать образ" kind="accent" small icon="plus" style={{ alignSelf: 'flex-start' }} onPress={() => router.push('/post/new')} />
            </View>
          )}

          {[...myPosts, ...POSTS].map((p) => <PostCard key={p.id} post={p} />)}
        </>
      )}
    </Screen>
  );
}
