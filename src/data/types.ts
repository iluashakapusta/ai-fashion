import type { SizeChart } from '../engine/sizing';

export type Kind = 'top' | 'bottom' | 'dress' | 'outer' | 'shoes' | 'acc';
export type Occasion = 'office' | 'casual' | 'date' | 'evening' | 'party' | 'beach' | 'sport' | 'interview';
export type Warmth = 'hot' | 'warm' | 'cool' | 'cold';
export type Tone = 'neutral' | 'warm' | 'cool' | 'bright';

export interface Garment {
  id: string;
  name: string;
  kind: Kind;
  color: string;
  colorName: string;
  tone: Tone;
  styles: Occasion[];
  warmth: Warmth[];
  material?: string;
}

export interface WardrobeItem extends Garment {
  wears: number;
  price?: number;
  photoUri?: string;
}

export interface Product extends Garment {
  sellerId: string;
  price: number;
  oldPrice?: number;
  sizes: string[];
  stock: number;
  deliveryDays: number;
  rating: number;
  reviews: number;
  /** Paid promotion. Always labelled «Реклама» and never used by the independent AI stylist. */
  sponsored?: boolean;
  description: string;
  /** Brand name as sold; plain shop basics have none. */
  brand?: string;
  condition?: Condition;
  /** Seller's size chart: body measurements each size is made for. Required from sellers. */
  sizeChart?: SizeChart;
}

export type Condition = 'new' | 'likeNew' | 'used';

export const CONDITION_LABEL: Record<Condition, string> = {
  new: 'Новое',
  likeNew: 'Как новое',
  used: 'С ноской',
};

export type SellerType = 'shop' | 'brand' | 'private' | 'partner';

export interface Seller {
  id: string;
  name: string;
  type: SellerType;
  rating: number;
  city: string;
}

export interface LookItem {
  source: 'wardrobe' | 'product';
  id: string;
  slot: Kind;
}

export interface Look {
  id: string;
  title: string;
  occasion: Occasion;
  warmth: Warmth;
  items: LookItem[];
}

export interface CartLine {
  productId: string;
  size: string;
}

export interface Order {
  id: string;
  number: number;
  purchaseId: string;
  sellerId: string;
  lines: CartLine[];
  total: number;
  createdAt: number;
  status: number;
  eta: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  chips?: string[];
  lookIds?: string[];
  paywall?: boolean;
}

export const KIND_LABEL: Record<Kind, string> = {
  top: 'Верх',
  bottom: 'Низ',
  dress: 'Платья',
  outer: 'Верхняя одежда',
  shoes: 'Обувь',
  acc: 'Аксессуары',
};

export const OCCASION_LABEL: Record<Occasion, string> = {
  office: 'Офис',
  casual: 'Прогулка',
  date: 'Свидание',
  evening: 'Ресторан',
  party: 'Вечеринка',
  beach: 'Пляж',
  sport: 'Спорт',
  interview: 'Собеседование',
};

export const ORDER_STATUS = ['Оплачен', 'Собирается', 'В пути', 'Доставлен'];
