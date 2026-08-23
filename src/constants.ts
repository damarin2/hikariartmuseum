import type { ExhibitionEvent } from './types';

export const EXHIBITION_SCHEDULE: ExhibitionEvent[] = [
  {
    start: new Date(2026, 8, 1),
    end: new Date(2026, 8, 30),
    category: 'letter',
    message: '💌 ９月は、「プレゼント展」を開催しています！ぜひ見てね！💌',
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
    start: new Date(2026, 5, 1),
    end: new Date(2026, 5, 21),
    category: 'first',
    message: '😃６月は、初めて作った〇〇をテーマにして「はじめて展」を開催しています🎂Happy Birthday!',
    type: 'special'
  },
  {
    start: new Date(2026, 6, 1),
    end: new Date(2026, 6, 30),
    category: 'craft',
    message: '7月は工作展を開催しています✨✨どうぞご覧ください！',
    type: 'craft'
  },
  // 🌟 ここに8月（月番号：7）の「おばけ展」のスケジュールを追加！
  {
    start: new Date(2026, 7, 1),   // 2026年8月1日
    end: new Date(2026, 7, 20),    // 2026年8月20日
    category: 'august-ghost',
    message: '👻 8月限定！よるの びじゅつかんで「おばけ展」を開催中！👻',
    type: 'special'
  }
];

export const EXHIBITION_NAMES: Record<string, string> = {
  '5月の企画展': 'すきなキャラクター展',
  'craft': 'ひかりの工作コーナー',
  'animal': 'だいすき動物展',
  'first': 'はじめて展',
  // 🌟 カテゴリー名と表示名を結びつける
  'august-ghost': 'ぷかぷか・おばけ展',
};

export const PERMANENT_CATEGORIES = ['animal'];

export const SPECIAL_LINKS = [
  {
    path: '/scratch',
    label: '✨ スクラッチで遊ぶ ✨',
    color: '#ffd700',
    start: new Date(2026, 6, 1), // 2026年7月1日
    end: new Date(2026, 6, 31)   // 2026年7月31日
  },
  // 🌟 メニューに「おばけ展」への特別ボタンを8月だけ表示する！
  {
    path: '/ghost',
    label: '👻 おばけ展にいく 👻',
    color: '#a78bfa',            // 夜っぽい、優しいむらさき色
    start: new Date(2026, 5, 1), // 2026年8月1日
    end: new Date(2026, 5, 31)   // 2026年8月31日
  },
];