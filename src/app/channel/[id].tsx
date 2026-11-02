import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { Avatar, PostCard } from '../../components/PostCard';
import { BackBar, Btn, Screen, Txt } from '../../components/ui';
import { CHANNELS, POSTS, compactNumber } from '../../data/feed';
import { useStore } from '../../store/AppStore';

export default function ChannelScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { subscriptions, toggleSubscribe, myPosts } = useStore();
  const c = CHANNELS.find((x) => x.id === id);

  if (!c) return <Screen header={<BackBar label="Лента" fallback="/feed" />}><Txt>Канал не найден.</Txt></Screen>;

  const on = subscriptions.includes(c.id);
  const posts = [...myPosts, ...POSTS].filter((p) => p.channelId === c.id);

  return (
    <Screen header={<BackBar label="Лента" fallback="/feed" />}>
      <View style={{ alignItems: 'center', gap: 8 }}>
        <Avatar name={c.name} color={c.color} size={84} />
        <Txt v="display" center style={{ fontSize: 22 }}>{c.name}</Txt>
        <Txt v="small" center>{c.topic}</Txt>
        <Txt v="small" center>{compactNumber(c.subscribers + (on ? 1 : 0))} подписчиков</Txt>
      </View>
      <Btn label={on ? 'Вы подписаны' : 'Подписаться'} kind={on ? 'outline' : 'accent'} icon={on ? 'check' : 'plus'} onPress={() => toggleSubscribe(c.id)} />
      {posts.map((p) => <PostCard key={p.id} post={p} />)}
      {!posts.length && <Txt v="small" center>В канале пока нет публикаций.</Txt>}
    </Screen>
  );
}
