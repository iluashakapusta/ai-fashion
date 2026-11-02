import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator, Pressable, ScrollView, Switch, Text, View, type StyleProp, type TextStyle, type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, F, T } from '../theme';

export type IconName = React.ComponentProps<typeof Feather>['name'];

/** Shared shape language: small, tailored corners rather than pills. */
export const R = { btn: 4, chip: 3, card: 10, input: 6, tile: 6 };

type Variant = 'display' | 'big' | 'h2' | 'title' | 'body' | 'bodyB' | 'small' | 'label';

// Built at render time: fonts and sizes depend on the current theme.
function variant(v: Variant): TextStyle {
  switch (v) {
    case 'display': return { fontFamily: F.d, fontSize: T.displaySize, lineHeight: Math.round(T.displaySize * 1.18) };
    case 'big': return { fontFamily: F.dm, fontSize: T.bigSize, lineHeight: Math.round(T.bigSize * 1.1) };
    case 'h2': return { fontFamily: F.d, fontSize: Math.round(T.displaySize * 0.68), lineHeight: Math.round(T.displaySize * 0.86) };
    case 'title': return { fontFamily: F.xb, fontSize: 15, lineHeight: 20 };
    case 'body': return { fontFamily: F.m, fontSize: 14, lineHeight: 21 };
    case 'bodyB': return { fontFamily: F.b, fontSize: 14, lineHeight: 21 };
    case 'small': return { fontFamily: F.sb, fontSize: 12, lineHeight: 17 };
    case 'label': return { fontFamily: F.b, fontSize: 10.5, lineHeight: 14, letterSpacing: 1.6, textTransform: 'uppercase' };
  }
}

export function Txt({
  v = 'body', color, style, children, lines, center,
}: {
  v?: Variant; color?: string; style?: StyleProp<TextStyle>; children: React.ReactNode; lines?: number; center?: boolean;
}) {
  const muted = v === 'small' || v === 'label';
  return (
    <Text numberOfLines={lines} style={[variant(v), { color: color ?? (muted ? C.muted : C.ink) }, center && { textAlign: 'center' }, style]}>
      {children}
    </Text>
  );
}

type BtnKind = 'dark' | 'accent' | 'outline' | 'ghost' | 'light';

export function Btn({
  label, onPress, kind = 'dark', icon, small, disabled, loading, style, color,
}: {
  /** Overrides the label colour, e.g. a ghost button on an inverse block. */
  color?: string;
  label: string; onPress?: () => void; kind?: BtnKind; icon?: IconName; small?: boolean; disabled?: boolean; loading?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const bg = { dark: C.dark, accent: C.accent, outline: 'transparent', ghost: 'transparent', light: C.onDark }[kind];
  const fg = color ?? { dark: C.onDark, accent: C.onAccent, outline: C.ink, ghost: C.accent, light: C.dark }[kind];
  const h = small ? 40 : 52;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [{
        height: h, borderRadius: R.btn, paddingHorizontal: small ? 14 : 20, backgroundColor: bg,
        borderWidth: kind === 'outline' ? 1 : 0, borderColor: C.ink,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
        opacity: disabled ? 0.4 : pressed ? 0.75 : 1,
      }, style]}
    >
      {loading ? <ActivityIndicator color={fg} /> : icon ? <Feather name={icon} size={small ? 15 : 17} color={fg} /> : null}
      <Text style={{ fontFamily: F.b, fontSize: small ? 11.5 : 13, letterSpacing: 1.3, textTransform: 'uppercase', color: fg }}>{label}</Text>
    </Pressable>
  );
}

export function Chip({
  label, selected, onPress, tone = 'default',
}: { label: string; selected?: boolean; onPress?: () => void; tone?: 'default' | 'soft' }) {
  const soft = tone === 'soft';
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={{
        height: soft ? 28 : 36, paddingHorizontal: soft ? 10 : 14, borderRadius: R.chip, justifyContent: 'center',
        backgroundColor: selected ? C.dark : soft ? C.surface : 'transparent',
        borderWidth: selected || soft ? 0 : 1, borderColor: C.line,
      }}
    >
      <Text style={{ fontFamily: F.sb, fontSize: soft ? 12 : 13, color: selected ? C.onDark : C.ink }}>{label}</Text>
    </Pressable>
  );
}

