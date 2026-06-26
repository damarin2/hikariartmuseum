import type { Artwork } from '../types';

interface ArtCardProps {
  art: Artwork;
}

export default function ArtCard({ art }: ArtCardProps) {
  return (
    <article className="art-card">
      <div className="art-image-wrapper">
        <img src={art.photo?.url} alt={art.title} />
      </div>
      <div className="art-info">
        <h3 className="art-title">{art.title}</h3>
        {art.comments && (
          <div className="art-comment">
            <p>「{art.comments}」</p>
          </div>
        )}
      </div>
    </article>
  );
}