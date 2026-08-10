import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ExhibitionRoom from './components/ExhibitionRoom';
import ScratchArtRoom from './components/ScratchArtRoom';
import NewsList from './components/NewsList';
import NavigationBar from './components/NavigationBar';
import GhostExhibition from './components/GhostExhibition';
import type { Artwork } from './types';
import { EXHIBITION_SCHEDULE, PERMANENT_CATEGORIES } from './constants';
import './App.css';

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
  
  // 今日の日付が start と end の間にあるイベントを探す
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

  const ghostArts = artworks.filter(art => getCategoryName(art.category) === 'august-ghost');

  const categories: string[] = Array.from(
    new Set(publicArtworks.map(art => getCategoryName(art.category)).filter(Boolean) as string[])
  );

  return (
    <BrowserRouter>
      <div className="museum-container">
        <NavigationBar categories={categories} />

        {/* ▼▼▼ 追加：テロップ（マーキー）部分 ▼▼▼ */}
        {/* 開催中のイベントがあり、かつ message が設定されていれば表示する */}
        {activeEvent && activeEvent.message && (
          <div className="ticker-wrap">
            <div className="ticker-move">
              <span className="ticker-item">
                {activeEvent.message}
              </span>
            </div>
          </div>
        )}
        {/* ▲▲▲ 追加ここまで ▲▲▲ */}

        <Routes>
          <Route 
            path="/" 
            element={<ExhibitionRoom publicArtworks={publicArtworks} categories={categories} activeEvent={activeEvent} />} 
          />
          <Route 
            path="/room/:categoryId" 
            element={<ExhibitionRoom publicArtworks={publicArtworks} categories={categories} activeEvent={activeEvent} />} 
          />
          <Route 
            path="/scratch" 
            element={<ScratchArtRoom latestArt={publicArtworks[0]} />} 
          />
          <Route 
            path="/news" 
            element={<NewsList />} 
          />
          <Route 
            path="/ghost" 
            element={<GhostExhibition ghostArts={ghostArts} />} 
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