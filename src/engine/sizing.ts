// Size recommendation: matches the buyer's body measurements against the
// seller's size chart, so the stylist can suggest an item together with a size.
import type { Kind } from '../data/types';

export type Fit = 'slim' | 'regular' | 'loose';

export interface BodyParams {
  height: number | null; // cm
  weight: number | null; // kg
  chest: number | null; // cm, girth
  waist: number | null;
  hips: number | null;
  foot: number | null; // cm, foot length
  fit: Fit;
}

export type Range = [number, number];

/** One row of a seller's size chart: body measurements the size is made for. */
export interface SizeSpec {
  chest?: Range;
  waist?: Range;
  hips?: Range;
  foot?: Range;
  height?: Range;
}

export type SizeChart = Record<string, SizeSpec>;

export const FIT_LABEL: Record<Fit, string> = { slim: 'Облегающая', regular: 'Обычная', loose: 'Свободная' };
const FIT_ACC: Record<Fit, string> = { slim: 'облегающую', regular: 'обычную', loose: 'свободную' };

export const EMPTY_BODY: BodyParams = { height: null, weight: null, chest: null, waist: null, hips: null, foot: null, fit: 'regular' };

type Dim = 'chest' | 'waist' | 'hips' | 'foot';

const DIM_LABEL: Record<Dim, string> = { chest: 'груди', waist: 'талии', hips: 'бёдер', foot: 'длине стопы' };

/** Which measurements decide the size for each kind of garment. */
export const DIMS_BY_KIND: Record<Kind, Dim[]> = {
  top: ['chest'],
  outer: ['chest'],
  bottom: ['waist', 'hips'],
  dress: ['chest', 'waist', 'hips'],
  shoes: ['foot'],
  acc: [],
};

// Standard chart used for demo products (body measurements, cm).
const LETTER: SizeChart = {
  XS: { chest: [82, 86], waist: [66, 70], hips: [88, 92] },
  S: { chest: [86, 92], waist: [70, 76], hips: [92, 96] },
  M: { chest: [92, 100], waist: [76, 84], hips: [96, 102] },
  L: { chest: [100, 108], waist: [84, 92], hips: [102, 108] },
  XL: { chest: [108, 116], waist: [92, 100], hips: [108, 114] },
};

/** Russian shoe size → foot length range (cm). */
function shoeSpec(size: number): SizeSpec {
  const len = Math.round((size / 1.5 - 1.5) * 10) / 10;
  return { foot: [Math.round((len - 0.3) * 10) / 10, Math.round((len + 0.3) * 10) / 10] };
}

export function defaultChart(kind: Kind, sizes: string[]): SizeChart {
  const chart: SizeChart = {};
  for (const s of sizes) {
    if (kind === 'shoes' && /^\d+$/.test(s)) chart[s] = shoeSpec(Number(s));
    else if (LETTER[s]) chart[s] = LETTER[s];
  }
  return chart;
}

export function bodyFilled(b: BodyParams): boolean {
  return b.chest != null && b.waist != null && b.hips != null && b.foot != null;
}

export interface SizeAdvice {
  /** Recommended size, or null when nothing in stock fits. */
  size: string | null;
  exact: boolean;
  note: string;
  /** False only when the body is known and no size fits. */
  ok: boolean;
}

const distance = (v: number, [lo, hi]: Range) => (v < lo ? lo - v : v > hi ? v - hi : 0);

/**
 * Picks the size whose chart row is closest to the body. Ties (the body sits
 * between two sizes) are broken by the preferred fit: loose → larger, slim → smaller.
 */
export function recommendSize(
  item: { kind: Kind; sizes: string[]; sizeChart?: SizeChart },
  body: BodyParams,
): SizeAdvice {
  if (item.kind === 'acc' || item.sizes.length === 1 && !item.sizeChart?.[item.sizes[0]]) {
    return { size: item.sizes[0] ?? null, exact: true, note: 'Один размер', ok: true };
  }
  const dims = DIMS_BY_KIND[item.kind].filter((d) => body[d] != null);
  if (!dims.length) return { size: null, exact: false, note: 'Укажи свои параметры — подберём размер', ok: true };
  const chart = item.sizeChart ?? {};
  const scored = item.sizes
    .map((s, i) => {
      const spec = chart[s];
      if (!spec) return null;
      let d = 0;
      for (const dim of dims) if (spec[dim]) d += distance(body[dim]!, spec[dim]!);
      return { s, i, d };
    })
    .filter((x): x is { s: string; i: number; d: number } => !!x);
  if (!scored.length) return { size: null, exact: false, note: 'Продавец не указал размерную сетку', ok: true };

  const best = Math.min(...scored.map((x) => x.d));
  const tied = scored.filter((x) => x.d - best < 0.01);
  const pick = body.fit === 'loose' ? tied[tied.length - 1] : body.fit === 'slim' ? tied[0] : tied[Math.floor((tied.length - 1) / 2)];

  // More than ~4 cm off on the deciding measurements: this item has no size for the buyer.
  if (best > 4) return { size: null, exact: false, note: 'Твоего размера нет в наличии', ok: false };

  const main = dims[0];
  const mainText = `по обхвату ${DIM_LABEL[main]} ${String(body[main]).replace('.', ',')} см`.replace('по обхвату длине стопы', 'по длине стопы');
  let note = best === 0 ? mainText : `ближайший — ${mainText}`;
  if (tied.length > 1) note = `между ${tied[0].s} и ${tied[tied.length - 1].s} — взяли ${pick.s} под ${FIT_ACC[body.fit]} посадку`;
  const h = chart[pick.s]?.height;
  if (h && body.height != null && (body.height < h[0] || body.height > h[1])) note += ` · рост вне сетки (${h[0]}–${h[1]} см), проверь длину`;
  return { size: pick.s, exact: best === 0, note, ok: true };
}

/** Typical letter and shoe size for the profile summary. */
export function summarySizes(body: BodyParams): string {
  const parts: string[] = [];
  const top = recommendSize({ kind: 'top', sizes: Object.keys(LETTER), sizeChart: LETTER }, body);
  if (top.size) parts.push(`одежда ${top.size}`);
  if (body.foot != null) {
    const sizes = Array.from({ length: 12 }, (_, i) => String(35 + i));
    const shoe = recommendSize({ kind: 'shoes', sizes, sizeChart: defaultChart('shoes', sizes) }, body);
    if (shoe.size) parts.push(`обувь ${shoe.size}`);
  }
  return parts.join(' · ');
}

export function chartRows(kind: Kind, chart: SizeChart): { size: string; cells: string[] }[] {
  const fmt = (r?: Range) => (r ? `${r[0]}–${r[1]}` : '—');
  return Object.entries(chart).map(([size, s]) => ({
    size,
    cells: kind === 'shoes' ? [fmt(s.foot)] : [fmt(s.chest), fmt(s.waist), fmt(s.hips)],
  }));
}
