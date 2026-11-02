// Demo content for the feed: platform news, user channels and outfit posts.
// All names and posts are invented for the demo build.
import type { Garment } from './types';

export interface Channel {
  id: string;
  name: string;
  topic: string;
  color: string;
  subscribers: number;
}

export interface NewsItem {
  id: string;
  tag: string;
  title: string;
  text: string;
  minutes: number;
  color: string;
  hoursAgo: number;
}

export interface Post {
  id: string;
  author: string;
  authorColor: string;
  channelId?: string;
  caption: string;
  items: Garment[];
  likes: number;
  comments: number;
  hoursAgo: number;
  /** What the stylist is asked when someone taps «Собрать похожий». */
  prompt: string;
}

export const CHANNELS: Channel[] = [
  { id: 'c1', name: 'Капсула за 10 000', topic: 'Базовый гардероб без лишних трат', color: '#2F4A3A', subscribers: 18400 },
  { id: 'c2', name: 'Винтаж и секонд', topic: 'Находки с историей и как их носить', color: '#74502F', subscribers: 9600 },
  { id: 'c3', name: 'Офисный дресс-код', topic: 'Деловые образы на каждый день', color: '#1F2A44', subscribers: 12100 },
  { id: 'c4', name: 'Уличный стиль', topic: 'Кроссовки, оверсайз, многослойность', color: '#6B1E2E', subscribers: 23800 },
];

export const NEWS: NewsItem[] = [
  {
    id: 'n1', tag: 'Тренды', title: 'Осень: многослойность возвращается',
    text: 'Свитер под тренч, рубашка под кардиган — стилист теперь сам предлагает слои, если на улице ниже +8°.',
    minutes: 3, color: '#D8C8AA', hoursAgo: 2,
  },
  {
    id: 'n2', tag: 'В приложении', title: 'В маркете появились магазины',
    text: 'Подписывайтесь на любимые магазины и бренды — их новинки, которые подходят к вашему гардеробу, будут первыми.',
    minutes: 1, color: '#E3E8DE', hoursAgo: 6,
  },
  {
    id: 'n3', tag: 'Уход', title: 'Как сохранить шерстяные вещи',
    text: 'Стирка, сушка и хранение: пять правил, чтобы свитер не сел и не скатался после первого сезона.',
    minutes: 4, color: '#EDEAE3', hoursAgo: 20,
  },
  {
    id: 'n4', tag: 'Гид', title: 'Что взять в отпуск на 10 дней',
    text: 'Пять образов из 12 вещей: как собрать чемодан, в котором всё сочетается между собой.',
    minutes: 5, color: '#BFD8E6', hoursAgo: 30,
  },
];

const g = (id: string, name: string, kind: Garment['kind'], color: string, tone: Garment['tone'] = 'neutral'): Garment => ({
  id, name, kind, color, colorName: '', tone, styles: ['casual'], warmth: ['cool'],
});

export const POSTS: Post[] = [
  {
    id: 'u1', author: 'Аня К.', authorColor: '#8E3B46', channelId: 'c1',
    caption: 'Неделя в офисе из 9 вещей. Самое полезное приобретение сезона — тёмно-синий кардиган, сочетается вообще со всем.',
    items: [g('x1', 'Кардиган', 'outer', '#1F2A44', 'cool'), g('x2', 'Рубашка', 'top', '#F4F1EA'), g('x3', 'Брюки', 'bottom', '#3A3D45'), g('x4', 'Лоферы', 'shoes', '#1A1A1A')],
    likes: 284, comments: 31, hoursAgo: 1, prompt: 'Подбери мне одежду на следующую неделю',
  },
  {
    id: 'u2', author: 'Миша Л.', authorColor: '#3F6B4E', channelId: 'c4',
    caption: 'Худи + тренч — лучшее сочетание для московского ноября. Кто ещё так носит?',
    items: [g('x5', 'Тренч', 'outer', '#D8C8AA', 'warm'), g('x6', 'Худи', 'top', '#9A9C9F'), g('x7', 'Джинсы', 'bottom', '#4E6A8C', 'cool'), g('x8', 'Кеды', 'shoes', '#F1F0EC')],
    likes: 512, comments: 64, hoursAgo: 3, prompt: 'Собери повседневный образ на прогулку',
  },
  {
    id: 'u3', author: 'Лена В.', authorColor: '#7A5B2E', channelId: 'c2',
    caption: 'Платье с барахолки за 800 ₽ и мамина сумка. Образ на свидание, в котором нет ничего нового.',
    items: [g('x9', 'Платье', 'dress', '#202020'), g('x10', 'Ботильоны', 'shoes', '#222222'), g('x11', 'Сумка', 'acc', '#6B4430', 'warm')],
    likes: 731, comments: 88, hoursAgo: 9, prompt: 'Найди образ для свидания',
  },
  {
    id: 'u4', author: 'Дима С.', authorColor: '#1F2A44', channelId: 'c3',
    caption: 'На собеседование: без галстука, но с блейзером. Прошёл во второй тур.',
    items: [g('x12', 'Блейзер', 'outer', '#1F2A44', 'cool'), g('x13', 'Рубашка', 'top', '#C9D6E8', 'cool'), g('x14', 'Брюки', 'bottom', '#3A3D45'), g('x15', 'Часы', 'acc', '#E8DCC0', 'warm')],
    likes: 198, comments: 22, hoursAgo: 26, prompt: 'Подбери одежду для собеседования',
  },
];

export function ago(hours: number): string {
  if (hours < 1) return 'только что';
  if (hours < 24) return `${hours} ч назад`;
  const d = Math.floor(hours / 24);
  return d === 1 ? 'вчера' : `${d} дн. назад`;
}

export function compactNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace('.', ',')} тыс.`;
  return String(n);
}
