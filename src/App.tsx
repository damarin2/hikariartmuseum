import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import './App.css';

interface Artwork {
  id: string;
  title: string;
  category?: any;
  comments?: string;
  photo?: { url: string };
  createdAt: string;
}

const EXHIBITION_SCHEDULE = [
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
    start: new Date(2026, 4, 1),
    end: new Date(2026, 4, 20),
    category: '5月の企画展',
    message: 'ただいま、キャラクター展を開催しています✨✨どうぞご覧ください🌸',
    type: 'special'
  },
  {
    start: new Date(2026, 5, 1),
    end: new Date(2026, 5, 21),
    category: 'first',
    message: '😃６月は、初めて作った〇〇をテーマにして「はじめて展」を開催しています🎂Happy Birthday!',
    type: 'special'
  }
];

const EXHIBITION_NAMES: Record<string, string> = {
  '5月の企画展': 'すきなキャラクター展',
  'craft': 'ひかりの工作コーナー',
  'animal': 'だいすき動物展',
  'first': 'はじめて展',
};

const PERMANENT_CATEGORIES = ['animal'];

function ArtCard({ art }: { art: Artwork }) {
  const [likes, setLikes] = useState(0);

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
        
        {message && (
          <p className="like-message" style={{ color: '#d1487b', fontWeight: 'bold', marginTop: '8px' }}>
            {message}
          </p>
        )}
      </div>
    </article>
  );
}

function ExhibitionRoom({ publicArtworks, categories, activeEvent }: any) {
  const { categoryId } = useParams(); 
  const activeCategory = categoryId || null;

  const displayArtworks = activeCategory === null
    ? publicArtworks.slice(0, 1) 
    : publicArtworks.filter((art: any) => {
        const raw = art.category;
        const catName = typeof raw === 'string' ? raw : (Array.isArray(raw) ? raw[0] : raw?.name);
        return catName === activeCategory;
      });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeCategory]);

  return (
    <>
      <nav className="exhibition-menu">
        <Link 
          to="/" 
          className={`btn-default ${activeCategory === null ? 'active' : ''}`}
          style={{ textDecoration: 'none' }}
        >
          最新の作品
        </Link>

        {categories.map((cat: string) => {
          const isPermanent = PERMANENT_CATEGORIES.includes(cat);
          let buttonClass = isPermanent ? 'btn-permanent' : 'btn-special';
          if (activeCategory === cat) buttonClass += ' active';

          return (
            <Link 
              key={cat} 
              to={`/room/${cat}`} 
              className={buttonClass}
              style={{ textDecoration: 'none' }}
            >
              {EXHIBITION_NAMES[cat] || cat}
            </Link>
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
          {displayArtworks.map((art: any) => (
            <ArtCard key={art.id} art={art} />
          ))}
        </div>

        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
          className="scroll-to-top-btn"
          title="一番上に戻る"
        >
          ⬆️
        </button>
      </main>
    </>
  );
}

export default function App() {
  const [artworks, setArtworks] = useState<Artwork[] | null>(null);
  
  useEffect(() => {
    const SERVICE_DOMAIN = 'y3scy93hal';
    const API_KEY = 'rSrEE2AyKedsAWFehddImURmlgNucTzu8PHB';
    fetch(`https://${SERVICE_DOMAIN}.microcms.io/api/v1/artworks?limit=100`, {
      headers: { 'X-MICROCMS-API-KEY': API_KEY }
    })
      .then(res => res.json())
      .then(data => setArtworks(data.contents))
      .catch(err => console.error(err));
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

  return (
    <BrowserRouter>
      <div className="museum-container">
        <header className="museum-header">
          <h1>ひかりARTMUSEUM</h1>
        </header>

        <Routes>
          <Route 
            path="/" 
            element={<ExhibitionRoom publicArtworks={publicArtworks} categories={categories} activeEvent={activeEvent} />} 
          />
          <Route 
            path="/room/:categoryId" 
            element={<ExhibitionRoom publicArtworks={publicArtworks} categories={categories} activeEvent={activeEvent} />} 
          />
        </Routes>

        <footer className="museum-footer">
          <div className="footer-bottom">
            <p>© 2026 ひかりARTMUSEUM</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}