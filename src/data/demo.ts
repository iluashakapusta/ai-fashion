// Demo data: a sample wardrobe, marketplace catalogue and sellers.
// Everything here is invented for the demo build.
import { defaultChart, type BodyParams } from '../engine/sizing';
import { addDays } from '../theme';
import type { Garment, Kind, Occasion, Product, Seller, Tone, WardrobeItem, Warmth } from './types';

const ALL: Warmth[] = ['hot', 'warm', 'cool', 'cold'];

function g(
  id: string, name: string, kind: Kind, color: string, colorName: string, tone: Tone,
  styles: Occasion[], warmth: Warmth[], material?: string,
): Garment {
  return { id, name, kind, color, colorName, tone, styles, warmth, material };
}

function w(base: Garment, wears: number, price?: number): WardrobeItem {
  return { ...base, wears, price };
}

export const DEMO_WARDROBE: WardrobeItem[] = [
  w(g('w1', 'Белая футболка', 'top', '#FFFFFF', 'белый', 'neutral', ['casual', 'beach', 'date', 'sport'], ['hot', 'warm', 'cool'], 'хлопок'), 34, 1290),
  w(g('w2', 'Молочный свитер', 'top', '#EDEAE3', 'молочный', 'neutral', ['casual', 'office', 'date'], ['cool', 'cold'], 'шерсть'), 12, 4990),
  w(g('w3', 'Голубая рубашка', 'top', '#C9D6E8', 'голубой', 'cool', ['office', 'interview', 'date', 'evening'], ['warm', 'cool'], 'хлопок'), 18, 3490),
  w(g('w4', 'Чёрная водолазка', 'top', '#1E1E1E', 'чёрный', 'neutral', ['office', 'evening', 'date', 'party'], ['cool', 'cold'], 'вискоза'), 9, 2790),
  w(g('w5', 'Серое худи', 'top', '#9A9C9F', 'серый', 'neutral', ['casual', 'sport'], ['cool', 'cold'], 'хлопок'), 22, 3990),
  w(g('w6', 'Полосатый лонгслив', 'top', '#DCE3EE', 'бело-синий', 'cool', ['casual'], ['warm', 'cool'], 'хлопок'), 5, 1990),
  w(g('w7', 'Шёлковый топ', 'top', '#B5475B', 'бордовый', 'bright', ['party', 'evening', 'date'], ['hot', 'warm'], 'шёлк'), 1, 3290),
  w(g('w8', 'Графитовые брюки', 'bottom', '#3A3D45', 'графит', 'neutral', ['office', 'interview', 'evening', 'date'], ['warm', 'cool', 'cold'], 'шерсть'), 20, 5990),
  w(g('w9', 'Синие джинсы', 'bottom', '#4E6A8C', 'синий', 'cool', ['casual', 'date', 'party'], ['warm', 'cool', 'cold'], 'деним'), 40, 4490),
  w(g('w10', 'Бежевые чиносы', 'bottom', '#C9B48E', 'бежевый', 'warm', ['casual', 'office', 'date'], ['hot', 'warm', 'cool'], 'хлопок'), 8, 3790),
  w(g('w11', 'Джинсовые шорты', 'bottom', '#8FA9C4', 'голубой', 'cool', ['casual', 'beach'], ['hot'], 'деним'), 6, 2490),
  w(g('w12', 'Чёрная юбка миди', 'bottom', '#202020', 'чёрный', 'neutral', ['office', 'evening', 'party', 'date'], ['warm', 'cool'], 'вискоза'), 4, 3590),
  w(g('w13', 'Льняное платье', 'dress', '#E8DCC0', 'песочный', 'warm', ['casual', 'beach', 'date'], ['hot', 'warm'], 'лён'), 3, 5490),
  w(g('w14', 'Бежевый тренч', 'outer', '#D8C8AA', 'бежевый', 'warm', ['office', 'casual', 'date', 'interview'], ['cool'], 'хлопок'), 15, 11990),
  w(g('w15', 'Пуховик', 'outer', '#2B2F36', 'тёмно-серый', 'neutral', ['casual', 'office'], ['cold'], 'нейлон'), 30, 14990),
  w(g('w16', 'Тёмно-синий блейзер', 'outer', '#1F2A44', 'тёмно-синий', 'cool', ['office', 'interview', 'evening'], ['warm', 'cool'], 'шерсть'), 7, 8990),
  w(g('w17', 'Джинсовая куртка', 'outer', '#6D88A8', 'синий', 'cool', ['casual', 'party'], ['warm', 'cool'], 'деним'), 0, 4990),
  w(g('w18', 'Белые кеды', 'shoes', '#F1F0EC', 'белый', 'neutral', ['casual', 'sport', 'date'], ['hot', 'warm', 'cool'], 'текстиль'), 50, 5990),
  w(g('w19', 'Коричневые ботинки', 'shoes', '#5A3B28', 'коричневый', 'warm', ['casual', 'office', 'date'], ['cool', 'cold'], 'кожа'), 25, 9990),
  w(g('w20', 'Чёрные лоферы', 'shoes', '#1A1A1A', 'чёрный', 'neutral', ['office', 'interview', 'evening'], ['warm', 'cool'], 'кожа'), 10, 7490),
  w(g('w21', 'Беговые кроссовки', 'shoes', '#8B93A6', 'серый', 'neutral', ['sport'], ['hot', 'warm', 'cool'], 'сетка'), 14, 8490),
  w(g('w22', 'Солнцезащитные очки', 'acc', '#2A2A2A', 'чёрный', 'neutral', ['beach', 'casual'], ['hot', 'warm'], 'пластик'), 4, 2490),
  w(g('w23', 'Часы', 'acc', '#E8DCC0', 'золотистый', 'warm', ['office', 'evening', 'date', 'interview'], ALL, 'металл'), 60, 12990),
  w(g('w24', 'Кожаная сумка', 'acc', '#6B4430', 'коричневый', 'warm', ['office', 'casual', 'date'], ALL, 'кожа'), 20, 8990),
  w(g('w25', 'Шерстяной шарф', 'acc', '#8C7B6B', 'серо-коричневый', 'warm', ['casual', 'office'], ['cool', 'cold'], 'шерсть'), 0, 2990),
];

