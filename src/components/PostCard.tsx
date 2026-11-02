import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { CHANNELS, ago, type Post } from '../data/feed';
import { useStore } from '../store/AppStore';
import { C, F } from '../theme';
import { GarmentTile } from './GarmentIcon';
import { Row, Txt } from './ui';

export function Avatar({ name, color, size = 40 }: { name: string; color: string; size?: number }) {
  const initials = name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontFamily: F.xb, fontSize: size * 0.36, color: '#FFFFFF' }}>{initials}</Text>
    </View>
  );
}

export function PostCard({ post }: { post: Post }) {
  const { likes, toggleLike, reported, report } = useStore();
  const [menu, setMenu] = useState(false);
  const channel = CHANNELS.find((c) => c.id === post.channelId);
  const liked = likes.includes(post.id);

  if (reported.includes(post.id)) {
    return (
      <View style={{ borderRadius: 22, backgroundColor: C.surface, padding: 16 }}>
        <Txt v="small">Публикация скрыта. Спасибо — модераторы её проверят.</Txt>
      </View>
    );
  }

  return (
    <View style={{ borderRadius: 22, borderWidth: 1, borderColor: C.line, padding: 14, gap: 12, backgroundColor: C.ground }}>
      <Row gap={10}>
        <Avatar name={post.author} color={post.authorColor} />
        <View style={{ flex: 1 }}>
          <Txt v="bodyB">{post.author}</Txt>
          <Row gap={4}>
            {channel ? (
              <Pressable accessibilityRole="link" onPress={() => router.push({ pathname: '/channel/[id]', params: { id: channel.id } })}>
                <Txt v="small" color={C.accent}>{channel.name}</Txt>
              </Pressable>
            ) : null}
            <Txt v="small">{channel ? ' · ' : ''}{ago(post.hoursAgo)}</Txt>
          </Row>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Ещё" onPress={() => setMenu(!menu)} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
          <Feather name="more-horizontal" size={20} color={C.muted} />
        </Pressable>
      </Row>

      {menu && (
        <Row gap={8}>
          <Pressable accessibilityRole="button" onPress={() => report(post.id)} style={{ height: 36, paddingHorizontal: 14, borderRadius: 18, borderWidth: 1, borderColor: C.line, justifyContent: 'center' }}>
            <Txt v="small" color={C.danger}>Пожаловаться</Txt>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => report(post.id)} style={{ height: 36, paddingHorizontal: 14, borderRadius: 18, borderWidth: 1, borderColor: C.line, justifyContent: 'center' }}>
            <Txt v="small" color={C.ink}>Скрыть автора</Txt>
          </Pressable>
        </Row>
      )}

      <Row gap={8}>
        {post.items.slice(0, 4).map((g) => (
          <View key={g.id} style={{ flex: 1, maxWidth: '25%' }}>
            <GarmentTile item={g} radius={14} />
          </View>
        ))}
      </Row>

      <Txt>{post.caption}</Txt>

      <Row gap={4} style={{ marginLeft: -10 }}>
        <Pressable accessibilityRole="button" accessibilityLabel={liked ? 'Убрать лайк' : 'Нравится'} onPress={() => toggleLike(post.id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44, paddingHorizontal: 10 }}>
          <Feather name="heart" size={18} color={liked ? C.danger : C.ink} />
          <Txt v="bodyB" color={liked ? C.danger : C.ink}>{post.likes + (liked ? 1 : 0)}</Txt>
        </Pressable>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44, paddingHorizontal: 10 }}>
          <Feather name="message-circle" size={18} color={C.ink} />
          <Txt v="bodyB">{post.comments}</Txt>
        </View>
        <View style={{ flex: 1 }} />
        <Pressable accessibilityRole="button" onPress={() => router.push({ pathname: '/stylist', params: { q: post.prompt } })} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44, paddingHorizontal: 12, borderRadius: 22, backgroundColor: C.accentSoft }}>
          <Feather name="zap" size={15} color={C.accent} />
          <Txt v="small" color={C.accent} style={{ fontFamily: F.b }}>Собрать похожий</Txt>
        </Pressable>
      </Row>
    </View>
  );
}
