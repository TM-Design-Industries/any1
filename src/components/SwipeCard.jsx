import { useState, useRef } from 'react';
import TypeBadge from './TypeBadge';
import { USER_TYPES } from '../data/mockData';
import { Star, Users, Briefcase, X, Heart, TrendingUp } from 'lucide-react';

export default function SwipeCard({ user, onSwipeLeft, onSwipeRight, isTop }) {
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const startRef = useRef(null);
  const typeInfo = USER_TYPES[user.type];

  const handleStart = (clientX, clientY) => {
    startRef.current = { x: clientX, y: clientY };
    setDragging(true);
  };

  const handleMove = (clientX, clientY) => {
    if (!startRef.current || !isTop) return;
    setDrag({
      x: clientX - startRef.current.x,
      y: (clientY - startRef.current.y) * 0.3,
    });
  };

  const handleEnd = () => {
    if (!dragging) return;
    setDragging(false);
    if (drag.x > 80) onSwipeRight(user);
    else if (drag.x < -80) onSwipeLeft(user);
    else setDrag({ x: 0, y: 0 });
    startRef.current = null;
  };

  const rotation = drag.x * 0.08;
  const opacity = Math.max(0, 1 - Math.abs(drag.x) / 300);
  const likeOpacity = Math.min(1, drag.x / 60);
  const nopeOpacity = Math.min(1, -drag.x / 60);

  return (
    <div
      onMouseDown={e => handleStart(e.clientX, e.clientY)}
      onMouseMove={e => dragging && handleMove(e.clientX, e.clientY)}
      onMouseUp={handleEnd}
      onTouchStart={e => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={e => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={handleEnd}
      style={{
        position: 'absolute',
        width: '100%',
        background: '#2A2520',
        border: `1px solid ${typeInfo?.color || '#332C24'}33`,
        borderRadius: 24,
        overflow: 'hidden',
        cursor: isTop ? 'grab' : 'default',
        transform: `translateX(${drag.x}px) translateY(${drag.y}px) rotate(${rotation}deg)`,
        transition: dragging ? 'none' : 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      {/* Like / Nope overlays */}
      <div style={{
        position: 'absolute', top: 24, left: 24, zIndex: 10,
        border: '3px solid #C9A84C', borderRadius: 8,
        padding: '4px 12px', opacity: likeOpacity,
        transform: 'rotate(-15deg)',
      }}>
        <span style={{ color: '#C9A84C', fontWeight: 900, fontSize: 22, letterSpacing: 2 }}>INVEST</span>
      </div>
      <div style={{
        position: 'absolute', top: 24, right: 24, zIndex: 10,
        border: '3px solid #E05555', borderRadius: 8,
        padding: '4px 12px', opacity: nopeOpacity,
        transform: 'rotate(15deg)',
      }}>
        <span style={{ color: '#C0564A', fontWeight: 900, fontSize: 22, letterSpacing: 2 }}>PASS</span>
      </div>

      {/* Avatar full-width */}
      <div style={{ position: 'relative' }}>
        <img
          src={user.avatar}
          alt={user.name}
          style={{ width: '100%', height: 280, objectFit: 'cover' }}
          draggable={false}
        />
        {/* gradient overlay */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 140,
          background: 'linear-gradient(transparent, #111)',
        }} />
        {/* Type badge on image */}
        <div style={{ position: 'absolute', top: 16, right: 16 }}>
          <TypeBadge type={user.type} size="md" />
        </div>
        {/* Market cap pill */}
        <div style={{
          position: 'absolute', top: 16, left: 16,
          background: '#221E1Aaa',
          backdropFilter: 'blur(8px)',
          borderRadius: 20,
          padding: '5px 12px',
          border: '1px solid #1F1F1F',
        }}>
          <span style={{ color: '#F2EDE6', fontWeight: 700, fontSize: 13 }}>
            ${user.marketCap.toLocaleString()}
          </span>
          <span style={{
            marginLeft: 6, fontSize: 11, fontWeight: 600,
            color: user.change >= 0 ? '#C9A84C' : '#C0564A',
          }}>
            {user.change >= 0 ? '+' : ''}{user.change}%
          </span>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '16px 18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <div>
            <span style={{ fontSize: 20, fontWeight: 800, color: '#F2EDE6' }}>{user.name}</span>
            <span style={{ fontSize: 13, color: '#7A6E62', marginLeft: 8 }}>{user.handle}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Star size={12} color="#D4A843" fill="#D4A843" />
            <span style={{ fontSize: 13, color: '#D4A843', fontWeight: 700 }}>{user.reputation}</span>
          </div>
        </div>

        <div style={{ fontSize: 14, color: '#B5A898', marginBottom: 12, lineHeight: 1.4 }}>
          {user.bio}
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Users size={13} color="#7A6E62" />
            <span style={{ fontSize: 12, color: '#7A6E62' }}>{user.investors} investors</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Briefcase size={13} color="#7A6E62" />
            <span style={{ fontSize: 12, color: '#7A6E62' }}>{user.missions} missions</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <TrendingUp size={13} color="#7A6E62" />
            <span style={{ fontSize: 12, color: '#7A6E62' }}>${user.collateral.toLocaleString()} locked</span>
          </div>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {user.tags?.map(tag => (
            <span key={tag} style={{
              fontSize: 11, color: typeInfo?.color || '#7A6E62',
              background: `${typeInfo?.color || '#7A6E62'}15`,
              border: `1px solid ${typeInfo?.color || '#7A6E62'}33`,
              borderRadius: 6, padding: '3px 10px',
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}