export function AdBadge() {
  return (
    <View style={{ height: 20, paddingHorizontal: 7, borderRadius: R.chip, backgroundColor: C.adBg, justifyContent: 'center' }}>
      <Text style={{ fontFamily: F.b, fontSize: 10.5, letterSpacing: 0.8, textTransform: 'uppercase', color: C.adInk }}>Реклама</Text>
    </View>
  );
}

export function Card({ children, style, tone = 'line' }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; tone?: 'line' | 'surface' | 'accent' | 'dark' | 'ad' }) {
  const bg = { line: C.card, surface: C.surface, accent: C.accentSoft, dark: C.dark, ad: C.adBg }[tone];
  return (
    <View style={[{ backgroundColor: bg, borderRadius: R.card, padding: 16, gap: 10, borderWidth: tone === 'line' ? 1 : 0, borderColor: C.line }, style]}>
      {children}
    </View>
  );
}

export function Row({ children, gap = 8, style, wrap }: { children: React.ReactNode; gap?: number; style?: StyleProp<ViewStyle>; wrap?: boolean }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center', gap, flexWrap: wrap ? 'wrap' : 'nowrap' }, style]}>{children}</View>;
}

export function IconButton({ icon, label, onPress, badge, dark }: { icon: IconName; label: string; onPress?: () => void; badge?: number; dark?: boolean }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => ({
        width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center',
        borderWidth: dark ? 0 : 1, borderColor: C.line, backgroundColor: dark ? C.accent : 'transparent', opacity: pressed ? 0.7 : 1,
      })}
    >
      <Feather name={icon} size={19} color={dark ? C.onAccent : C.ink} />
      {!!badge && (
        <View style={{ position: 'absolute', top: -2, right: -2, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 }}>
          <Text style={{ fontFamily: F.xb, fontSize: 10, color: C.onAccent }}>{badge}</Text>
        </View>
      )}
    </Pressable>
  );
}

export function goBack(fallback = '/') {
  if (router.canGoBack()) router.back();
  else router.replace(fallback as never);
}

export function BackBar({ label = 'Назад', title, right, fallback }: { label?: string; title?: string; right?: React.ReactNode; fallback?: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, paddingTop: 4, minHeight: 52 }}>
      <Pressable accessibilityRole="button" onPress={() => goBack(fallback)} style={{ flexDirection: 'row', alignItems: 'center', gap: 2, minHeight: 44, paddingHorizontal: 8, flex: 1 }}>
        <Feather name="chevron-left" size={22} color={C.ink} />
        <Text style={{ fontFamily: F.sb, fontSize: 15, color: C.ink }}>{label}</Text>
      </Pressable>
      {title ? <Text style={{ fontFamily: F.d, fontSize: 17, color: C.ink }}>{title}</Text> : null}
      <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: 8 }}>{right}</View>
    </View>
  );
}

export function Screen({
  children, scroll = true, header, footer, bg, pad = 20, gap = 18, edges = ['top'],
}: {
  children: React.ReactNode; scroll?: boolean; header?: React.ReactNode; footer?: React.ReactNode; bg?: string; pad?: number; gap?: number;
  edges?: ('top' | 'bottom')[];
}) {
  return (
    <SafeAreaView edges={edges} style={{ flex: 1, backgroundColor: bg ?? C.ground }}>
      {header}
      {scroll ? (
        <ScrollView contentContainerStyle={{ padding: pad, paddingTop: header ? 4 : pad + 8, gap, paddingBottom: 32 }} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>{children}</View>
      )}
      {footer}
    </SafeAreaView>
  );
}

export function ToggleRow({ label, hint, value, onChange }: { label: string; hint?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 52, paddingVertical: 6 }}>
      <View style={{ flex: 1, gap: 2 }}>
        <Txt v="bodyB">{label}</Txt>
        {hint ? <Txt v="small">{hint}</Txt> : null}
      </View>
      <Switch
        accessibilityLabel={label}
        value={value}
        onValueChange={onChange}
        trackColor={{ true: C.accent, false: C.line }}
        thumbColor={C.card}
      />
    </View>
  );
}

export function Divider() {
  return <View style={{ height: 1, backgroundColor: C.line }} />;
}
