// Visual themes. All four share one concept — quiet "old money" luxury:
// warm paper grounds, a single deep accent, serif display type over a calm
// sans or book serif, square-ish corners. They differ in palette and type pairing.
import { CormorantGaramond_600SemiBold } from '@expo-google-fonts/cormorant-garamond/600SemiBold';
import { CormorantGaramond_700Bold } from '@expo-google-fonts/cormorant-garamond/700Bold';
import { Jost_400Regular } from '@expo-google-fonts/jost/400Regular';
import { Jost_500Medium } from '@expo-google-fonts/jost/500Medium';
import { Jost_600SemiBold } from '@expo-google-fonts/jost/600SemiBold';
import { Lora_400Regular } from '@expo-google-fonts/lora/400Regular';
import { Lora_500Medium } from '@expo-google-fonts/lora/500Medium';
import { Lora_600SemiBold } from '@expo-google-fonts/lora/600SemiBold';
import { Lora_700Bold } from '@expo-google-fonts/lora/700Bold';
import { PlayfairDisplay_500Medium } from '@expo-google-fonts/playfair-display/500Medium';
import { PlayfairDisplay_600SemiBold } from '@expo-google-fonts/playfair-display/600SemiBold';
import { Prata_400Regular } from '@expo-google-fonts/prata/400Regular';

export interface Palette {
  ink: string;
  muted: string;
  ground: string;
  surface: string;
  card: string;
  line: string;
  accent: string;
  accentSoft: string;
  accentInk: string;
  onAccent: string;
  /** Inverse blocks (Premium card, paid order banner, user chat bubble, selected chips). */
  dark: string;
  onDark: string;
  onDarkMuted: string;
  onDarkAccent: string;
  adBg: string;
  adInk: string;
  ok: string;
  okSoft: string;
  danger: string;
  badgeBg: string;
  badgeInk: string;
  frame: string;
}

export interface Fonts {
  d: string;
  dm: string;
  r: string;
  m: string;
  sb: string;
  b: string;
  xb: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  pairing: string;
  dark: boolean;
  colors: Palette;
  fonts: Fonts;
  /** Display sizes differ by typeface: Cormorant runs small, Playfair and Prata large. */
  displaySize: number;
  bigSize: number;
  assets: Record<string, number>;
}

const JOST = {
  fonts: { r: 'Jost_400Regular', m: 'Jost_400Regular', sb: 'Jost_500Medium', b: 'Jost_500Medium', xb: 'Jost_600SemiBold' },
  assets: { Jost_400Regular, Jost_500Medium, Jost_600SemiBold },
};
const LORA = {
  fonts: { r: 'Lora_400Regular', m: 'Lora_400Regular', sb: 'Lora_500Medium', b: 'Lora_600SemiBold', xb: 'Lora_700Bold' },
  assets: { Lora_400Regular, Lora_500Medium, Lora_600SemiBold, Lora_700Bold },
};

