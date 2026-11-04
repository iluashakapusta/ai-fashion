import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEMO_BODY, DEMO_WARDROBE, PRODUCTS, WEATHER } from '../data/demo';
import { bodyFilled, recommendSize, type BodyParams } from '../engine/sizing';
import type { Post } from '../data/feed';
import type { CartLine, ChatMessage, Look, Order, Product, WardrobeItem } from '../data/types';
import { alternatives, parseRequest, planLooks } from '../engine/stylist';
import { C, plural } from '../theme';

export const FREE_REQUESTS_PER_DAY = 3;

export interface Settings {
  calendar: boolean;
  location: boolean;
  notifyEvents: boolean;
  notifyWeather: boolean;
  notifyTrips: boolean;
  notifyAi: boolean;
  frequency: 'rare' | 'normal' | 'often';
}

const DEFAULT_SETTINGS: Settings = {
  calendar: true, location: true, notifyEvents: true, notifyWeather: true, notifyTrips: true, notifyAi: false, frequency: 'normal',
};

const GREETING: ChatMessage = {
  id: 'hello',
  role: 'ai',
  text: 'Привет! Я знаю твой гардероб, календарь и погоду. Напиши обычными словами, что нужно, — соберу образы и подскажу, что докупить.',
};

let seq = 0;
const uid = (p: string) => `${p}${Date.now().toString(36)}${(seq++).toString(36)}`;

interface Store {
  body: BodyParams;
  setBody: (b: BodyParams) => void;
  /** Recommended size for a product given the buyer's measurements. */
  sizeFor: (p: Product) => ReturnType<typeof recommendSize>;
  wardrobe: WardrobeItem[];
  products: Product[];
  looks: Record<string, Look>;
  messages: ChatMessage[];
  cart: CartLine[];
  orders: Order[];
  favorites: string[];
  premium: boolean;
  requestsToday: number;
  settings: Settings;
  todayVariant: number;
  likes: string[];
  subscriptions: string[];
  reported: string[];
  myPosts: Post[];
  toggleLike: (postId: string) => void;
  toggleSubscribe: (id: string) => void;
  report: (postId: string) => void;
  addPost: (post: Omit<Post, 'id' | 'author' | 'authorColor' | 'likes' | 'comments' | 'hoursAgo'>) => void;
  addItem: (item: Omit<WardrobeItem, 'id' | 'wears'>) => void;
  removeItem: (id: string) => void;
  ask: (text: string) => void;
  replaceInLook: (lookId: string, index: number) => void;
  addToCart: (productId: string, size?: string) => void;
  addLooksToCart: (lookIds: string[]) => number;
  removeFromCart: (index: number) => void;
  checkout: () => string;
  setPremium: (v: boolean) => void;
  toggleFavorite: (productId: string) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  nextTodayLook: () => void;
  reset: () => void;
}

