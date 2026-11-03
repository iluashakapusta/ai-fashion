// Rule-based stand-in for the AI stylist. It parses a request written in plain
// Russian, builds outfits from the wardrobe first and fills the gaps from the
// marketplace within the budget. The interface (parseRequest / planLooks /
// alternatives) is what a real LLM-backed service would implement later.
import type { Garment, Kind, Look, LookItem, Occasion, Product, WardrobeItem, Warmth } from '../data/types';
import { OCCASION_LABEL } from '../data/types';
import { plural, rub } from '../theme';

// ---------- compatibility ----------

export function harmonize(a: Garment, b: Garment): boolean {
  if (a.kind === b.kind) return false;
  if ((a.kind === 'dress' && (b.kind === 'top' || b.kind === 'bottom')) ||
      (b.kind === 'dress' && (a.kind === 'top' || a.kind === 'bottom'))) return false;
  if (a.tone === 'bright' && b.tone === 'bright') return false;
  if (!a.styles.some((s) => b.styles.includes(s))) return false;
  if (!a.warmth.some((x) => b.warmth.includes(x))) return false;
  return true;
}

/** How many wardrobe items a product pairs with. */
export function compatCount(item: Garment, wardrobe: Garment[]): number {
  return wardrobe.filter((w) => w.id !== item.id && harmonize(item, w)).length;
}

/** Number of complete outfits (top+bottom+shoes or dress+shoes) the set allows. */
export function countOutfits(items: Garment[]): number {
  const by = (k: Kind) => items.filter((i) => i.kind === k);
  const tops = by('top'), bottoms = by('bottom'), shoes = by('shoes'), dresses = by('dress');
  const outers = by('outer');
  // Each base outfit counts once, plus once more for every outer layer that goes with it.
  const withLayers = (parts: Garment[]) => 1 + outers.filter((o) => parts.every((p) => harmonize(o, p))).length;
  let n = 0;
  for (const s of shoes) {
    for (const d of dresses) if (harmonize(d, s)) n += withLayers([d, s]);
    for (const t of tops) {
      if (!harmonize(t, s)) continue;
      for (const b of bottoms) if (harmonize(t, b) && harmonize(b, s)) n += withLayers([t, b, s]);
    }
  }
  return n;
}

export function newOutfitsWith(item: Garment, wardrobe: Garment[]): number {
  return countOutfits([...wardrobe, item]) - countOutfits(wardrobe);
}

// ---------- request parsing ----------

export interface Brief {
  occasions: Occasion[];
  titles: string[];
  warmth: Warmth;
  budget: number | null;
  days: number | null;
  allowBuy: boolean;
  /** Prefer new purchases over what is already in the wardrobe («обновить гардероб»). */
  preferBuy?: boolean;
  /** Name of a wardrobe item quoted in «…» that every look must include. */
  anchorName?: string;
  topic: string;
}

const has = (t: string, re: RegExp) => re.test(t);

function parseBudget(t: string): number | null {
  const m = t.match(/(\d[\d\s]*[\d])\s*(тыс\S*|к\b|k\b)?\s*(₽|р\b|руб|тыс|к\b|k\b)/i) || t.match(/бюджет\D{0,10}(\d[\d\s]*)/i);
  if (!m) return null;
  let n = parseInt(m[1].replace(/\s/g, ''), 10);
  if (/тыс|к|k/i.test(m[2] || '') || /^(тыс|к|k)/i.test(m[3] || '')) n *= 1000;
  return n > 0 ? n : null;
}

