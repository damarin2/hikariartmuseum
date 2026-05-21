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

// 🎨 美術館の名言リスト
const MUSEUM_QUOTES = [
  {
    en: "Every child is an artist. The problem is how to remain an artist once we grow up.",
    jp: "すべての子供はアーティストである。問題は、大人になってもアーティストでいられるかどうかだ。",
    author: "パブロ・ピカソ"
  },
  {
    en: "It took me four years to paint like Raphael, but a lifetime to paint like a child.",
    jp: "ラファエロのように描くには4年かかったが、子供のように描くには一生かかった。",
    author: "パブロ・ピカソ"
  },
  {
    en: "If you truly love nature, you will find beauty everywhere.",
    jp: "自然を心から愛していれば、どこにでも美しさを見つけることができる。",
    author: "フィンセント・ファン・ゴッホ"
  },
  {
    en: "Have no fear of perfection, you'll never reach it.",
    jp: "完璧を恐れるな。どうせ到達できないのだから。",
    author: "サルバドール・ダリ"
  }
];

// --- 🌟 1. 管理センター ---
const EXHIBITION_SCHEDULE = [
  {
    start: new Date(2026, 3, 20),
    end: new Date(2026, 3, 30),
    category: '動物',
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
    start: new Date(2026, 4, 1),
    end: new Date(2026, 4, 20),
    category: '5月の企画展',
    message: 'ただいま、キャラクター展を開催しています✨✨どうぞご覧ください🌸',
    type: 'special'
  },
  {
    start: new Date(2026, 5, 1),
    end: new Date(2026, 5, 20),
    category: '6月の企画展',
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

const PERMANENT_CATEGORIES = ['動物']; 


function ArtCard({ art }: { art: Artwork }) {
  // この絵「専用」のいいねメモ帳
  const [likes, setLikes] = useState(0);

  // いいねの数によってメッセージを変える
  let message = "";
  if (likes >= 10) {
    message = "✨ ありがとう！（照） ✨";
  } else if (likes >= 3) {
    message = "😊 ありがとう";
  }

  return (
    <article className="art-card">
      <div className="art-image-wrapper">
        <img src={art.photo?.url} alt={art.title} />
      </div>
      <div className="art-info">
        <h3 className="art-title">{art.title}</h3>
        {art.comments && <div className="art-comment"><p>「{art.comments}」</p></div>}
      </div>

      {/* 👏 いいねボタンエリア */}
      <div className="interaction-area" style={{ marginTop: '10px', textAlign: 'center' }}>
        <button 
          className="like-btn" 
          onClick={() => setLikes(likes + 1)}
          style={{
            padding: '8px 16px',
            fontSize: '1rem',
            backgroundColor: '#ffb6c1',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            transition: 'transform 0.1s'
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          👏 いいね！ {likes > 0 && `(${likes})`}
        </button>
        
        {/* メッセージがある時だけ表示 */}
        {message && (
          <p className="like-message" style={{ color: '#d1487b', fontWeight: 'bold', marginTop: '8px' }}>
            {message}
          </p>
        )}
      </div>
    </article>
  );
}
// =========================================================================


// --- ここから下がメインのアプリ（美術館全体） ---
export default function App() {
  const [artworks, setArtworks] = useState<Artwork[] | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [randomQuote, setRandomQuote] = useState<{en: string, jp: string, author: string} | null>(null);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * MUSEUM_QUOTES.length);
    setRandomQuote(MUSEUM_QUOTES[randomIndex]);

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

  const today = new Date();
  const activeEvent = EXHIBITION_SCHEDULE.find(ev => {
    const endOfDay = new Date(ev.end);
    endOfDay.setHours(23, 59, 59, 999);
    return today >= ev.start && today <= endOfDay;
  });

  const publicArtworks = artworks.filter(art => {
    const catName = getCategoryName(art.category);
    if (!catName) return true;
    if (PERMANENT_CATEGORIES.includes(catName)) return true;
    if (activeEvent && catName === activeEvent.category) return true;
    return false;
  });

  const categories: string[] = Array.from(
    new Set(publicArtworks.map(art => getCategoryName(art.category)).filter(Boolean) as string[])
  );

  const displayArtworks = activeCategory === null
    ? publicArtworks.slice(0, 1) 
    : publicArtworks.filter(art => getCategoryName(art.category) === activeCategory);

  return (
    <div className="museum-container">
      <header className="museum-header">
        <h1>ひかりARTMUSEUM</h1>
      </header>

      <nav className="exhibition-menu">
        <button 
          className={`btn-default ${activeCategory === null ? 'active' : ''}`} 
          onClick={() => setActiveCategory(null)}
        >
          最新の作品
        </button>
        {categories.map(cat => {
          const isPermanent = PERMANENT_CATEGORIES.includes(cat);
          let buttonClass = isPermanent ? 'btn-permanent' : 'btn-special';
          if (activeCategory === cat) buttonClass += ' active';

          return (
            <button key={cat} className={buttonClass} onClick={() => setActiveCategory(cat)}>
              {EXHIBITION_NAMES[cat] || cat}
            </button>
          );
        })}
      </nav>

      <main className="museum-main">
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
            /* 🌟 ここで先ほど作った「ArtCard」を呼び出します！ */
            <ArtCard key={art.id} art={art} />
          ))}
        </div>
      </main>

      <footer className="museum-footer">
        {randomQuote && (
          <div className="quote-container">
            <p className="quote-en">"{randomQuote.en}"</p>
            <p className="quote-jp">「{randomQuote.jp}」</p>
            <p className="quote-author">— {randomQuote.author}</p>
          </div>
        )}
        <div className="footer-bottom">
          <p>© 2026 ひかりARTMUSEUM</p>
        </div>
      </footer>
    </div>
  );
}