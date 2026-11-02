import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator, Pressable, ScrollView, Switch, Text, View, type StyleProp, type TextStyle, type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, F } from '../theme';

export type IconName = React.ComponentProps<typeof Feather>['name'];

const VARIANTS: Record<string, TextStyle> = {
  display: { fontFamily: F.d, fontSize: 26, lineHeight: 32, letterSpacing: -0.4 },
  big: { fontFamily: F.dm, fontSize: 40, lineHeight: 46, letterSpacing: -1 },
  h2: { fontFamily: F.xb, fontSize: 17, lineHeight: 22 },
  title: { fontFamily: F.xb, fontSize: 15, lineHeight: 20 },
  body: { fontFamily: F.m, fontSize: 14, lineHeight: 20 },
  bodyB: { fontFamily: F.b, fontSize: 14, lineHeight: 20 },
  small: { fontFamily: F.sb, fontSize: 12, lineHeight: 16 },
  label: { fontFamily: F.b, fontSize: 11, lineHeight: 14, letterSpacing: 0.6, textTransform: 'uppercase' },
};

export function Txt({
  v = 'body', color, style, children, lines, center,
}: {
  v?: keyof typeof VARIANTS; color?: string; style?: StyleProp<TextStyle>; children: React.ReactNode; lines?: number; center?: boolean;
}) {
  const muted = v === 'small' || v === 'label';
  return (
    <Text
      numberOfLines={lines}
      style={[VARIANTS[v], { color: color ?? (muted ? C.muted : C.ink) }, center && { textAlign: 'center' }, style]}
    >
      {children}
    </Text>
  );
}

type BtnKind = 'dark' | 'accent' | 'outline' | 'ghost' | 'light';

export function Btn({
  label, onPress, kind = 'dark', icon, small, disabled, loading, style,
}: {
  label: string; onPress?: () => void; kind?: BtnKind; icon?: IconName; small?: boolean; disabled?: boolean; loading?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const bg = { dark: C.dark, accent: C.accent, outline: C.ground, ghost: 'transparent', light: '#FFFFFF' }[kind];
  const fg = { dark: '#FFFFFF', accent: '#FFFFFF', outline: C.ink, ghost: C.accent, light: C.ink }[kind];
  const h = small ? 38 : 52;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [{
        height: h, borderRadius: h / 2, paddingHorizontal: small ? 14 : 20, backgroundColor: bg,
        borderWidth: kind === 'outline' ? 1 : 0, borderColor: C.line,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
        opacity: disabled ? 0.4 : pressed ? 0.75 : 1,
      }, style]}
    >
      {loading ? <ActivityIndicator color={fg} /> : icon ? <Feather name={icon} size={small ? 16 : 18} color={fg} /> : null}
      <Text style={{ fontFamily: F.b, fontSize: small ? 13 : 16, color: fg }}>{label}</Text>
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
        height: soft ? 28 : 36, paddingHorizontal: soft ? 10 : 14, borderRadius: 18, justifyContent: 'center',
        backgroundColor: selected ? C.dark : soft ? C.surface : C.ground,
        borderWidth: selected || soft ? 0 : 1, borderColor: C.line,
      }}
    >
      <Text style={{ fontFamily: F.b, fontSize: soft ? 12 : 13, color: selected ? '#FFFFFF' : C.ink }}>{label}</Text>
    </Pressable>
  );
}

export function AdBadge() {
  return (
    <View style={{ height: 20, paddingHorizontal: 7, borderRadius: 10, backgroundColor: C.adBg, justifyContent: 'center' }}>
      <Text style={{ fontFamily: F.xb, fontSize: 11, color: C.adInk }}>Реклама</Text>
    </View>
  );
}

export function Card({ children, style, tone = 'line' }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; tone?: 'line' | 'surface' | 'accent' | 'dark' | 'ad' }) {
  const bg = { line: C.ground, surface: C.surface, accent: C.accentSoft, dark: C.dark, ad: C.adBg }[tone];
  return (
    <View style={[{ backgroundColor: bg, borderRadius: 22, padding: 16, gap: 10, borderWidth: tone === 'line' ? 1 : 0, borderColor: C.line }, style]}>
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
        borderWidth: dark ? 0 : 1, borderColor: C.line, backgroundColor: dark ? C.accent : C.ground, opacity: pressed ? 0.7 : 1,
      })}
    >
      <Feather name={icon} size={20} color={dark ? '#FFFFFF' : C.ink} />
      {!!badge && (
        <View style={{ position: 'absolute', top: -2, right: -2, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 }}>
          <Text style={{ fontFamily: F.xb, fontSize: 10, color: '#FFFFFF' }}>{badge}</Text>
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
        <Text style={{ fontFamily: F.b, fontSize: 15, color: C.ink }}>{label}</Text>
      </Pressable>
      {title ? <Text style={{ fontFamily: F.xb, fontSize: 15, color: C.ink }}>{title}</Text> : null}
      <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: 8 }}>{right}</View>
    </View>
  );
}

export function Screen({
  children, scroll = true, header, footer, bg = C.ground, pad = 20, gap = 18, edges = ['top'],
}: {
  children: React.ReactNode; scroll?: boolean; header?: React.ReactNode; footer?: React.ReactNode; bg?: string; pad?: number; gap?: number;
  edges?: ('top' | 'bottom')[];
}) {
  return (
    <SafeAreaView edges={edges} style={{ flex: 1, backgroundColor: bg }}>
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
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

export function Divider() {
  return <View style={{ height: 1, backgroundColor: C.line }} />;
}
