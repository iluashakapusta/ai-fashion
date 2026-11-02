import Feather from '@expo/vector-icons/Feather';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { BackBar, R, Screen, Txt } from '../components/ui';
import { useTheme } from '../store/ThemeStore';
import { C, THEMES, type Theme } from '../theme';

export default function ThemeScreen() {
  const { themeId, setTheme, preloadAll } = useTheme();
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    preloadAll().finally(() => setReady(true));
  }, [preloadAll]);

  const pick = async (id: string) => {
    if (id === themeId) return;
    setBusy(id);
    await setTheme(id);
  };

  return (
    <Screen header={<BackBar label="Профиль" title="Оформление" fallback="/profile" />}>
      <Txt>Одна классическая эстетика — пять настроений. Выбор сохранится на этом устройстве.</Txt>
      {!ready ? (
        <ActivityIndicator color={C.accent} style={{ marginTop: 40 }} />
      ) : (
        THEMES.map((t) => <ThemeCard key={t.id} t={t} selected={t.id === themeId} busy={busy === t.id} onPress={() => pick(t.id)} />)
      )}
    </Screen>
  );
}

/** A miniature of the app painted in the theme's own colours and fonts. */
function ThemeCard({ t, selected, busy, onPress }: { t: Theme; selected: boolean; busy: boolean; onPress: () => void }) {
  const c = t.colors;
  const f = t.fonts;
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`Тема ${t.name}`}
      onPress={onPress}
      style={{ borderRadius: R.card, borderWidth: selected ? 2 : 1, borderColor: selected ? C.accent : C.line, overflow: 'hidden' }}
    >
      <View style={{ backgroundColor: c.ground, padding: 16, gap: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={{ fontFamily: f.b, fontSize: 10.5, letterSpacing: 1.6, textTransform: 'uppercase', color: c.muted }}>{t.pairing}</Text>
            <Text style={{ fontFamily: f.d, fontSize: t.displaySize, lineHeight: Math.round(t.displaySize * 1.15), color: c.ink }}>{t.name}</Text>
          </View>
          {busy ? (
            <ActivityIndicator color={c.accent} />
          ) : selected ? (
            <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' }}>
              <Feather name="check" size={15} color={c.onAccent} />
            </View>
          ) : null}
        </View>
        <Text style={{ fontFamily: f.m, fontSize: 14, lineHeight: 20, color: c.ink }}>{t.description}</Text>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <View style={{ flex: 1, height: 40, borderRadius: R.btn, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontFamily: f.b, fontSize: 11.5, letterSpacing: 1.3, textTransform: 'uppercase', color: c.onAccent }}>Подобрать образ</Text>
          </View>
          <View style={{ height: 40, paddingHorizontal: 14, borderRadius: R.card, backgroundColor: c.dark, justifyContent: 'center' }}>
            <Text style={{ fontFamily: f.d, fontSize: 15, color: c.onDarkAccent }}>Premium</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {[c.ground, c.surface, c.accent, c.dark, c.onDarkAccent].map((x, i) => (
            <View key={i} style={{ flex: 1, height: 14, borderRadius: 2, backgroundColor: x, borderWidth: 1, borderColor: c.line }} />
          ))}
        </View>
      </View>
    </Pressable>
  );
}
