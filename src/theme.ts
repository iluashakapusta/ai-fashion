// The app's single visual style: restrained "old money" — linen white, navy and
// a touch of gold; Playfair Display headings over Jost; tailored, square-ish corners.
import { Jost_400Regular } from '@expo-google-fonts/jost/400Regular';
import { Jost_500Medium } from '@expo-google-fonts/jost/500Medium';
import { Jost_600SemiBold } from '@expo-google-fonts/jost/600SemiBold';
import { PlayfairDisplay_500Medium } from '@expo-google-fonts/playfair-display/500Medium';
import { PlayfairDisplay_600SemiBold } from '@expo-google-fonts/playfair-display/600SemiBold';

export const C = {
  ink: '#141B26',
  muted: '#5C6270',
  ground: '#F8F7F3',
  surface: '#ECEBE5',
  card: '#FFFFFF',
  line: '#DCDAD1',
  accent: '#1D3557',
  accentSoft: '#E2E7EF',
  accentInk: '#152842',
  onAccent: '#FFFFFF',
  /** Inverse blocks (Premium card, paid order banner, user chat bubble, selected chips). */
  dark: '#14213D',
  onDark: '#F4F1EA',
  onDarkMuted: '#B3B7C2',
  onDarkAccent: '#D4B87A',
  adBg: '#F1E7D3',
  adInk: '#704C0F',
  ok: '#2E6A4A',
  okSoft: '#DCEAE1',
  danger: '#9B2C2C',
  badgeBg: '#D4B87A',
  badgeInk: '#141B26',
  frame: '#E4E3DC',
};

export const F = {
  d: 'PlayfairDisplay_600SemiBold',
  dm: 'PlayfairDisplay_500Medium',
  r: 'Jost_400Regular',
  m: 'Jost_400Regular',
  sb: 'Jost_500Medium',
  b: 'Jost_500Medium',
  xb: 'Jost_600SemiBold',
};

/** Display sizes tuned for Playfair Display. */
export const T = { displaySize: 27, bigSize: 44 };

export const FONT_ASSETS = { PlayfairDisplay_600SemiBold, PlayfairDisplay_500Medium, Jost_400Regular, Jost_500Medium, Jost_600SemiBold };

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
