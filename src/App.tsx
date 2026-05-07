import { useState, useEffect } from 'react';
import './App.css';

interface Artwork {
  id: string;
  title: string;
  category?: any;
  comments?: string;
  photo?: { url: string };
  createdAt: string;
}

// --- 🌟 1. ここが「管理センター」です ---
const EXHIBITION_SCHEDULE = [
  {
    start: new Date(2026, 3, 20), // 4月20日
    end: new Date(2026, 3, 30),   // 4月30日
    category: '動物',      // 連動させるカテゴリ名
    message: '🦒 ただいま「動物の企画展」をはじめました！ぜひ見てね！🐘',
    type: 'info'
  },
  {
    start: new Date(2026, 4, 5),  // 5月5日
    end: new Date(2026, 4, 5),    // 5月5日
    category: '工作',             // 連動させるカテゴリ名
    message: '🎏 こどもの日スペシャル！新しい工作を公開中！✨',
    type: 'special'
  },
  {
    start: new Date(2026, 4, 1),  // 5月1日
    end: new Date(2026, 4, 20),    // 5月20日
    category: '5月の企画展',             // 連動させるカテゴリ名
    message: 'ただいま、キャラクター展を開催しています✨✨どうぞご覧ください🌸',
    type: 'special'
  },
  {
    start: new Date(2026, 5, 1),  // 【修正済】6月1日
    end: new Date(2026, 5, 20),    // 6月20日
    category: '6月の企画展',             // 連動させるカテゴリ名
    message: '😃ただいま、初めて作った〇〇をテーマにしてはじめて展を開催しています☆彡',
    type: 'special'
  }
];

const EXHIBITION_NAMES: Record<string, string> = {
  '5月の企画展': 'すきなキャラクター展',
  '工作': 'ひかりの工作コーナー',
  '動物': 'だいすき動物展',
  '6月の企画展': 'はじめて展',
};

// 常に表示しておきたい（隠さなくて良い）カテゴリ
const PERMANENT_CATEGORIES = ['動物']; 

export default function App() {
  const [artworks, setArtworks] = useState<Artwork[] | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    const SERVICE_DOMAIN = 'y3scy93hal';
    const API_KEY = 'rSrEE2AyKedsAWFehddImURmlgNucTzu8PHB';
    fetch(`https://${SERVICE_DOMAIN}.microcms.io/api/v1/artworks?limit=100`, {
      headers: { 'X-MICROCMS-API-KEY': API_KEY }
    })
      .then(res => res.json())
      .then(data => setArtworks(data.contents))
      .catch(err => console.error("エラー:", err));
  }, []);

  const getCategoryName = (raw: any): string | null => {
    if (!raw) return null;
    return typeof raw === 'string' ? raw : (Array.isArray(raw) ? raw[0] : raw.name);
  };

  if (!artworks) return <div className="loading-screen">作品搬入中...</div>;

  // --- 🌟 2. 連動ロジックエリア ---
  const today = new Date();

  // 現在の期間に該当するスケジュールを探す（終了日の23時59分59秒まで有効にする）
  const activeEvent = EXHIBITION_SCHEDULE.find(ev => {
    const endOfDay = new Date(ev.end);
    endOfDay.setHours(23, 59, 59, 999);
    return today >= ev.start && today <= endOfDay;
  });

  // 1. 公開する作品をフィルタリング
  const publicArtworks = artworks.filter(art => {
    const catName = getCategoryName(art.category);
    if (!catName) return true;

    // A. 常に公開するカテゴリなら表示
    if (PERMANENT_CATEGORIES.includes(catName)) return true;

    // B. スケジュールで今まさに「公開対象」になっているカテゴリなら表示
    if (activeEvent && catName === activeEvent.category) return true;

    // C. それ以外（未来の企画展など）は非表示
    return false;
  });

  // 2. カテゴリ一覧作成
  const categories: string[] = Array.from(
    new Set(publicArtworks.map(art => getCategoryName(art.category)).filter(Boolean) as string[])
  );

  // 3. 表示する作品の決定
  const displayArtworks = activeCategory === null
    ? (publicArtworks.length > 0 ? [publicArtworks[0]] : [])
    : publicArtworks.filter(art => getCategoryName(art.category) === activeCategory);

  return (
    <div className="museum-container">
      <header className="museum-header">
        <h1>ひかりARTMUSEUM</h1>
      </header>

      {/* 🌟 色分け対応のナビゲーションメニュー */}
      <nav className="exhibition-menu">
        <button 
          className={`btn-default ${activeCategory === null ? 'active' : ''}`} 
          onClick={() => setActiveCategory(null)}
        >
          本日の作品
        </button>
        {categories.map(cat => {
          // 常設か企画展かを判定
          const isPermanent = PERMANENT_CATEGORIES.includes(cat);
          let buttonClass = isPermanent ? 'btn-permanent' : 'btn-special';
          
          if (activeCategory === cat) {
            buttonClass += ' active';
          }

          return (
            <button 
              key={cat} 
              className={buttonClass} 
              onClick={() => setActiveCategory(cat)}
            >
              {EXHIBITION_NAMES[cat] || cat}
            </button>
          );
        })}
      </nav>

      <main className="museum-main">
        {/* 🌟 3. バナーもスケジュールから自動表示 */}
        {activeEvent && (
          <div className={`special-banner ${activeEvent.type}`}>
            {activeEvent.message}
          </div>
        )}

        {activeCategory && (
          <div className="section-title">
            <h2>{EXHIBITION_NAMES[activeCategory] || activeCategory}</h2>
          </div>
        )}

        <div className={activeCategory === null ? 'spotlight-grid' : 'gallery-grid'}>
          {displayArtworks.map((art) => (
            <article key={art.id} className="art-card">
              <div className="art-image-wrapper">
                <img src={art.photo?.url} alt={art.title} />
              </div>
              <div className="art-info">
                <h3 className="art-title">{art.title}</h3>
                {art.comments && <div className="art-comment"><p>「{art.comments}」</p></div>}
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}