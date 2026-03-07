import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockUsers, USER_TYPES } from '../data/mockData';
import SwipeCard from '../components/SwipeCard';
import BottomNav from '../components/BottomNav';
import { X, Heart, DollarSign, RotateCcw } from 'lucide-react';

export default function Discover() {
  const navigate = useNavigate();
  const [stack, setStack] = useState([...mockUsers].reverse());
  const [passed, setPassed] = useState([]);
  const [interested, setInterested] = useState([]);
  const [filter, setFilter] = useState('all');

  const filtered = stack.filter(u => filter === 'all' || u.type === filter);
  const topUser = filtered[filtered.length - 1];

  const handlePass = (user) => {
    setPassed(p => [...p, user]);
    setStack(s => s.filter(u => u.id !== user.id));
  };

  const handleInterested = (user) => {
    setInterested(i => [...i, user]);
    setStack(s => s.filter(u => u.id !== user.id));
  };

  const handleInvest = (user) => {
    navigate(`/user/${user.id}`);
  };

  const handleUndo = () => {
    if (passed.length > 0) {
      const last = passed[passed.length - 1];
      setPassed(p => p.slice(0, -1));
      setStack(s => [...s, last]);
    }
  };

  const topCards = filtered.slice(-3);

  // Match reason hint
  const getHint = (user) => {
    if (!user) return '';
    if (user.change > 8) return `🔥 Up ${user.change}% this week`;
    if (user.type === 'expert') return `⭐ Expert in their craft`;
    if (user.investors > 40) return `👥 ${user.investors} people believe in them`;
    return `💡 Shared your interests`;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0A0A',
      paddingBottom: 90,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      {/* Header */}
      <div style={{ padding: '54px 20px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#FFF' }}>Discover</div>
          <div style={{ fontSize: 13, color: '#444' }}>{filtered.length} left</div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {[{ id: 'all', label: 'All', color: '#2EC4B6' }, ...Object.values(USER_TYPES)].map(t => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              style={{
                background: filter === t.id ? `${t.color}20` : '#111',
                border: `1px solid ${filter === t.id ? t.color : '#1E1E1E'}`,
                borderRadius: 20,
                padding: '6px 14px',
                color: filter === t.id ? t.color : '#444',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Swipe area */}
      <div style={{ flex: 1, position: 'relative', margin: '0 16px', height: 500 }}>
        {filtered.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', height: 400, gap: 16,
          }}>
            <div style={{ fontSize: 48 }}>👀</div>
            <div style={{ color: '#FFF', fontWeight: 700, fontSize: 18 }}>You've seen everyone</div>
            <div style={{ color: '#555', fontSize: 14 }}>{interested.length} people you're interested in</div>
            <button
              onClick={() => { setStack([...mockUsers].reverse()); setPassed([]); setInterested([]); }}
              style={{
                background: '#2EC4B6', color: '#0A0A0A',
                border: 'none', borderRadius: 14, padding: '12px 24px',
                fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 8,
              }}
            >
              Start Over
            </button>
          </div>
        ) : (
          <>
            {topCards.map((user, i) => (
              <div
                key={user.id}
                style={{
                  position: 'absolute', width: '100%',
                  transform: i < topCards.length - 1
                    ? `scale(${0.94 + i * 0.03}) translateY(${(topCards.length - 1 - i) * -12}px)`
                    : 'scale(1) translateY(0)',
                  zIndex: i,
                  transition: 'transform 0.3s ease',
                }}
              >
                <SwipeCard
                  user={user}
                  isTop={i === topCards.length - 1}
                  onSwipeLeft={handlePass}
                  onSwipeRight={handleInterested}
                />
              </div>
            ))}
            {/* Hint */}
            {topUser && (
              <div style={{
                position: 'absolute', bottom: -32, left: 0, right: 0,
                textAlign: 'center',
              }}>
                <span style={{ fontSize: 12, color: '#444' }}>{getHint(topUser)}</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Action buttons - Pass / Interested / Invest */}
      {filtered.length > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          padding: '32px 0 12px',
        }}>
          {/* Pass */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <button
              onClick={() => topUser && handlePass(topUser)}
              style={{
                width: 58, height: 58, borderRadius: '50%',
                background: '#161616',
                border: '1.5px solid #E0555533',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <X size={22} color="#E05555" />
            </button>
            <span style={{ fontSize: 10, color: '#333', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pass</span>
          </div>

          {/* Undo - small */}
          <button
            onClick={handleUndo}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: '#111',
              border: '1px solid #1E1E1E',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              marginBottom: 18,
            }}
          >
            <RotateCcw size={14} color="#333" />
          </button>

          {/* Interested */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <button
              onClick={() => topUser && handleInterested(topUser)}
              style={{
                width: 58, height: 58, borderRadius: '50%',
                background: '#16222A',
                border: '1.5px solid #2EC4B655',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <Heart size={22} color="#2EC4B6" />
            </button>
            <span style={{ fontSize: 10, color: '#333', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Interested</span>
          </div>

          {/* Invest */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <button
              onClick={() => topUser && handleInvest(topUser)}
              style={{
                width: 72, height: 72, borderRadius: '50%',
                background: '#F5C842',
                border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 6px 24px #F5C84255',
                transition: 'all 0.2s ease',
              }}
            >
              <DollarSign size={26} color="#0A0A0A" strokeWidth={2.5} />
            </button>
            <span style={{ fontSize: 10, color: '#F5C842', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Invest</span>
          </div>
        </div>
      )}

      {interested.length > 0 && (
        <div style={{ textAlign: 'center', paddingBottom: 8 }}>
          <span style={{ fontSize: 12, color: '#2EC4B6' }}>
            {interested.length} interested
          </span>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
