import { useTheme } from '../context/ThemeContext';
import { useState, useRef } from 'react';
import TypeBadge from './TypeBadge';
import { USER_TYPES } from '../data/mockData';
import { Star, Users, Briefcase, TrendingUp, TrendingDown } from 'lucide-react';

const getMatchTags = (user) => {
  const thesis = (() => { try { return JSON.parse(localStorage.getItem('any1_thesis') || '[]'); } catch { return []; } })();
  const matches = [];
  if (thesis.includes('tech') && user.tags?.some(t => ['AI','Tech','SaaS','Engineering','Fintech'].includes(t))) matches.push('Matches your Tech interest');
  if (thesis.includes('business') && (user.type === 'investor' || user.type === 'founder')) matches.push('Matches your Business thesis');
  if (thesis.includes('arts') && user.type === 'expert' && user.tags?.some(t => ['Film','TV','Music','Acting'].includes(t))) matches.push('Matches your Arts interest');
  if (thesis.includes('sport') && user.tags?.some(t => ['MuayThai','Kickboxing','Sport'].includes(t))) matches.push('Matches your Sport interest');
  if (thesis.includes('food') && user.tags?.some(t => ['Food','Restaurants','Miznon'].includes(t))) matches.push('Matches your Food interest');
  if (thesis.includes('media') && user.tags?.some(t => ['TV','Radio','Media'].includes(t))) matches.push('Matches your Media interest');
  if (user.change > 8) matches.push(`Up ${user.change}% this week`);
  if (user.investors > 100) matches.push(`${user.investors} backers`);
  if (matches.length === 0) matches.push(`${user.investors} people believe in them`);
  return matches.slice(0, 2);
};

