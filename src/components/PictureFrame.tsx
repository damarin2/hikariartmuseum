import　type { ReactNode } from 'react';

// 額縁の種類（テーマ）の定義
type FrameTheme = 'candy' | 'classic';

interface PictureFrameProps {
  children: ReactNode; // 中に入る絵（ArtCard）
  theme?: FrameTheme;  // 額縁のテーマ（省略した場合は 'classic' になる）
}

export default function PictureFrame({ children, theme = 'classic' }: PictureFrameProps) {
  return (
    // 渡された theme（'candy' など）に合わせて、CSSのクラス名が切り替わります
    <div className={`frame-wrapper theme-${theme}`}>
      <div className="inner-mat">
        {children}
      </div>
    </div>
  );
}