export const SELLERS: Seller[] = [
  { id: 's1', name: 'Городской магазин одежды', type: 'shop', rating: 4.8, city: 'Москва' },
  { id: 's2', name: 'Бренд базовой одежды', type: 'brand', rating: 4.7, city: 'Санкт-Петербург' },
  { id: 's3', name: 'Марина · частный продавец', type: 'private', rating: 4.9, city: 'Москва' },
  { id: 's4', name: 'Партнёрский маркетплейс', type: 'partner', rating: 4.6, city: 'Склад в Подмосковье' },
  { id: 's5', name: 'Обувная мастерская', type: 'shop', rating: 4.8, city: 'Казань' },
  { id: 's6', name: 'Кирилл · ресейл', type: 'private', rating: 4.9, city: 'Москва' },
  { id: 's7', name: 'Ресейл-шоурум', type: 'shop', rating: 4.8, city: 'Санкт-Петербург' },
];

export const SHOP_INFO: Record<string, { color: string; about: string }> = {
  s1: { color: '#1D3557', about: 'Одежда на каждый день и для офиса. Доставка по Москве за 1–3 дня, примерка при получении.' },
  s2: { color: '#141B26', about: 'Базовые вещи из натуральных тканей: лён, хлопок, шерсть. Собственное производство.' },
  s3: { color: '#6B5B45', about: 'Продаю вещи из своего гардероба в отличном состоянии. Отправляю в день оплаты.' },
  s4: { color: '#3D5A73', about: 'Товары партнёрской площадки: большой выбор базовых вещей и аксессуаров.' },
  s5: { color: '#5A4632', about: 'Кожаная обувь ручной работы. Мастерская в Казани, доставка по всей России.' },
  s6: { color: '#3D4B5C', about: 'Продаю оригинальные вещи из своей коллекции и под заказ. Проверка подлинности перед отправкой.' },
  s7: { color: '#8A6D3B', about: 'Шоурум брендовых вещей: новые и в отличном состоянии. Каждая вещь проходит проверку подлинности.' },
};

export const SELLER_TYPE_LABEL = {
  shop: 'Магазин',
  brand: 'Бренд',
  private: 'Частный продавец',
  partner: 'Внешняя площадка',
} as const;

const S = ['XS', 'S', 'M', 'L', 'XL'];
const SHOE = ['36', '37', '38', '39', '40', '41', '42', '43'];

function p(
  base: Garment, sellerId: string, price: number, deliveryDays: number, description: string,
  extra: Partial<Product> = {},
): Product {
  const prod: Product = {
    ...base, sellerId, price, deliveryDays, description,
    sizes: base.kind === 'shoes' ? SHOE : base.kind === 'acc' ? ['Один размер'] : S,
    stock: 12, rating: 4.7, reviews: 48, ...extra,
  };
  // Every seller fills in a size chart; demo products get the standard one.
  if (!prod.sizeChart && base.kind !== 'acc') prod.sizeChart = defaultChart(base.kind, prod.sizes);
  return prod;
}