export default function SwipeCard({ user, onSwipeLeft, onSwipeRight, onSwipeUp, isTop }) {
  const { theme } = useTheme();
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [glowing, setGlowing] = useState(false);
  const startRef = useRef(null);
  const typeInfo = USER_TYPES[user.type];

  const handleStart = (clientX, clientY) => { startRef.current = { x: clientX, y: clientY }; setDragging(true); };
  const handleMove = (clientX, clientY) => {
    if (!startRef.current || !isTop) return;
    const dx = clientX - startRef.current.x;
    const dy = clientY - startRef.current.y;
    setDrag({ x: dx, y: dy * 0.4 });
    setGlowing(dy < -60);
  };
  const handleEnd = () => {
    if (!dragging) return;
    setDragging(false); setGlowing(false);
    if (drag.y < -80 && onSwipeUp) onSwipeUp(user);
    else if (drag.x > 80) onSwipeRight(user);
    else if (drag.x < -80) onSwipeLeft(user);
    setDrag({ x: 0, y: 0 });
    startRef.current = null;
  };

  const rotation = drag.x * 0.07;
  const interestedOpacity = Math.min(1, drag.x / 60);
  const skipOpacity = Math.min(1, -drag.x / 60);
  const upOpacity = Math.min(1, -drag.y / 60);
  const matchTags = getMatchTags(user);
  const positive = user.change >= 0;

  return (
    <div
      onMouseDown={e => handleStart(e.clientX, e.clientY)}
      onMouseMove={e => dragging && handleMove(e.clientX, e.clientY)}
      onMouseUp={handleEnd} onMouseLeave={handleEnd}
      onTouchStart={e => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={e => { e.preventDefault(); handleMove(e.touches[0].clientX, e.touches[0].clientY); }}
      onTouchEnd={handleEnd}
      style={{
        position: 'absolute', width: '100%',
        background: theme.surface,
        border: `1.5px solid ${glowing ? theme.accent : `${typeInfo?.color || theme.border2}33`}`,
        borderRadius: 24, overflow: 'hidden',
        cursor: isTop ? 'grab' : 'default',
        transform: `translateX(${drag.x}px) translateY(${drag.y}px) rotate(${rotation}deg)`,
        transition: dragging ? 'none' : 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        userSelect: 'none', WebkitUserSelect: 'none',
        boxShadow: glowing ? `0 0 40px ${theme.accent}55, 0 0 80px ${theme.accent}22` : 'none',
      }}
    >
      <div style={{ position: 'absolute', top: 28, left: 20, zIndex: 10, border: `3px solid ${theme.up}`, borderRadius: 8, padding: '4px 14px', opacity: interestedOpacity, transform: 'rotate(-12deg)', background: `${theme.up}18` }}>
        <span style={{ color: theme.up, fontWeight: 900, fontSize: 20, letterSpacing: 2 }}>INTERESTED</span>
      </div>
      <div style={{ position: 'absolute', top: 28, right: 20, zIndex: 10, border: `3px solid ${theme.down}`, borderRadius: 8, padding: '4px 14px', opacity: skipOpacity, transform: 'rotate(12deg)', background: `${theme.down}18` }}>
        <span style={{ color: theme.down, fontWeight: 900, fontSize: 20, letterSpacing: 2 }}>SKIP</span>
      </div>
      <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10, border: `3px solid ${theme.accent}`, borderRadius: 12, padding: '8px 24px', opacity: upOpacity, background: `${theme.accent}18`, backdropFilter: 'blur(4px)' }}>
        <span style={{ color: theme.accent, fontWeight: 900, fontSize: 22, letterSpacing: 2 }}>BACK</span>
      </div>

      <div style={{ position: 'relative' }}>
        <img src={user.cover || user.avatar} alt={user.name} style={{ width: '100%', height: 260, objectFit: 'cover' }} draggable={false} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(transparent 40%, ${theme.bg} 100%)` }} />
        {glowing && <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 50%, ${theme.accent}22, transparent 70%)`, pointerEvents: 'none' }} />}
        <div style={{ position: 'absolute', top: 14, right: 14 }}><TypeBadge type={user.type} size="md" /></div>
        <div style={{ position: 'absolute', top: 14, left: 14, background: '#0000009a', backdropFilter: 'blur(8px)', borderRadius: 20, padding: '5px 12px', border: '1px solid #ffffff11' }}>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>${(user.marketCap / 1000).toFixed(0)}k</span>
          <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 700, color: positive ? theme.up : theme.down }}>{positive ? '+' : ''}{user.change}%</span>
        </div>
        <div style={{ position: 'absolute', bottom: -20, left: 16 }}>
          <img src={user.avatar} alt="" style={{ width: 52, height: 52, borderRadius: '50%', border: `3px solid ${theme.surface}`, objectFit: 'cover' }} />
        </div>
      </div>

      <div style={{ padding: '28px 16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: theme.text }}>{user.name}</div>
            <div style={{ fontSize: 12, color: theme.muted }}>{user.handle} - {user.location}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: `${theme.accent}18`, borderRadius: 8, padding: '4px 8px' }}>
            <Star size={11} color={theme.accent} fill={theme.accent} />
            <span style={{ fontSize: 12, color: theme.accent, fontWeight: 700 }}>{user.reputation}</span>
          </div>
        </div>
        <div style={{ fontSize: 13, color: theme.text2, marginBottom: 12, lineHeight: 1.45 }}>{user.bio?.slice(0, 100)}{user.bio?.length > 100 ? '...' : ''}</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          {matchTags.map((tag, i) => (
            <span key={i} style={{ fontSize: 10, color: theme.accent, background: `${theme.accent}15`, border: `1px solid ${theme.accent}33`, borderRadius: 6, padding: '3px 8px', fontWeight: 600 }}>{tag}</span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Users size={12} color={theme.muted} />
            <span style={{ fontSize: 11, color: theme.muted }}>{user.investors} backers</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Briefcase size={12} color={theme.muted} />
            <span style={{ fontSize: 11, color: theme.muted }}>{user.missions} missions</span>
          </div>
          {positive
            ? <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><TrendingUp size={12} color={theme.up} /><span style={{ fontSize: 11, color: theme.up, fontWeight: 600 }}>Rising</span></div>
            : <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><TrendingDown size={12} color={theme.down} /><span style={{ fontSize: 11, color: theme.down, fontWeight: 600 }}>Falling</span></div>
          }
        </div>
      </div>

      <div style={{ padding: '0 16px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 10, color: theme.border2 }}>Skip</span>
        <span style={{ fontSize: 10, color: theme.border2 }}>Swipe up to Back</span>
        <span style={{ fontSize: 10, color: theme.border2 }}>Interested</span>
      </div>
    </div>
  );
}