export const C = {
  ink: '#121212',
  muted: '#5E5E5A',
  ground: '#FFFFFF',
  surface: '#F4F3F0',
  line: '#E4E2DD',
  accent: '#2B3BE0',
  accentSoft: '#E8EAFD',
  accentInk: '#1A27B0',
  adBg: '#FFF1DD',
  adInk: '#8A4B00',
  ok: '#1E7A46',
  okSoft: '#DDF3E5',
  danger: '#B42318',
  dark: '#121212',
  darkMuted: '#B5B5B0',
  frame: '#E9E7E2',
};

export const F = {
  r: 'Manrope_400Regular',
  m: 'Manrope_500Medium',
  sb: 'Manrope_600SemiBold',
  b: 'Manrope_700Bold',
  xb: 'Manrope_800ExtraBold',
  d: 'Unbounded_600SemiBold',
  dm: 'Unbounded_500Medium',
};

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
