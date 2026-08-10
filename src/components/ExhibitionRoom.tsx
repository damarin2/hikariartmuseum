import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ArtCard from './ArtCard';
import PictureFrame from './PictureFrame'; 
import { EXHIBITION_NAMES, PERMANENT_CATEGORIES, SPECIAL_LINKS } from '../constants';
import type { Artwork, ExhibitionEvent } from '../types';

interface ExhibitionRoomProps {
  publicArtworks: Artwork[];
  categories: string[];
  activeEvent: ExhibitionEvent | undefined;
}

interface SpecialLink {
  path: string;
  label: string;
  color: string;
  start: Date;
  end: Date;
}

export default function ExhibitionRoom({ publicArtworks, categories }: ExhibitionRoomProps) {
  const { categoryId } = useParams(); 
  const activeCategory = categoryId || null;

  const today = new Date();
  const activeSpecialLinks = SPECIAL_LINKS.filter((link: SpecialLink) => {
    const endOfDay = new Date(link.end);
    endOfDay.setHours(23, 59, 59, 999);
    return today >= link.start && today <= endOfDay;
  });

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

        {activeSpecialLinks.map((link: SpecialLink) => (
          <Link 
            key={link.path}
            to={link.path} 
            className="btn-special"
            style={{ textDecoration: 'none', backgroundColor: link.color }}
          >
            {link.label}
          </Link>
        ))}

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
        {/*
        {activeEvent && (
          <div className={`special-banner ${activeEvent.type}`}>
            {activeEvent.message}
          </div>
        )}
       */}

        {activeCategory && (
          <div className="section-title">
            <h2>{EXHIBITION_NAMES[activeCategory] || activeCategory}</h2>
          </div>
        )}

        <div className={activeCategory === null ? 'spotlight-grid' : 'gallery-grid'}>
          {/* 🌟 2. ここが額縁の魔法をかける部分です！ */}
          {displayArtworks.map((art: any) => {
            
            // 美術館の全作品（publicArtworks）が1つ以上あり、
            // かつ、今描画しようとしている絵のIDが、全作品の0番目（一番新しい絵）のIDと同じなら true になる
            const isAbsoluteLatest = publicArtworks.length > 0 && art.id === publicArtworks[0].id;
            
            // 最新作ならキャンディ、それ以外はクラシックにする
            const frameTheme = isAbsoluteLatest ? 'candy' : 'classic';

            return (
              // ArtCard を PictureFrame で包み込みます。
              // ループの一番外側の箱になるので、key={art.id} は PictureFrame の方に移動させます。
              <PictureFrame key={art.id} theme={frameTheme}>
                <ArtCard art={art} />
              </PictureFrame>
            );
          })}
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