const Ctx = createContext<Store | null>(null);

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>(DEMO_WARDROBE);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [looks, setLooks] = useState<Record<string, Look>>({});
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [premium, setPremium] = useState(false);
  const [requestsToday, setRequests] = useState(0);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [body, setBody] = useState<BodyParams>(DEMO_BODY);
  const [todayVariant, setTodayVariant] = useState(0);
  const [likes, setLikes] = useState<string[]>([]);
  const [subscriptions, setSubscriptions] = useState<string[]>(['c1', 's1']);
  const [reported, setReported] = useState<string[]>([]);
  const [myPosts, setMyPosts] = useState<Post[]>([]);

  // Orders move forward on their own so the demo shows live tracking.
  useEffect(() => {
    if (!orders.some((o) => o.status < 2)) return;
    const t = setInterval(() => {
      setOrders((os) => os.map((o, i) => (o.status < 2 && Math.random() < 0.5 + i * 0.1 ? { ...o, status: o.status + 1 } : o)));
    }, 6000);
    return () => clearInterval(t);
  }, [orders]);

  const ask = useCallback((text: string) => {
    const user: ChatMessage = { id: uid('m'), role: 'user', text };
    if (!premium && requestsToday >= FREE_REQUESTS_PER_DAY) {
      setMessages((m) => [...m, user, {
        id: uid('m'), role: 'ai', paywall: true,
        text: `Бесплатно — ${FREE_REQUESTS_PER_DAY} запроса в день, на сегодня они закончились. С Premium стилист без ограничений, а ещё планировщик поездок и кэшбэк на покупки.`,
      }]);
      return;
    }
    setRequests((n) => n + 1);
    const brief = parseRequest(text, WEATHER.warmth);
    const plan = planLooks({ wardrobe, products, body: bodyFilled(body) ? body : undefined }, brief, uid('l'), requestsToday);
    if (plan.buyIds.length) plan.reply += bodyFilled(body)
      ? ' Размеры подобрал по твоим параметрам — в образах только вещи, где есть твой размер.'
      : ' Укажи свои параметры в профиле — подберу и размер.';
    setLooks((ls) => {
      const next = { ...ls };
      plan.looks.forEach((l) => (next[l.id] = l));
      return next;
    });
    setMessages((m) => [...m, user, {
      id: uid('m'), role: 'ai', text: plan.reply, chips: plan.chips, lookIds: plan.looks.map((l) => l.id),
    }]);
  }, [premium, requestsToday, wardrobe, products, body]);

  const replaceInLook = useCallback((lookId: string, index: number) => {
    setLooks((ls) => {
      const look = ls[lookId];
      if (!look) return ls;
      const alts = alternatives({ wardrobe, products, body: bodyFilled(body) ? body : undefined }, look, index);
      if (!alts.length) return ls;
      const cur = alts.findIndex((a) => a.g.id === look.items[index].id);
      const nextAlt = alts[(cur + 1) % alts.length];
      const items = look.items.slice();
      items[index] = { ...items[index], id: nextAlt.g.id, source: nextAlt.source };
      return { ...ls, [lookId]: { ...look, items } };
    });
  }, [wardrobe, products, body]);

  const addToCart = useCallback((productId: string, size?: string) => {
    const p = products.find((x) => x.id === productId);
    if (!p) return;
    const fit = size || recommendSize(p, body).size || p.sizes[Math.floor(p.sizes.length / 2)];
    setCart((c) => (c.some((l) => l.productId === productId) ? c : [...c, { productId, size: fit }]));
  }, [products, body]);

  const addLooksToCart = useCallback((lookIds: string[]) => {
    const ids = new Set<string>();
    lookIds.forEach((id) => looks[id]?.items.forEach((it) => it.source === 'product' && ids.add(it.id)));
    ids.forEach((id) => addToCart(id));
    return ids.size;
  }, [looks, addToCart]);

  const checkout = useCallback(() => {
    const purchaseId = uid('pur');
    const bySeller = new Map<string, CartLine[]>();
    cart.forEach((l) => {
      const p = products.find((x) => x.id === l.productId)!;
      bySeller.set(p.sellerId, [...(bySeller.get(p.sellerId) || []), l]);
    });
    const now = Date.now();
    const base = 10482 + orders.length;
    const created: Order[] = [...bySeller.entries()].map(([sellerId, lines], i) => {
      const ps = lines.map((l) => products.find((x) => x.id === l.productId)!);
      return {
        id: uid('o'), number: base + i, purchaseId, sellerId, lines,
        total: ps.reduce((s, p) => s + p.price, 0), createdAt: now, status: 0,
        eta: now + Math.max(...ps.map((p) => p.deliveryDays)) * 86400000,
      };
    });
    setProducts((all) => all.map((p) => (cart.some((l) => l.productId === p.id) ? { ...p, stock: Math.max(0, p.stock - 1) } : p)));
    setOrders((os) => [...created, ...os]);
    setCart([]);
    return purchaseId;
  }, [cart, products, orders.length]);

  const value = useMemo<Store>(() => ({
    wardrobe, products, looks, messages, cart, orders, favorites, premium, requestsToday, settings, todayVariant,
    body, setBody, sizeFor: (p) => recommendSize(p, body),
    likes, subscriptions, reported, myPosts,
    toggleLike: (id) => setLikes((xs) => (xs.includes(id) ? xs.filter((x) => x !== id) : [...xs, id])),
    toggleSubscribe: (id) => setSubscriptions((xs) => (xs.includes(id) ? xs.filter((x) => x !== id) : [...xs, id])),
    report: (id) => setReported((r) => (r.includes(id) ? r : [...r, id])),
    addPost: (post) => setMyPosts((ps) => [{ ...post, id: uid('post'), author: 'Вы', authorColor: C.accent, likes: 0, comments: 0, hoursAgo: 0 }, ...ps]),
    addItem: (item) => setWardrobe((w) => [{ ...item, id: uid('w'), wears: 0 }, ...w]),
    removeItem: (id) => setWardrobe((w) => w.filter((x) => x.id !== id)),
    ask,
    replaceInLook,
    addToCart,
    addLooksToCart,
    removeFromCart: (index) => setCart((c) => c.filter((_, i) => i !== index)),
    checkout,
    setPremium,
    toggleFavorite: (id) => setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id])),
    updateSettings: (patch) => setSettings((s) => ({ ...s, ...patch })),
    nextTodayLook: () => setTodayVariant((v) => v + 1),
    reset: () => {
      setWardrobe(DEMO_WARDROBE); setProducts(PRODUCTS); setLooks({}); setMessages([GREETING]); setCart([]);
      setOrders([]); setFavorites([]); setPremium(false); setRequests(0); setSettings(DEFAULT_SETTINGS); setTodayVariant(0);
      setLikes([]); setSubscriptions(['c1', 's1']); setReported([]); setMyPosts([]); setBody(DEMO_BODY);
    },
  }), [wardrobe, products, looks, messages, cart, orders, favorites, premium, requestsToday, settings, todayVariant,
    likes, subscriptions, reported, myPosts, body,
    ask, replaceInLook, addToCart, addLooksToCart, checkout]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore outside AppStoreProvider');
  return s;
}

export function useGarment(source: 'wardrobe' | 'product', id: string) {
  const { wardrobe, products } = useStore();
  return source === 'wardrobe' ? wardrobe.find((w) => w.id === id) : products.find((p) => p.id === id);
}

export function itemsWord(n: number) {
  return `${n} ${plural(n, ['вещь', 'вещи', 'вещей'])}`;
}
