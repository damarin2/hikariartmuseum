import type { Artwork } from '../types';

interface ArtCardProps {
  art: Artwork;
  hideExplanation?: boolean; // ← クイズ展で解説を隠すためのフラグ
}

export default function ArtCard({ art, hideExplanation = false }: ArtCardProps) {
  return (
    <article className="art-card">
      <div className="art-image-wrapper">
        <img src={art.photo?.url} alt={art.title} />
      </div>

      <div className="art-info">
        <h3 className="art-title">{art.title}</h3>

        {/* hideExplanation が true のときは解説を表示しない */}
        {!hideExplanation && art.comments && (
          <div className="art-comment">
            <p>「{art.comments}」</p>
          </div>
        )}
      </div>
    </article>
  );
}
