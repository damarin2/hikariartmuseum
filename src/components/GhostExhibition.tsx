import { useState } from 'react';
import type { Artwork } from '../types';

type GhostExhibitionProps = {
  ghostArts: Artwork[];
};

export default function GhostExhibition({ ghostArts }: GhostExhibitionProps) {
  return (
    <div className="min-h-screen bg-[#1A202C] text-[#E2E8F0] p-4 pb-20">
      <header className="text-center mb-10 pt-8">
        <h2 className="text-2xl font-bold tracking-widest text-[#FBD38D]">
          ぷかぷか・おばけ展 👻
        </h2>
        <p className="mt-3 text-xs opacity-80">
          よるの びじゅつかんに、かわいい おばけたちが あつまったよ。<br/>
          タッチすると なにかが おこるかも…？
        </p>
      </header>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-6 max-w-3xl mx-auto px-4">
        {ghostArts.map((art) => (
          <InteractiveGhost key={art.id} art={art} />
        ))}
      </div>
    </div>
  );
}

type InteractiveGhostProps = {
  art: Artwork;
};

function InteractiveGhost({ art }: InteractiveGhostProps) {
  const [isSurprised, setIsSurprised] = useState(false);
  const imageUrl = art.photo?.url;

  const handleTap = () => {
    if (isSurprised) return;
    setIsSurprised(true);
    setTimeout(() => setIsSurprised(false), 1500);
  };

  return (
    <div 
      className="flex flex-col items-center justify-center cursor-pointer"
      onClick={handleTap}
    >
      <div 
        style={{ width: '160px', height: '160px', position: 'relative' }} 
        className="flex items-center justify-center"
      >
        <img 
          src={imageUrl} 
          alt="おばけのえ" 
          style={{ 
            width: '160px', 
            height: '160px', 
            minWidth: '160px', 
            minHeight: '160px', 
            maxWidth: '160px', 
            maxHeight: '160px',
            objectFit: 'contain' 
          }}
          className={`drop-shadow-lg transition-all duration-300 ${
            isSurprised ? 'scale-110 rotate-12 opacity-50' : 'animate-bounce'
          }`}
        />
        
        {isSurprised && (
          <span className="absolute text-[14px] font-bold text-white drop-shadow-md animate-ping">
            ばぁ！
          </span>
        )}
      </div>
      
      <h3 className="mt-2 text-center text-xs font-bold text-[#FBD38D] truncate w-full px-1">
        {art.title}
      </h3>
    </div>
  );
}