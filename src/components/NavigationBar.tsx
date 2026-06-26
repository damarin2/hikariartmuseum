import { useState } from 'react';
import { Link } from 'react-router-dom';

interface NavigationBarProps {
  categories: string[];
}

export default function NavigationBar({ categories }: NavigationBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-header">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>🎨 ひかりART MUSEUM</Link>
        <button className="hamburger-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? '✖' : '☰'}
        </button>
      </div>
      <div className={`navbar-links ${isOpen ? 'open' : ''}`}>
        <Link to="/" onClick={closeMenu}>🏠 ホーム</Link>
        <Link to="/scratch" onClick={closeMenu}>✨ スクラッチ</Link>
        {categories.map(cat => (
          <Link key={cat} to={`/room/${cat}`} onClick={closeMenu}>🖼️ {cat}展</Link>
        ))}
      </div>
    </nav>
  );
}