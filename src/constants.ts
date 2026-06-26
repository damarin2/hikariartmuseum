import type { ExhibitionEvent } from './types';

export const EXHIBITION_SCHEDULE: ExhibitionEvent[] = [
  {
    start: new Date(2026, 3, 20),
    end: new Date(2026, 3, 30),
    category: 'animal',
    message: '🦒 ただいま「動物の企画展」をはじめました！ぜひ見てね！🐘',
    type: 'info'
  },
  {
    start: new Date(2026, 4, 5),
    end: new Date(2026, 4, 5),
    category: '工作',
    message: '🎏 こどもの日スペシャル！新しい工作を公開中！✨',
    type: 'special'
  },
  {
    start: new Date(2026, 6, 1),
    end: new Date(2026, 6, 20),
    category: 'craft',
    message: '7月は工作展を開催しています✨✨どうぞご覧ください！',
    type: 'craft'
  },
  {
    start: new Date(2026, 5, 1),
    end: new Date(2026, 5, 21),
    category: 'first',
    message: '😃６月は、初めて作った〇〇をテーマにして「はじめて展」を開催しています🎂Happy Birthday!',
    type: 'special'
  }
];

export const EXHIBITION_NAMES: Record<string, string> = {
  '5月の企画展': 'すきなキャラクター展',
  'craft': 'ひかりの工作コーナー',
  'animal': 'だいすき動物展',
  'first': 'はじめて展',
};

export const PERMANENT_CATEGORIES = ['animal'];

export const SPECIAL_LINKS = [
  {
    path: '/scratch',
    label: '✨ スクラッチで遊ぶ ✨',
    color: '#ffd700',
    start: new Date(2026, 6, 1), // 2026年7月1日（7月は「6」）
    end: new Date(2026, 6, 31)   // 2026年7月31日
  },
  
];