export function parseRequest(text: string, currentWarmth: Warmth): Brief {
  const t = text.toLowerCase().replace(/ё/g, 'е');
  const countM = t.match(/(\d+)\s*(образ|комплект|лук)/);
  const daysM = t.match(/(\d+)\s*(дн|день|дня|сут)/);
  const budget = parseBudget(t);
  const days = daysM ? parseInt(daysM[1], 10) : null;
  let warmth: Warmth = currentWarmth;
  if (has(t, /жар|тепл|юг|мор|пляж|лет|отпуск|курорт/)) warmth = 'hot';
  if (has(t, /зим|холод|мороз|снег/)) warmth = 'cold';

  const wanted = countM ? Math.min(parseInt(countM[1], 10), 7) : 0;
  const allowBuy = !has(t, /только из (моего|своего) гардероба|без покупок|ничего не покупать/);
  const anchorM = text.match(/[«"]([^»"]+)[»"]/);
  const anchorName = anchorM ? anchorM[1].trim() : undefined;

  // Wardrobe refresh with a budget
  if (has(t, /обнов|освеж|докуп/)) {
    const occ: Occasion[] = warmth === 'hot' ? ['casual', 'evening', 'beach', 'casual'] : ['casual', 'office', 'date', 'casual'];
    const n = wanted || occ.length;
    const label: Record<Occasion, string> = {
      casual: 'Город', evening: 'Вечер', beach: 'Пляж', office: 'Работа', date: 'Свидание', party: 'Вечеринка', sport: 'Спорт', interview: 'Встреча',
    };
    const seen: Record<string, number> = {};
    const list = Array.from({ length: n }, (_, i) => occ[i % occ.length]);
    const titles = list.map((o) => {
      seen[o] = (seen[o] || 0) + 1;
      return `Обновление · ${label[o]}${seen[o] > 1 ? ` ${seen[o]}` : ''}`;
    });
    return { occasions: list, titles, warmth, budget, days, allowBuy: true, preferBuy: true, topic: 'обновление гардероба' };
  }

  // Trips
  if (has(t, /отпуск|поездк|путешеств|курорт|на мор|в тепл/)) {
    const found: Occasion[] = [];
    if (has(t, /прогул|город|экскурс/)) found.push('casual');
    if (has(t, /пляж|мор|бассейн/)) found.push('beach');
    if (has(t, /ресторан|ужин/)) found.push('evening');
    if (has(t, /вечер|выход|клуб|вечеринк/)) found.push('party');
    const base: Occasion[] = found.length ? found : ['casual', 'beach', 'evening', 'party'];
    const n = wanted || Math.max(base.length, 4);
    const occ = Array.from({ length: n }, (_, i) => base[i % base.length]);
    const tripTitle: Record<Occasion, string> = {
      casual: 'Прогулка по городу', beach: 'Пляж', evening: 'Вечерний ресторан', party: 'Вечерний выход',
      office: 'Деловая встреча', date: 'Ужин вдвоём', sport: 'Активный день', interview: 'Встреча',
    };
    const seen: Record<string, number> = {};
    const titles = occ.map((o) => {
      seen[o] = (seen[o] || 0) + 1;
      return seen[o] > 1 ? `${tripTitle[o]} · вариант ${seen[o]}` : tripTitle[o];
    });
    return { occasions: occ, titles, warmth, budget, days, allowBuy, topic: 'отпуск' };
  }

  // Week plan
  if (has(t, /недел/)) {
    const days5 = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница'];
    const occ: Occasion[] = ['office', 'office', 'office', 'office', 'party'];
    return { occasions: occ, titles: days5.map((d, i) => `${d} · ${OCCASION_LABEL[occ[i]]}`), warmth, budget, days: 5, allowBuy, topic: 'неделя' };
  }

  const single = (o: Occasion, topic: string, label: string): Brief => {
    const n = wanted || 3;
    return {
      occasions: Array(n).fill(o), titles: Array.from({ length: n }, (_, i) => `${label} · вариант ${i + 1}`),
      warmth, budget, days, allowBuy, anchorName, topic,
    };
  };

  if (has(t, /свидан/)) return single('date', 'свидание', 'Свидание');
  if (has(t, /собеседован/)) return single('interview', 'собеседование', 'Собеседование');
  if (has(t, /вечеринк|клуб|день рожден|праздн/)) return single('party', 'вечеринка', 'Вечеринка');
  if (has(t, /ресторан|ужин|театр/)) return single('evening', 'вечер', 'Вечер');
  if (has(t, /работ|офис|делов|встреч/)) return single('office', 'работа', 'Офис');
  if (has(t, /спорт|зал|трениров|бег/)) return single('sport', 'спорт', 'Спорт');
  if (has(t, /пляж/)) return single('beach', 'пляж', 'Пляж');
  return single('casual', 'повседневный образ', 'На каждый день');
}

// ---------- outfit building ----------

export interface Catalog {
  wardrobe: WardrobeItem[];
  products: Product[];
}

type Cand = { g: Garment; source: 'wardrobe' | 'product' };

function slotsFor(occasion: Occasion, warmth: Warmth, useDress: boolean): Kind[] {
  const s: Kind[] = useDress ? ['dress', 'shoes'] : ['top', 'bottom', 'shoes'];
  if (warmth === 'cool' || warmth === 'cold') s.push('outer');
  if (occasion === 'evening' && warmth === 'hot') s.push('outer');
  s.push('acc');
  return s;
}

const OPTIONAL: Kind[] = ['acc'];

function fits(g: Garment, slot: Kind, occasion: Occasion, warmth: Warmth, chosen: Garment[]) {
  return g.kind === slot && g.styles.includes(occasion) && g.warmth.includes(warmth) && chosen.every((c) => harmonize(c, g));
}

interface PlanCtx {
  used: Map<string, number>;
  planned: Set<string>;
  budgetLeft: number;
  allowBuy: boolean;
  preferBuy: boolean;
  variant: number;
}

const BUY_ROTATION: Kind[] = ['top', 'shoes', 'bottom', 'dress', 'top', 'acc'];

function shopFor(cat: Catalog, slot: Kind, occasion: Occasion, warmth: Warmth, chosen: Garment[], ctx: PlanCtx): Cand | null {
  // Independent recommendation: paid placements are never used by the stylist.
  const shop = cat.products
    .filter((p) => !p.sponsored && p.stock > 0 && !ctx.planned.has(p.id) && fits(p, slot, occasion, warmth, chosen) && p.price <= ctx.budgetLeft)
    .sort((a, b) => a.price / a.rating - b.price / b.rating);
  return shop.length ? { g: shop[0], source: 'product' } : null;
}

function pick(cat: Catalog, slot: Kind, occasion: Occasion, warmth: Warmth, chosen: Garment[], ctx: PlanCtx): Cand | null {
  if (ctx.preferBuy && ctx.allowBuy && slot === BUY_ROTATION[ctx.variant % BUY_ROTATION.length]) {
    const fresh = shopFor(cat, slot, occasion, warmth, chosen, ctx);
    if (fresh) return fresh;
  }
  const own = cat.wardrobe.filter((w) => fits(w, slot, occasion, warmth, chosen));
  if (own.length) {
    own.sort((a, b) => {
      const ua = ctx.used.get(a.id) || 0, ub = ctx.used.get(b.id) || 0;
      if (ua !== ub) return ua - ub;
      return ((a.id.charCodeAt(a.id.length - 1) + ctx.variant) % 7) - ((b.id.charCodeAt(b.id.length - 1) + ctx.variant) % 7);
    });
    return { g: own[0], source: 'wardrobe' };
  }
  // Already planned purchases are reused before buying anything new.
  const planned = cat.products.filter((p) => ctx.planned.has(p.id) && fits(p, slot, occasion, warmth, chosen));
  if (planned.length) return { g: planned[0], source: 'product' };
  if (!ctx.allowBuy) return null;
  if (OPTIONAL.includes(slot) && occasion !== 'beach' && occasion !== 'evening' && occasion !== 'party') return null;
  if (slot === 'outer' && warmth === 'hot') return null;
  return shopFor(cat, slot, occasion, warmth, chosen, ctx);
}

function buildLook(cat: Catalog, id: string, title: string, occasion: Occasion, warmth: Warmth, ctx: PlanCtx, anchor?: WardrobeItem): Look {
  const dressOk = anchor ? anchor.kind === 'dress' : ['date', 'evening', 'party', 'beach', 'casual'].includes(occasion) && ctx.variant % 2 === 1;
  const tryBuild = (useDress: boolean) => {
    const chosen: Garment[] = anchor ? [anchor] : [];
    const items: LookItem[] = [];
    let spend = 0;
    for (const slot of slotsFor(occasion, warmth, useDress)) {
      if (anchor && slot === anchor.kind) {
        items.push({ source: 'wardrobe', id: anchor.id, slot });
        continue;
      }
      const c = pick(cat, slot, occasion, warmth, chosen, { ...ctx, budgetLeft: ctx.budgetLeft - spend });
      if (!c) {
        if (slot === 'dress') return null;
        continue;
      }
      chosen.push(c.g);
      items.push({ source: c.source, id: c.g.id, slot });
      if (c.source === 'product' && !ctx.planned.has(c.g.id)) spend += (c.g as Product).price;
    }
    return items;
  };
  const items = (dressOk && tryBuild(true)) || tryBuild(false) || [];
  if (anchor && !items.some((i) => i.id === anchor.id)) items.push({ source: 'wardrobe', id: anchor.id, slot: anchor.kind });
  for (const it of items) {
    ctx.used.set(it.id, (ctx.used.get(it.id) || 0) + 1);
    if (it.source === 'product' && !ctx.planned.has(it.id)) {
      ctx.planned.add(it.id);
      ctx.budgetLeft -= cat.products.find((p) => p.id === it.id)!.price;
    }
  }
  return { id, title, occasion, warmth, items };
}

export interface Plan {
  looks: Look[];
  reply: string;
  chips: string[];
  ownCount: number;
  buyIds: string[];
  buyTotal: number;
}

const WARMTH_CHIP: Record<Warmth, string> = { hot: '+29°, солнце', warm: '+18°, тепло', cool: '+4°, дождь', cold: '−8°, снег' };

export function planLooks(cat: Catalog, brief: Brief, idPrefix: string, variantSeed = 0): Plan {
  const ctx: PlanCtx = {
    used: new Map(), planned: new Set(), budgetLeft: brief.budget ?? Infinity, allowBuy: brief.allowBuy,
    preferBuy: !!brief.preferBuy, variant: variantSeed,
  };
  const norm = (x: string) => x.toLowerCase().replace(/ё/g, 'е');
  const anchor = brief.anchorName
    ? cat.wardrobe.find((w) => norm(w.name) === norm(brief.anchorName!)) ||
      cat.wardrobe.find((w) => norm(w.name).includes(norm(brief.anchorName!)) || norm(brief.anchorName!).includes(norm(w.name)))
    : undefined;
  let warmth = brief.warmth;
  let occasions = brief.occasions;
  if (anchor) {
    if (!anchor.warmth.includes(warmth)) warmth = anchor.warmth[0];
    if (!anchor.styles.includes(occasions[0])) occasions = occasions.map(() => anchor.styles[0]);
  }
  const all = occasions.map((o, i) => {
    ctx.variant = variantSeed + i;
    return buildLook(cat, `${idPrefix}-${i}`, anchor ? `С вещью «${anchor.name}» · ${i + 1}` : brief.titles[i], o, warmth, ctx, anchor);
  });
  // Drop exact repeats: a variant that adds nothing new is noise.
  const seenSets = new Set<string>();
  const looks = all.filter((l) => {
    const key = l.items.map((i) => i.id).sort().join(',');
    if (seenSets.has(key)) return false;
    seenSets.add(key);
    return true;
  });
  if (!anchor && looks.length < all.length && brief.occasions.every((o) => o === brief.occasions[0])) {
    looks.forEach((l, i) => (l.title = l.title.replace(/вариант \d+/, `вариант ${i + 1}`)));
  }
  const ownIds = new Set<string>();
  looks.forEach((l) => l.items.forEach((it) => it.source === 'wardrobe' && ownIds.add(it.id)));
  const buyIds = [...ctx.planned];
  const buyTotal = buyIds.reduce((s, id) => s + (cat.products.find((p) => p.id === id)?.price || 0), 0);

  const n = looks.length;
  const chips = [`${n} ${plural(n, ['образ', 'образа', 'образов'])}`];
  if (brief.days) chips.push(`${brief.days} ${plural(brief.days, ['день', 'дня', 'дней'])}`);
  chips.push(WARMTH_CHIP[warmth]);
  const occ = [...new Set(occasions)].map((o) => OCCASION_LABEL[o].toLowerCase());
  chips.push(occ.join(' · '));
  if (brief.budget) chips.push(`до ${rub(brief.budget)}`);

  let reply = anchor ? `Собрал ${n} ${plural(n, ['образ', 'образа', 'образов'])} вокруг вещи «${anchor.name}». ` : '';
  if (looks.length < all.length && !anchor) reply += `Удачных разных сочетаний нашлось ${n} — повторы я убрал. `;
  reply += `Взял из твоего гардероба ${ownIds.size} ${plural(ownIds.size, ['вещь', 'вещи', 'вещей'])}.`;
  if (buyIds.length) {
    reply += ` Докупить нужно ${buyIds.length} ${plural(buyIds.length, ['вещь', 'вещи', 'вещей'])} на ${rub(buyTotal)}`;
    reply += brief.budget ? ` — в бюджете остаётся ${rub(brief.budget - buyTotal)}.` : '.';
    reply += ' Купленные вещи сочетаются между собой и повторяются в нескольких образах.';
  } else {
    reply += ' Покупать ничего не нужно — всё уже есть.';
  }
  return { looks, reply, chips, ownCount: ownIds.size, buyIds, buyTotal };
}

/** Candidates for replacing one item in a look, keeping the rest of the look compatible. */
export function alternatives(cat: Catalog, look: Look, index: number): Cand[] {
  const slot = look.items[index].slot;
  const others = look.items
    .filter((_, i) => i !== index)
    .map((it) => (it.source === 'wardrobe' ? cat.wardrobe.find((w) => w.id === it.id) : cat.products.find((p) => p.id === it.id)))
    .filter(Boolean) as Garment[];
  const own: Cand[] = cat.wardrobe.filter((w) => fits(w, slot, look.occasion, look.warmth, others)).map((g) => ({ g, source: 'wardrobe' }));
  const shop: Cand[] = cat.products
    .filter((p) => p.stock > 0 && fits(p, slot, look.occasion, look.warmth, others))
    .sort((a, b) => a.price - b.price)
    .map((g) => ({ g, source: 'product' }));
  return [...own, ...shop];
}

/** What the wardrobe is missing: slots with no item for a frequent occasion/weather. */
export function gaps(wardrobe: Garment[], warmth: Warmth): string[] {
  const out: string[] = [];
  const any = (k: Kind, o: Occasion, w: Warmth) => wardrobe.some((g) => g.kind === k && g.styles.includes(o) && g.warmth.includes(w));
  if (!any('outer', 'casual', 'cool') || !wardrobe.some((g) => g.kind === 'outer' && g.material === 'мембрана')) out.push('непромокаемой верхней одежды на дождливую осень');
  if (!any('shoes', 'evening', 'hot')) out.push('лёгкой обуви для летних вечеров');
  if (!any('shoes', 'beach', 'hot')) out.push('обуви для пляжа');
  if (!any('outer', 'casual', 'cold') || wardrobe.filter((g) => g.kind === 'outer' && g.warmth.includes('cold')).length < 2) out.push('второго тёплого слоя — кардигана или пальто');
  void warmth;
  return out.slice(0, 3);
}

/**
 * «Предложения дня» for the home screen: in-stock, non-sponsored products, discounted ones first,
 * then the best matches for the wardrobe; the pick rotates with the date.
 */
export function dealsOfTheDay(products: Product[], wardrobe: Garment[], date: Date, count = 6): Product[] {
  const day = Math.floor(date.getTime() / 86400000);
  const pool = products.filter((p) => !p.sponsored && p.stock > 0);
  const score = (p: Product) => {
    const discount = p.oldPrice ? (p.oldPrice - p.price) / p.oldPrice : 0;
    const rotation = ((day * 31 + p.id.split('').reduce((a, ch) => a + ch.charCodeAt(0), 0)) % 17) / 17;
    return discount * 2 + compatCount(p, wardrobe) / 20 + rotation;
  };
  return [...pool].sort((a, b) => score(b) - score(a)).slice(0, count);
}
