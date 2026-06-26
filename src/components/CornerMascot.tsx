import { useState, useEffect } from 'react';

export default function CornerMascot() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // 5秒間表示したあと、退場アニメーションを開始
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      // アニメーションが終わるのを待ってから完全に消去
      setTimeout(() => setIsVisible(false), 800);
    }, 20000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`corner-mascot-container ${isFadingOut ? 'mascot-exit' : ''}`}>
      <div className="mascot-speech-bubble">
        わあ、すてきな作品がいっぱいだね！
      </div>
      <div className="mascot-body">
        <span className="mascot-icon">🦄</span>
      </div>
    </div>
  );
}