// src/components/ScratchArtRoom.tsx
import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Artwork } from '../types';

interface ScratchArtRoomProps {
  latestArt: Artwork | undefined;
}

export default function ScratchArtRoom({ latestArt }: ScratchArtRoomProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // キャンバスを黒く塗りつぶす初期設定
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#1a1a1a'; // スクラッチの表面の色（濃いグレー）
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [latestArt]);

  // なぞった部分を削る（透明にする）関数
  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out'; // ここが「削る」魔法の設定
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2); // 25は削る円の大きさ（太さ）
    ctx.fill();
  };

  // マウス操作の処理
  const handleMouseDown = (e: React.MouseEvent) => { setIsDrawing(true); scratch(e.clientX, e.clientY); };
  const handleMouseMove = (e: React.MouseEvent) => { if (isDrawing) scratch(e.clientX, e.clientY); };
  const handleMouseUp = () => setIsDrawing(false);

  // タッチ操作（スマホ）の処理
  const handleTouchStart = (e: React.TouchEvent) => { setIsDrawing(true); scratch(e.touches[0].clientX, e.touches[0].clientY); };
  const handleTouchMove = (e: React.TouchEvent) => { if (isDrawing) scratch(e.touches[0].clientX, e.touches[0].clientY); };

  if (!latestArt) return <div className="loading-screen">作品を準備中...</div>;

  return (
    <main className="museum-main" style={{ textAlign: 'center' }}>
      <div className="section-title">
        <h2>✨ スクラッチ体験ルーム ✨</h2>
        <p style={{ marginTop: '10px' }}>黒い画面を削って、最新の作品を見つけてね！</p>
      </div>

      <div 
        style={{ 
          position: 'relative', 
          width: '300px', 
          height: '300px', 
          margin: '20px auto',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          backgroundColor: '#fff' // 万が一画像が読み込まれる前の背景色
        }}
      >
        {/* 下の層：実際の作品画像 */}
        <img 
          src={latestArt.photo?.url} 
          alt={latestArt.title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
        />
        {/* 上の層：削るための黒いキャンバス */}
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          style={{ position: 'absolute', top: 0, left: 0, cursor: 'crosshair', touchAction: 'none' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        />
      </div>

      <div style={{ marginTop: '30px' }}>
        <Link to="/" className="btn-default" style={{ textDecoration: 'none' }}>
          展示室に戻る
        </Link>
      </div>
    </main>
  );
}