/** Demo buyer's measurements, prefilled so size advice is visible right away. */
export const DEMO_BODY: BodyParams = { height: 178, weight: 74, chest: 98, waist: 82, hips: 98, foot: 26.5, fit: 'regular' };

export const PRODUCTS: Product[] = [
  p(g('p1', 'Льняная рубашка', 'top', '#E9E1D0', 'молочный', 'warm', ['evening', 'date', 'casual', 'beach'], ['hot', 'warm'], 'лён'), 's1', 3990, 3,
    'Свободная рубашка из чистого льна. Дышит в жару, хорошо смотрится навыпуск и с брюками.', { stock: 14, reviews: 126 }),
  p(g('p2', 'Брюки прямые лёгкие', 'bottom', '#2F3440', 'графит', 'neutral', ['evening', 'office', 'date'], ['hot', 'warm'], 'вискоза'), 's2', 5490, 2,
    'Лёгкие брюки прямого кроя на летний вечер и в офис.', { rating: 4.8, reviews: 312 }),
  p(g('p3', 'Замшевые лоферы', 'shoes', '#7A4E30', 'коричневый', 'warm', ['evening', 'date', 'office'], ['hot', 'warm'], 'замша'), 's3', 3000, 4,
    'Надеты два раза, как новые. Без коробки.', { oldPrice: 7500, stock: 1, rating: 4.9, reviews: 23 }),
  p(g('p4', 'Кожаные сандалии', 'shoes', '#A0714A', 'карамельный', 'warm', ['beach', 'casual'], ['hot'], 'кожа'), 's5', 2900, 3,
    'Ручная работа, мягкая стелька. Подходят и к пляжу, и к прогулкам по городу.', { reviews: 87 }),
  p(g('p5', 'Льняные шорты', 'bottom', '#CDBB98', 'песочный', 'warm', ['casual', 'beach'], ['hot'], 'лён'), 's2', 2490, 2,
    'Шорты на резинке с завязками, длина до середины бедра.'),
  p(g('p6', 'Плавательные шорты', 'bottom', '#2C6E8F', 'морской', 'cool', ['beach'], ['hot'], 'полиэстер'), 's4', 1800, 5,
    'Быстросохнущая ткань, сетка внутри.'),
  p(g('p7', 'Соломенная шляпа', 'acc', '#D9C38F', 'натуральный', 'warm', ['beach', 'casual'], ['hot'], 'солома'), 's4', 1200, 5,
    'Широкие поля, защищает от солнца.'),
  p(g('p8', 'Белый сарафан миди', 'dress', '#F2EFE8', 'белый', 'neutral', ['beach', 'casual', 'date', 'evening'], ['hot'], 'хлопок'), 's1', 4800, 3,
    'Лёгкий сарафан на тонких бретелях.'),
  p(g('p9', 'Тёмно-синий кардиган', 'outer', '#1F2A44', 'тёмно-синий', 'cool', ['casual', 'office', 'date'], ['cool', 'cold'], 'шерсть'), 's1', 6200, 2,
    'Мягкий кардиган из мериносовой шерсти на пуговицах.', { stock: 3, reviews: 64 }),
  p(g('p10', 'Кожаные кроссовки', 'shoes', '#F5F5F3', 'белый', 'neutral', ['casual', 'sport', 'date'], ['warm', 'cool'], 'кожа'), 's2', 7900, 2,
    'Минималистичные белые кроссовки из гладкой кожи.', { sponsored: true, reviews: 205 }),
  p(g('p11', 'Шерстяное пальто', 'outer', '#8A7560', 'кэмел', 'warm', ['office', 'casual', 'date', 'evening'], ['cool', 'cold'], 'шерсть'), 's1', 14900, 3,
    'Прямое пальто до колена, утеплённая подкладка.', { reviews: 41 }),
  p(g('p12', 'Чёрное платье-комбинация', 'dress', '#1D1D1F', 'чёрный', 'neutral', ['party', 'evening', 'date'], ['hot', 'warm'], 'вискоза'), 's3', 4500, 4,
    'Надето один раз на свадьбу подруги. Размер S.', { oldPrice: 12000, stock: 1, sizes: ['S'], rating: 4.9, reviews: 23 }),
  p(g('p13', 'Набор футболок, 3 шт.', 'top', '#2B2B2B', 'чёрный', 'neutral', ['casual', 'sport'], ['hot', 'warm'], 'хлопок'), 's4', 1490, 5,
    'Базовые футболки плотного хлопка.'),
  p(g('p14', 'Ботильоны', 'shoes', '#222222', 'чёрный', 'neutral', ['evening', 'party', 'office'], ['cool', 'cold'], 'кожа'), 's5', 8900, 3,
    'Кожаные ботильоны на устойчивом каблуке 5 см.'),
  p(g('p15', 'Рубашка оверсайз', 'top', '#F4F1EA', 'молочный', 'neutral', ['office', 'casual', 'interview'], ['warm', 'cool'], 'хлопок'), 's2', 3290, 2,
    'Плотный хлопок, удлинённая спинка.'),
  p(g('p16', 'Трикотажное поло', 'top', '#2E4A3E', 'тёмно-зелёный', 'cool', ['casual', 'date', 'evening'], ['hot', 'warm'], 'хлопок'), 's1', 2990, 3,
    'Поло тонкой вязки с коротким рукавом.'),
  p(g('p17', 'Мини-сумка', 'acc', '#C6A15B', 'золотистый', 'warm', ['evening', 'party', 'date'], ALL, 'кожа'), 's3', 2100, 4,
    'Вечерняя сумочка на цепочке.', { oldPrice: 5900, stock: 1 }),
  p(g('p18', 'Непромокаемая парка', 'outer', '#4B5A4A', 'хаки', 'warm', ['casual', 'office'], ['cool'], 'мембрана'), 's4', 9900, 5,
    'Мембрана, проклеенные швы, капюшон. Для дождливой осени.'),
  p(g('p19', 'Спортивные легинсы', 'bottom', '#1C1C1C', 'чёрный', 'neutral', ['sport'], ['warm', 'cool'], 'эластан'), 's4', 1990, 5,
    'Высокая посадка, не просвечивают.'),
  p(g('p20', 'Льняной пиджак', 'outer', '#D7CBB5', 'песочный', 'warm', ['evening', 'office', 'date', 'interview'], ['hot', 'warm'], 'лён'), 's2', 8990, 2,
    'Пиджак без подкладки для жаркого лета.', { sponsored: true, reviews: 97 }),
  // Branded resale: shops, resellers and private sellers.
  ...[
    p(g('p21', 'Supreme Box Logo худи', 'top', '#8B1E2A', 'красный', 'bright', ['casual', 'party'], ['cool', 'cold'], 'хлопок'), 's6', 24900, 2,
      'Оригинал, носил один сезон. Чек и бирки сохранились.', { brand: 'Supreme', condition: 'used', stock: 1, reviews: 18 }),
    p(g('p22', 'Supreme кепка Camp Cap', 'acc', '#1C1C1C', 'чёрный', 'neutral', ['casual', 'party'], ['hot', 'warm', 'cool'], 'хлопок'), 's7', 6500, 2,
      'Надета пару раз, без дефектов.', { brand: 'Supreme', condition: 'likeNew', stock: 1 }),
    p(g('p23', 'Supreme футболка', 'top', '#FFFFFF', 'белый', 'neutral', ['casual', 'party'], ['hot', 'warm'], 'хлопок'), 's6', 7900, 2,
      'Новая, с бирками. Размер M.', { brand: 'Supreme', condition: 'new', stock: 1, sizes: ['M'] }),
    p(g('p24', 'Stone Island свитшот', 'top', '#3B4A5C', 'тёмно-синий', 'cool', ['casual', 'date'], ['cool', 'cold'], 'хлопок'), 's7', 14900, 3,
      'Патч на месте, состояние отличное.', { brand: 'Stone Island', condition: 'likeNew', stock: 1 }),
    p(g('p25', 'Stone Island куртка Soft Shell', 'outer', '#2B2F36', 'графит', 'neutral', ['casual'], ['cool'], 'мембрана'), 's6', 29000, 2,
      'Носил два сезона, есть лёгкие следы носки.', { brand: 'Stone Island', condition: 'used', stock: 1 }),
    p(g('p26', 'Ralph Lauren поло', 'top', '#1D3557', 'тёмно-синий', 'cool', ['casual', 'date', 'office'], ['hot', 'warm'], 'хлопок'), 's3', 4200, 3,
      'Классическое поло, надето пару раз.', { brand: 'Ralph Lauren', condition: 'likeNew', stock: 1 }),
    p(g('p27', 'Ralph Lauren кашемировый свитер', 'top', '#D8C8AA', 'бежевый', 'warm', ['casual', 'office', 'date'], ['cool', 'cold'], 'кашемир'), 's7', 9800, 3,
      'Кашемир, без катышков после чистки.', { brand: 'Ralph Lauren', condition: 'used', stock: 1 }),
    p(g('p28', 'Carhartt WIP куртка Detroit', 'outer', '#8A6D3B', 'коричневый', 'warm', ['casual'], ['cool'], 'хлопок'), 's6', 12500, 2,
      'Красиво потёртая, без дыр.', { brand: 'Carhartt WIP', condition: 'used', stock: 1 }),
    p(g('p29', 'Carhartt WIP брюки', 'bottom', '#4B4237', 'тёмно-коричневый', 'warm', ['casual'], ['warm', 'cool', 'cold'], 'хлопок'), 's7', 8900, 3,
      'Новые, с бирками.', { brand: 'Carhartt WIP', condition: 'new', stock: 2 }),
    p(g('p30', 'The North Face пуховик Nuptse', 'outer', '#1C1C1C', 'чёрный', 'neutral', ['casual'], ['cold'], 'пух'), 's7', 21000, 3,
      'Один сезон, хранился в чехле.', { brand: 'The North Face', condition: 'likeNew', stock: 1 }),
    p(g('p31', 'New Balance 990v6', 'shoes', '#9A9C9F', 'серый', 'neutral', ['casual', 'sport'], ['warm', 'cool'], 'замша'), 's6', 23500, 2,
      'Новые, в коробке.', { brand: 'New Balance', condition: 'new', stock: 1 }),
    p(g('p32', 'Nike Air Force 1', 'shoes', '#F5F5F3', 'белый', 'neutral', ['casual', 'sport', 'date'], ['hot', 'warm', 'cool'], 'кожа'), 's7', 11900, 3,
      'Новые, оригинал.', { brand: 'Nike', condition: 'new', stock: 3 }),
    p(g('p33', "Levi's 501", 'bottom', '#4E6A8C', 'синий', 'cool', ['casual', 'date'], ['warm', 'cool', 'cold'], 'деним'), 's3', 3500, 3,
      'Классические 501, слегка потёртые.', { brand: "Levi's", condition: 'used', stock: 1 }),
    p(g('p34', "Arc'teryx куртка Beta", 'outer', '#2C3E2F', 'тёмно-зелёный', 'cool', ['casual', 'sport'], ['cool'], 'мембрана'), 's6', 34000, 2,
      'Носил один поход, как новая.', { brand: "Arc'teryx", condition: 'likeNew', stock: 1 }),
    p(g('p35', 'Max Mara пальто', 'outer', '#C2A27A', 'кэмел', 'warm', ['office', 'date', 'evening'], ['cool', 'cold'], 'шерсть'), 's3', 39000, 4,
      'Культовое пальто, носила три сезона, после химчистки.', { brand: 'Max Mara', condition: 'used', stock: 1, sizes: ['S'] }),
  ],
];