export const THEMES: Theme[] = [
  {
    id: 'cashmere',
    name: 'Кашемир',
    description: 'Слоновая кость и бутылочно-зелёный. Спокойная классика по умолчанию.',
    pairing: 'Cormorant Garamond + Jost',
    dark: false,
    colors: {
      ink: '#1E1B16', muted: '#686153', ground: '#F7F3EA', surface: '#EEE7D9', card: '#FFFDF8', line: '#DED4C1',
      accent: '#2F4A3A', accentSoft: '#E3E8DE', accentInk: '#22382B', onAccent: '#F7F3EA',
      dark: '#1F2B23', onDark: '#F3EEE3', onDarkMuted: '#BDB8AA', onDarkAccent: '#CDB57F',
      adBg: '#F2E5CC', adInk: '#714A10', ok: '#2F6B45', okSoft: '#DCE9DA', danger: '#9B2C2C',
      badgeBg: '#CDB57F', badgeInk: '#1E1B16', frame: '#E6DFD0',
    },
    fonts: { d: 'CormorantGaramond_600SemiBold', dm: 'CormorantGaramond_600SemiBold', ...JOST.fonts },
    displaySize: 32, bigSize: 52,
    assets: { CormorantGaramond_600SemiBold, ...JOST.assets },
  },
  {
    id: 'riviera',
    name: 'Ривьера',
    description: 'Льняной белый и тёмно-синий, как яхт-клуб летом.',
    pairing: 'Playfair Display + Jost',
    dark: false,
    colors: {
      ink: '#141B26', muted: '#5C6270', ground: '#F8F7F3', surface: '#ECEBE5', card: '#FFFFFF', line: '#DCDAD1',
      accent: '#1D3557', accentSoft: '#E2E7EF', accentInk: '#152842', onAccent: '#FFFFFF',
      dark: '#14213D', onDark: '#F4F1EA', onDarkMuted: '#B3B7C2', onDarkAccent: '#D4B87A',
      adBg: '#F1E7D3', adInk: '#704C0F', ok: '#2E6A4A', okSoft: '#DCEAE1', danger: '#9B2C2C',
      badgeBg: '#D4B87A', badgeInk: '#141B26', frame: '#E4E3DC',
    },
    fonts: { d: 'PlayfairDisplay_600SemiBold', dm: 'PlayfairDisplay_500Medium', ...JOST.fonts },
    displaySize: 27, bigSize: 44,
    assets: { PlayfairDisplay_600SemiBold, PlayfairDisplay_500Medium, ...JOST.assets },
  },
  {
    id: 'bordeaux',
    name: 'Бордо',
    description: 'Пергамент и цвет красного вина. Тёплый и немного литературный.',
    pairing: 'Prata + Lora',
    dark: false,
    colors: {
      ink: '#23181A', muted: '#6C5C5B', ground: '#F6F0EA', surface: '#EDE3D9', card: '#FFFBF7', line: '#DFD0C2',
      accent: '#6B1E2E', accentSoft: '#F0E1E0', accentInk: '#551623', onAccent: '#FFF8F2',
      dark: '#2A1519', onDark: '#F6EDE5', onDarkMuted: '#C4B4AE', onDarkAccent: '#D2B07A',
      adBg: '#F2E4CF', adInk: '#704A12', ok: '#3A6A47', okSoft: '#DFEADC', danger: '#9B2C2C',
      badgeBg: '#D2B07A', badgeInk: '#23181A', frame: '#E7DDD3',
    },
    fonts: { d: 'Prata_400Regular', dm: 'Prata_400Regular', ...LORA.fonts },
    displaySize: 26, bigSize: 42,
    assets: { Prata_400Regular, ...LORA.assets },
  },
  {
    id: 'tweed',
    name: 'Твид',
    description: 'Овсяный, кэмел и табак — загородный дом и шерстяной пиджак.',
    pairing: 'Cormorant Garamond + Lora',
    dark: false,
    colors: {
      ink: '#24201A', muted: '#655D50', ground: '#F2EEE6', surface: '#E7E0D3', card: '#FBF9F4', line: '#D8CEBD',
      accent: '#74502F', accentSoft: '#EEE4D7', accentInk: '#5B3D22', onAccent: '#FFF9F0',
      dark: '#2B261F', onDark: '#F2EDE3', onDarkMuted: '#BEB6A7', onDarkAccent: '#CBAA6F',
      adBg: '#F0E2C8', adInk: '#6C4810', ok: '#3C6A44', okSoft: '#DEE8D8', danger: '#9B2C2C',
      badgeBg: '#CBAA6F', badgeInk: '#24201A', frame: '#E2DCD0',
    },
    fonts: { d: 'CormorantGaramond_700Bold', dm: 'CormorantGaramond_700Bold', ...LORA.fonts },
    displaySize: 32, bigSize: 52,
    assets: { CormorantGaramond_700Bold, ...LORA.assets },
  },
];

export const DEFAULT_THEME = 'cashmere';

/** Current palette, fonts and theme. Mutated by applyTheme(); the app remounts after a switch. */
export const C: Palette = { ...THEMES[0].colors };
export const F: Fonts = { ...THEMES[0].fonts };
export const T = { id: THEMES[0].id, dark: false, displaySize: THEMES[0].displaySize, bigSize: THEMES[0].bigSize };

export function themeById(id: string | null | undefined): Theme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}

export function applyTheme(id: string) {
  const t = themeById(id);
  Object.assign(C, t.colors);
  Object.assign(F, t.fonts);
  Object.assign(T, { id: t.id, dark: t.dark, displaySize: t.displaySize, bigSize: t.bigSize });
}

/** Ink for garment silhouettes: depends on the garment colour, not on the theme. */
export const GARMENT_INK_DARK = '#1E1B16';

/** 12480 -> "12 480 ₽" */
export function rub(n: number): string {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽';
}

/** Is a hex colour dark enough to need light ink on top of it? */
export function isDark(hex: string): boolean {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b < 150;
}

const MONTHS = ['янв.', 'февр.', 'марта', 'апр.', 'мая', 'июня', 'июля', 'авг.', 'сент.', 'окт.', 'нояб.', 'дек.'];
const MONTHS_FULL = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const WEEKDAYS = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

export function shortDate(d: Date): string {
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function longDate(d: Date): string {
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS_FULL[d.getMonth()]}`;
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

/** Russian plural: plural(5, ['вещь', 'вещи', 'вещей']) -> "вещей" */
export function plural(n: number, forms: [string, string, string]): string {
  const a = Math.abs(n) % 100;
  const b = a % 10;
  if (a > 10 && a < 20) return forms[2];
  if (b > 1 && b < 5) return forms[1];
  if (b === 1) return forms[0];
  return forms[2];
}
