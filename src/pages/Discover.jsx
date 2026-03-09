import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { mockUsers, USER_TYPES } from '../data/mockData';
import SwipeCard from '../components/SwipeCard';
import BottomNav from '../components/BottomNav';
import { X, Heart, RotateCcw, ArrowUp, CheckCircle, DollarSign } from 'lucide-react';

export default function Discover({ onSettingsOpen }) {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [stack, setStack] = useState([...mockUsers].reverse());
  const [passed, setPassed] = useState([]);
  const [interested, setInterested] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showBackModal, setShowBackModal] = useState(false);
  const [backUser, setBackUser] = useState(null);
  const [backAmount, setBackAmount] = useState('');
  const [backed, setBacked] = useState(false);
  const [lastAction, setLastAction] = useState(null);

  const filtered = stack.filter(u => filter === 'all' || u.type === filter);
  const topCards = filtered.slice(-3);
  const topUser = filtered[filtered.length - 1];

  const handlePass = (user) => {
    setLastAction({ type: 'pass', user });
    setStack(s => s.filter(u => u.id !== user.id));
    setPassed(p => [...p, user]);
  };

  const handleInterested = (user) => {
    setLastAction({ type: 'interested', user });
    setStack(s => s.filter(u => u.id !== user.id));
    setInterested(i => [...i, user]);
  };

  const handleSwipeUp = (user) => {
    setBackUser(user);
    setShowBackModal(true);
    setBacked(false);
    setBackAmount('');
  };

  const handleUndo = () => {
    if (!lastAction) return;
    setStack(s => [...s, lastAction.user]);
    if (lastAction.type === 'pass') setPassed(p => p.filter(u => u.id !== lastAction.user.id));
    if (lastAction.type === 'interested') setInterested(i => i.filter(u => u.id !== lastAction.user.id));
    setLastAction(null);
  };

  const confirmBack = () => {
    if (!backAmount || !backUser) return;
    const portfolio = JSON.parse(localStorage.getItem('any1_portfolio') || '[]');
    if (!portfolio.find(p => p.userId === backUser.id)) {
      portfolio.push({ userId: backUser.id, shares: 1, buyPrice: backUser.marketCap, currentPrice: backUser.marketCap });
    }
    localStorage.setItem('any1_portfolio', JSON.stringify(portfolio));
    const cards = JSON.parse(localStorage.getItem('any1_backer_cards') || '[]');
    cards.push({ userId: backUser.id, name: backUser.name, avatar: backUser.avatar, amount: parseFloat(backAmount), valuationAtBuy: backUser.marketCap, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) });
    localStorage.setItem('any1_backer_cards', JSON.stringify(cards));
    setStack(s => s.filter(u => u.id !== backUser.id));
    setBacked(true);
    setTimeout(() => { setShowBackModal(false); setBackUser(null); }, 1800);
  };

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, display: 'flex', flexDirection: 'column' }}>
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`}</style>

      {/* Header */}
      <div style={{ padding: '54px 20px 12px', flexShrink: 0, background: theme.bg }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: theme.text }}>Discover</div>
            <div style={{ fontSize: 12, color: theme.muted, marginTop: 2 }}>Swipe right to follow - left to skip - up to back</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {interested.length > 0 && (
              <div style={{ background: `${theme.up}22`, border: `1px solid ${theme.up}44`, borderRadius: 10, padding: '4px 10px' }}>
                <span style={{ fontSize: 11, color: theme.up, fontWeight: 700 }}>{interested.length} interested</span>
              </div>
            )}
            <span style={{ fontSize: 13, color: theme.muted }}>{filtered.length} left</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {[{ id: 'all', label: 'All', color: theme.accent }, ...Object.values(USER_TYPES)].map(t => (
            <button key={t.id} onClick={() => setFilter(t.id)} style={{
              background: filter === t.id ? `${t.color}22` : 'transparent',
              border: `1px solid ${filter === t.id ? t.color : theme.border}`,
              borderRadius: 20, padding: '5px 14px',
              color: filter === t.id ? t.color : theme.muted,
              fontSize: 11, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
            }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Card stack */}
      <div style={{ flex: 1, position: 'relative', margin: '0 16px', minHeight: 480 }}>
        {filtered.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 420, gap: 16 }}>
            <div style={{ fontSize: 44 }}>🎉</div>
            <div style={{ color: theme.text, fontWeight: 700, fontSize: 18 }}>You've seen everyone</div>
            <div style={{ color: theme.muted, fontSize: 14 }}>{interested.length} people you're interested in</div>
            <button onClick={() => { setStack([...mockUsers].reverse()); setPassed([]); setInterested([]); setLastAction(null); }} style={{ background: theme.accent, color: theme.bg, border: 'none', borderRadius: 14, padding: '12px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              Start Over
            </button>
          </div>
        ) : (
          topCards.map((user, i) => {
            const isTopCard = i === topCards.length - 1;
            const offset = topCards.length - 1 - i;
            return (
              <div key={user.id} style={{
                position: 'absolute', width: '100%',
                transform: isTopCard ? 'scale(1) translateY(0)' : `scale(${0.94 + i * 0.03}) translateY(${offset * -14}px)`,
                zIndex: i,
                transition: 'transform 0.3s ease',
              }}>
                <SwipeCard user={user} isTop={isTopCard} onSwipeLeft={handlePass} onSwipeRight={handleInterested} onSwipeUp={handleSwipeUp} />
              </div>
            );
          })
        )}
      </div>

      {/* Action buttons */}
      {filtered.length > 0 && (
        <div style={{ padding: '16px 0 8px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <button onClick={() => topUser && handlePass(topUser)} style={{ width: 60, height: 60, borderRadius: '50%', background: theme.surface2, border: `1.5px solid ${theme.down}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={24} color={theme.down} />
              </button>
              <span style={{ fontSize: 10, color: theme.down, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Skip</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <button onClick={() => topUser && handleSwipeUp(topUser)} style={{ width: 64, height: 64, borderRadius: '50%', background: theme.accent, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: `0 4px 20px ${theme.accent}55` }}>
                <DollarSign size={26} color={theme.bg} strokeWidth={2.5} />
              </button>
              <span style={{ fontSize: 10, color: theme.accent, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Back</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <button onClick={() => topUser && handleInterested(topUser)} style={{ width: 60, height: 60, borderRadius: '50%', background: theme.surface2, border: `1.5px solid ${theme.up}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Heart size={24} color={theme.up} />
              </button>
              <span style={{ fontSize: 10, color: theme.up, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Interested</span>
            </div>
          </div>
          {lastAction && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
              <button onClick={handleUndo} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: theme.muted, fontSize: 12 }}>
                <RotateCcw size={13} /> Undo
              </button>
            </div>
          )}
        </div>
      )}

      {/* Back modal */}
      {showBackModal && backUser && (
        <div style={{ position: 'fixed', inset: 0, background: '#000000cc', backdropFilter: 'blur(10px)', zIndex: 300, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', maxWidth: 430, margin: '0 auto', background: theme.surface, borderRadius: '24px 24px 0 0', padding: '28px 20px 48px', border: `1px solid ${theme.accent}33`, animation: 'slideUp 0.3s ease', boxShadow: `0 -8px 40px ${theme.accent}22` }}>
            <div style={{ width: 36, height: 4, background: theme.border2, borderRadius: 2, margin: '0 auto 24px' }} />
            {backed ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <CheckCircle size={48} color={theme.accent} style={{ display: 'block', margin: '0 auto 12px' }} />
                <div style={{ fontSize: 18, fontWeight: 800, color: theme.text, marginBottom: 6 }}>You backed {backUser.name.split(' ')[0]}!</div>
                <div style={{ fontSize: 13, color: theme.muted }}>Added to your portfolio</div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                  <img src={backUser.avatar} alt="" style={{ width: 54, height: 54, borderRadius: '50%', border: `2px solid ${theme.accent}44` }} />
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 800, color: theme.text }}>Back {backUser.name}</div>
                    <div style={{ fontSize: 12, color: theme.muted }}>Valuation: ${(backUser.marketCap / 1000).toFixed(0)}k - {backUser.change >= 0 ? '+' : ''}{backUser.change}%</div>
                  </div>
                </div>
                <div style={{ background: theme.surface2, borderRadius: 12, padding: '12px 16px', marginBottom: 16, fontSize: 12, color: theme.muted, lineHeight: 1.5 }}>
                  You discovered {backUser.name.split(' ')[0]} on Discover. Back them now and it appears in your portfolio.
                </div>
                <div style={{ fontSize: 11, color: theme.muted, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Choose amount</div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                  {['1', '5', '10', '50'].map(v => (
                    <button key={v} onClick={() => setBackAmount(v)} style={{
                      flex: 1, background: backAmount === v ? `${theme.accent}22` : theme.surface2,
                      border: `1px solid ${backAmount === v ? theme.accent : theme.border2}`,
                      borderRadius: 10, padding: '10px 4px',
                      color: backAmount === v ? theme.accent : theme.muted,
                      fontSize: 14, fontWeight: 700, cursor: 'pointer',
                    }}>${v}</button>
                  ))}
                </div>
                <input type="number" placeholder="Custom amount ($)" value={backAmount} onChange={e => setBackAmount(e.target.value)} style={{ width: '100%', background: theme.surface2, border: `1px solid ${theme.border2}`, borderRadius: 12, padding: '13px 16px', color: theme.text, fontSize: 15, outline: 'none', marginBottom: 16, boxSizing: 'border-box' }} />
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setShowBackModal(false)} style={{ flex: 1, background: theme.surface2, color: theme.muted, border: `1px solid ${theme.border2}`, borderRadius: 14, padding: 14, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                  <button onClick={confirmBack} style={{ flex: 2, background: backAmount ? theme.accent : theme.surface2, color: backAmount ? theme.bg : theme.muted, border: 'none', borderRadius: 14, padding: 14, fontSize: 15, fontWeight: 700, cursor: backAmount ? 'pointer' : 'default' }}>
                    {backAmount ? `Back ${backUser.name.split(' ')[0]} - $${backAmount}` : 'Enter amount'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div style={{ paddingBottom: 90 }} />
      <BottomNav onSettingsOpen={onSettingsOpen} />
    </div>
  );
}