export const WEATHER = {
  city: 'Москва',
  temp: 4,
  feels: 0,
  text: 'Облачно, дождь после 15:00',
  wind: 7,
  warmth: 'cool' as Warmth,
  rain: true,
};

export interface CalendarEvent {
  id: string;
  title: string;
  when: Date;
  place: string;
  weather: string;
  prompt: string;
}

export function demoEvents(now: Date): CalendarEvent[] {
  const at = (days: number, h: number) => {
    const d = addDays(now, days);
    d.setHours(h, 0, 0, 0);
    return d;
  };
  return [
    { id: 'e1', title: 'Свидание', when: at(1, 19), place: 'Ресторан', weather: 'вечером +6°, без осадков', prompt: 'Найди образ для свидания завтра вечером в ресторане' },
    { id: 'e2', title: 'Собеседование', when: at(3, 11), place: 'Офис компании', weather: '+3°, ветрено', prompt: 'Подбери одежду для собеседования' },
    { id: 'e3', title: 'Отпуск · вылет', when: at(9, 7), place: 'Тёплая страна, 10 дней', weather: '+29°, солнце', prompt: 'Собери мне 5 образов для отпуска в тёплой стране на 10 дней. Бюджет — 30 000 рублей. Нужна одежда для пляжа, прогулок, ресторанов и вечерних выходов.' },
  ];
}

export interface BrandSummary {
  name: string;
  count: number;
  minPrice: number;
}

/** Brands that currently have something on sale, A–Z. */
export function brandsOnSale(products: Product[]): BrandSummary[] {
  const map = new Map<string, BrandSummary>();
  for (const p of products) {
    if (!p.brand || p.stock === 0) continue;
    const b = map.get(p.brand) ?? { name: p.brand, count: 0, minPrice: Infinity };
    b.count += 1;
    b.minPrice = Math.min(b.minPrice, p.price);
    map.set(p.brand, b);
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export const POPULAR_BRANDS = ['Supreme', 'Stone Island', 'Ralph Lauren', 'The North Face', 'New Balance', 'Carhartt WIP'];
